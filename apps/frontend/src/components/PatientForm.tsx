"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { FormFieldType, userFormSchema } from "../types";
import z from "zod";

import CustomFormField from "./CustomFormField";
import SubmitButton from "./SubmitButton";
import { useState, useEffect } from "react";
import { Form } from "../../components/ui/form";
import { useSignUp, useAuth } from "@clerk/nextjs"; // ✅ Add useAuth
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";

const PatientForm = () => {

  const { isLoaded, signUp, setActive } = useSignUp();
  const { isSignedIn, signOut } = useAuth(); // ✅ Add this
  const router = useRouter()

  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      abhaId: "",
      otp: "",
    },
  })

  useEffect(() => {
    if (isSignedIn) {
      setError("You're already signed in. Please sign out to create a new account.");
    }
  }, [isSignedIn]);

  if (!isLoaded) {
    return null;
  }

  const getErrorMessage = (clerkError: any): string => {
    if (!clerkError?.errors || clerkError.errors.length === 0) {
      return "Something went wrong. Please try again.";
    }

    const error = clerkError.errors[0];
    const code = error.code;
    const message = error.message;

    switch (code) {
      case "session_exists":
      case "identifier_already_signed_in":
        return "You're already signed in. Please sign out first to create a new account.";
      case "form_identifier_exists":
        return "This email is already registered. Please sign in or use a different email.";
      case "form_password_pwned":
        return "This password has been found in a data breach. Please choose a more secure password.";
      case "form_password_length_too_short":
        return "Password is too short. Please use at least 8 characters.";
      case "form_password_not_strong_enough":
        return "Password is not strong enough. Use a mix of letters, numbers, and symbols.";
      case "form_param_format_invalid":
        return "Invalid email format. Please check your email address.";
      case "form_identifier_not_found":
        return "No account found with this email.";
      case "form_password_incorrect":
        return "Incorrect password. Please try again.";
      case "verification_expired":
        return "Verification code expired. Please request a new one.";
      case "verification_failed":
        return "Invalid verification code. Please check and try again.";
      case "too_many_requests":
        return "Too many attempts. Please wait a few minutes and try again.";
      case "network_error":
        return "Network error. Please check your connection and try again.";
      default:
        return message || "Something went wrong. Please try again.";
    }
  };

  async function onSubmit({ name, email, password }: z.infer<typeof userFormSchema>) {
    if (!isLoaded || !signUp) {
      setError("Authentication service is loading. Please wait...");
      return;
    }

    if (isSignedIn) {
      setError("You're already signed in. Please sign out first.");
      return;
    }

    setIsLoading(true)
    setError("")

    try {
      await signUp.create({
        emailAddress: email,
        firstName: name.split(" ")[0],
        lastName: name.split(" ").slice(1).join(" "),
        password: password,
        unsafeMetadata: {
          abhaId: form.getValues("abhaId"),
        },
      })

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
      setPendingVerification(true);
      setError("")

    } catch (error: unknown) {
      console.error("Sign up error:", error);
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  async function onVerify({ otp }: z.infer<typeof userFormSchema>) {
    if (!isLoaded || !signUp || !setActive) {
      setError("Authentication service is loading. Please wait...");
      return;
    }

    if (!otp) {
      setError("Please enter the verification code.");
      return;
    }

    try {
      setIsLoading(true);
      setError("")

      const result = await signUp.attemptEmailAddressVerification({ code: otp });

      if (result.status === "complete") {
        if (!result.createdSessionId) {
          throw new Error("Session creation failed. Please try again.");
        }

        await setActive({ session: result.createdSessionId });

        const userId = result.createdUserId;
        if (!userId) {
          throw new Error("User ID not found. Please contact support.");
        }

        router.push(`/patients/${userId}/register`)

      } else {
        setError(`Verification incomplete. Status: ${result.status}. Please try again.`);
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  async function resendCode() {
    if (!isLoaded || !signUp) {
      setError("Authentication service is loading. Please wait...");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setError("✅ New verification code sent to your email!");
      setTimeout(() => setError(""), 3000);

    } catch (error: unknown) {
      console.error("Resend error:", error);
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const handleBackToSignup = () => {
    setPendingVerification(false);
    setError("");
    form.reset();
  }

  // ✅ Handle sign out
  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
      setError("");
      form.reset();
    } catch (error) {
      console.error("Sign out error:", error);
      setError("Failed to sign out. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      {!pendingVerification ? (
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex-1 space-y-6"
        >
          <section className="mb-8 space-y-4">
            <h1 className="text-[32px] leading-[36px] font-bold">
              Hi There...🖐️
            </h1>
            <p className="text-sm text-muted-foreground">
              Schedule your First appointment.
            </p>
          </section>

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="Full Name"
            placeholder="John Doe"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email"
            placeholder="johndoe@gmail.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            iconSrc="/assets/icons/abha.svg"
            iconAlt="password"
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="abhaId"
            label="ABHA ID"
            placeholder="ABCX12345678"
            iconSrc="/assets/icons/abha.svg"
            iconAlt="abha"
          />

          {error && (
            <div className="p-3 text-sm rounded-md border bg-red-50 border-red-200">
              <p className="text-red-500 mb-2">{error}</p>
              {isSignedIn && (
                <Button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="text-sm text-blue-600  hover:text-blue-800 underline disabled:opacity-50"
                >
                  Sign out and create new account
                </Button>
              )}
            </div>
          )}


          <SubmitButton type="submit" isLoading={isLoading} disabled={isSignedIn}>
            Get Started
          </SubmitButton>
        </form>
      ) : (
        <div className="flex-1 space-y-6">
          <section className="mb-6 space-y-2">
            <h2 className="text-2xl font-bold">Verify OTP</h2>
            <p className="text-sm text-muted-foreground">
              We sent a 6-digit code to your email
            </p>
          </section>

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="otp"
            label="Verification Code"
            placeholder="Enter 6-digit OTP"
          />

          {error && (
            <div className={`p-3 text-sm rounded-md border ${error.includes("✅")
                ? "text-green-600 bg-green-50 border-green-200"
                : "text-red-500 bg-red-50 border-red-200"
              }`}>
              {error}
            </div>
          )}

          <SubmitButton
            type="button"
            isLoading={isLoading}
            onClick={form.handleSubmit(onVerify)}
          >
            Verify & Continue
          </SubmitButton>

          <div className="text-center space-y-3">
            <div>
              <button
                type="button"
                onClick={resendCode}
                disabled={isLoading}
                className="text-sm text-blue-600 hover:text-blue-800 underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Didn&apos;t receive code? Resend
              </button>
            </div>

            <div>
              <button
                type="button"
                onClick={handleBackToSignup}
                disabled={isLoading}
                className="text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Back to sign up
              </button>
            </div>
          </div>
        </div>
      )}
    </Form>
  )
}

export default PatientForm