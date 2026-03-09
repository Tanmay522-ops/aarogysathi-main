"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    DoctorFormValidation,
    FormFieldType,
    SpecializationOptions,
} from "../types";
import z from "zod";

import CustomFormField from "./CustomFormField";
import SubmitButton from "./SubmitButton";
import { useEffect, useState } from "react";
import FileUploader from "./FileUploader";
import { Form, FormControl } from "../../components/ui/form";
import { SelectItem } from "../../components/ui/select";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { Button } from "../../components/ui/button";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { cn } from "../../lib/utils";
import { toast } from "sonner";


export function DoctorRegisterForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { getToken } = useAuth();
    const { user: clerkUser, isLoaded, isSignedIn } = useUser();

    const form = useForm<z.infer<typeof DoctorFormValidation>>({
        resolver: zodResolver(DoctorFormValidation),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            availability: new Date(),
            specialization: "",
            qualification: "",
            licenseNumber: "",
            experience: 0,
            consultationFee: 0,
            address: "",
            about: "",
            emergencyContactName: "",
            emergencyContactNumber: "",
            licenseDocument: undefined,
            profileImage: undefined,
            termsConsent: false,
            codeOfConductConsent: false,
        }
    });


    useEffect(() => {
        if (!isLoaded) return;

        if (!isSignedIn || !clerkUser) {
            router.push("/sign-in");
            return;
        }

        const role = clerkUser.publicMetadata?.role;
        if (role !== "doctor") {
            router.push("/unauthorized");
            return;
        }
        form.reset({
            name: clerkUser.fullName ?? "",
            email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
        });
    }, [isLoaded, isSignedIn, clerkUser?.id, router, form]);

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center p-12">
                <p className="text-lg">Verifying account...</p>
            </div>
        );
    }

    if (!isSignedIn || !clerkUser) {
        return null;
    }

    async function onSubmit(values: z.infer<typeof DoctorFormValidation>) {
        setIsLoading(true);

        const loadingToast = toast.loading("Registering doctor profile...");

        try {
            const formData = new FormData();

            Object.keys(values).forEach((key) => {
                const value = values[key as keyof typeof values];

                if ((key === "licenseDocument" || key === "profileImage") && value) {
                    if (value instanceof FileList) {
                        formData.append(key, value[0]!);
                    } else if (Array.isArray(value) && value[0] instanceof File) {
                        formData.append(key, value[0]);
                    }
                } else if (key === "availability" && value instanceof Date) {
                    formData.append(key, value.toISOString());
                } else if (typeof value === "boolean") {
                    formData.append(key, String(value));
                } else if (
                    key === "experience" ||
                    key === "consultationFee"
                ) {
                    formData.append(key, String(value));
                } else if (value !== null && value !== undefined && value !== "") {
                    formData.append(key, String(value));
                }
            });

            const token = await getToken();

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_APPOINTMENT_API_URL}/doctors/register`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            let data: any = null;

            try {
                data = await response.json();
            } catch {
                throw new Error("Server returned invalid response");
            }
            
            if (response.status === 404) {
                toast.error("Your account was deleted. Please login again.", {
                    id: loadingToast,
                });

                setTimeout(() => {
                    router.push("/sign-in");
                }, 1500);

                return;
            }
            

            if (!response.ok) {
                throw new Error(
                    data?.error ||
                    data?.message ||
                    "Registration failed"
                );
            }

            toast.success("Doctor profile created successfully!", {
                id: loadingToast,
            });

            router.push(`/doctors/${data.doctor.id}/dashboard`);
        } catch (err: any) {
            toast.error(err.message || "Something went wrong", {
                id: loadingToast,
            });
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-12">
                {/* HEADER */}
                <section className="space-y-4">
                    <h1 className="text-[32px] leading-[36px] font-bold md:text-[36px] md:leading-[40px]">
                        Doctor Registration 👨‍⚕️
                    </h1>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Join our healthcare platform and start helping patients.
                    </p>
                </section>

                {/* PERSONAL INFORMATION */}
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="text-[18px] leading-[24px] font-bold md:text-[24px] md:leading-[28px]">
                            Personal Information
                        </h2>
                    </div>

                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="name"
                        label="Full Name"
                        placeholder="Dr. John Doe"
                        iconSrc="/assets/icons/user.svg"
                        iconAlt="user"
                    />

                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="email"
                            label="Email"
                            placeholder="doctor@hospital.com"
                            iconSrc="/assets/icons/email.svg"
                            iconAlt="email"
                        />
                        <CustomFormField
                            fieldType={FormFieldType.PHONE_INPUT}
                            control={form.control}
                            name="phone"
                            label="Phone Number"
                            placeholder="+91 98765 43210"
                        />
                    </div>

                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="address"
                        label="Clinic/Hospital Address"
                        placeholder="123 Medical Center, New Delhi"
                    />

                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="emergencyContactName"
                            label="Emergency Contact Name"
                            placeholder="Emergency contact person"
                        />
                        <CustomFormField
                            fieldType={FormFieldType.PHONE_INPUT}
                            control={form.control}
                            name="emergencyContactNumber"
                            label="Emergency Contact Number"
                            placeholder="+91 98765 43210"
                        />
                    </div>
                </section>

                {/* PROFESSIONAL INFORMATION */}
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="text-[18px] leading-[24px] font-bold md:text-[24px] md:leading-[28px]">
                            Professional Information
                        </h2>
                    </div>

                    <CustomFormField
                        fieldType={FormFieldType.SELECT}
                        control={form.control}
                        name="specialization"
                        label="Specialization"
                        placeholder="Select your specialization"
                    >
                        {SpecializationOptions.map((specialization) => (
                            <SelectItem key={specialization} value={specialization}>
                                {specialization}
                            </SelectItem>
                        ))}
                    </CustomFormField>

                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="qualification"
                        label="Qualifications"
                        placeholder="MBBS, MD (Medicine), Fellowship in Cardiology"
                    />

                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="licenseNumber"
                            label="Medical License Number"
                            placeholder="MCI-123456"
                            iconSrc="/assets/icons/email.svg"
                            iconAlt="license"
                        />
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="experience"
                            label="Years of Experience"
                            type="number"
                            placeholder="10"
                            iconSrc="/assets/icons/email.svg"
                            iconAlt="experience"
                        />
                    </div>

                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="consultationFee"
                            label="Consultation Fee (₹)"
                            placeholder="500"
                            type="number"
                            iconSrc="/assets/icons/email.svg"
                            iconAlt="fee"
                        />
                        <CustomFormField
                            fieldType={FormFieldType.DATE_PICKER}
                            control={form.control}
                            name="availability"
                            label="Availability (Date & Time)"
                            showTimeSelect
                            dateFormat="MM/dd/yyyy - h:mm aa"
                        />

                    </div>

                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="about"
                        label="About (Optional)"
                        placeholder="Brief description about yourself and your practice..."
                    />
                </section>

                {/* DOCUMENTS */}
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="text-[18px] leading-[24px] font-bold md:text-[24px] md:leading-[28px]">
                            Documents & Verification
                        </h2>
                    </div>

                    <CustomFormField
                        fieldType={FormFieldType.SKELETON}
                        control={form.control}
                        name="licenseDocument"
                        label="Upload Medical License Document"
                        renderSkeleton={(field) => (
                            <FormControl>
                                <FileUploader files={field.value} onChange={field.onChange} />
                            </FormControl>
                        )}
                    />

                    <CustomFormField
                        fieldType={FormFieldType.SKELETON}
                        control={form.control}
                        name="profileImage"
                        label="Upload Profile Photo (Optional)"
                        renderSkeleton={(field) => (
                            <FormControl>
                                <FileUploader files={field.value} onChange={field.onChange} />
                            </FormControl>
                        )}
                    />
                </section>

                {/* CONSENT */}
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="text-[18px] leading-[24px] font-bold md:text-[24px] md:leading-[28px]">
                            Terms & Conditions
                        </h2>
                    </div>

                    <CustomFormField
                        fieldType={FormFieldType.CHECKBOX}
                        control={form.control}
                        name="termsConsent"
                        label="I agree to the terms and conditions of the platform."
                    />

                    <CustomFormField
                        fieldType={FormFieldType.CHECKBOX}
                        control={form.control}
                        name="codeOfConductConsent"
                        label="I agree to follow the medical code of conduct and maintain patient confidentiality."
                    />
                </section>

                <SubmitButton isLoading={isLoading}>
                    Complete Registration
                </SubmitButton>
            </form>
        </Form>
    );
}

export default DoctorRegisterForm;