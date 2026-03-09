"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { FormFieldType, IdentificationTypes, PatientFormDefaultValues, PatientFormValidation } from "../types";
import z, { optional } from "zod";

import CustomFormField from "./CustomFormField";
import SubmitButton from "./SubmitButton";
import { useEffect, useState } from "react";

import { GenderOptions } from "../types";

import Image from "next/image";
import FileUploader from "./FileUploader";
import { Form, FormControl } from "../../components/ui/form";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";
import { SelectItem } from "../../components/ui/select";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { toast } from "sonner";

interface Doctor {
    id: string;
    name: string;
    image: string;
    specialization: string;
}

interface RegisterFormProps {
    user: {
        name: string;
        email: string;
    }
}

export function RegisterForm({ user }: RegisterFormProps) {
    if (!user) {
        return <p>Loading...</p>;
    }

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { getToken } = useAuth();
    const { user: clerkUser, isLoaded, isSignedIn } = useUser();

    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [doctorsLoading, setDoctorsLoading] = useState(true);

    useEffect(() => {
        if (isLoaded) {
            if (!isSignedIn || !clerkUser) {
                router.push("/sign-in");
            }
        }
    }, [isLoaded, isSignedIn, clerkUser, router]);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const token = await getToken();
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_APPOINTMENT_API_URL}/doctors/active`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (!res.ok) throw new Error("Failed to fetch doctors");
                const data = await res.json();
                setDoctors(data.doctors ?? []);
            } catch (err) {
                console.error("Error fetching doctors:", err);
            } finally {
                setDoctorsLoading(false);
            }
        };

        if (isLoaded && isSignedIn) {
            fetchDoctors();
        }
    }, [isLoaded, isSignedIn, getToken]);

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

    const form = useForm<z.infer<typeof PatientFormValidation>>({
        resolver: zodResolver(PatientFormValidation),
        defaultValues: {
            name: user?.name ?? clerkUser?.fullName ?? "",
            email: user?.email ?? clerkUser?.primaryEmailAddress?.emailAddress ?? "",
            abhaId: "",
            birthDate: new Date(),
            gender: "Male",
            address: "",
            occupation: "",
            emergencyContactName: "",
            emergencyContactNumber: "",
            primaryPhysician: "",
            insuranceProvider: "",
            insurancePolicyNumber: "",
            allergies: "",
            currentMedication: "",
            familyMedicalHistory: "",
            pastMedicalHistory: "",
            identificationType: "Aadhaar Card",
            identificationNumber: "",
            identificationDocument: undefined,
            treatmentConsent: false,
            disclosureConsent: false,
            privacyConsent: false,
        }
    });

    async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
        setIsLoading(true);
        const loadingToast = toast.loading("Registering patient...");
        try {
            const formData = new FormData();

            Object.keys(values).forEach((key) => {
                const value = values[key as keyof typeof values];

                if (key === "identificationDocument" && value instanceof FileList) {
                    formData.append(key, value[0]!);
                } else if (key === "birthDate" && value instanceof Date) {
                    formData.append(key, value.toISOString());
                } else if (typeof value === "boolean") {
                    formData.append(key, String(value));
                } else if (value !== null && value !== undefined && value !== "") {
                    formData.append(key, String(value));
                }
            });

            const token = await getToken();

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (response.status === 404) {
                toast.error(
                    "Your account has been deleted. Please sign up again.",
                    { id: loadingToast }
                );
                setTimeout(() => router.push("/sign-in"), 1500);
                return;
            }

            if (!response.ok) {
                throw new Error(
                    data?.error ||
                    data?.message ||
                    "Registration failed"
                );
            }

            toast.success("Registration completed successfully!", {
                id: loadingToast,
            });

            router.push(`/patients/${data.patientId}/new-appointment`);

        } catch (error: any) {
            console.error("Registration error:", error);
            setError(error.message || "Failed to register. Please try again.");
            toast.dismiss(loadingToast);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-12">
                <section className="space-y-4">
                    <h1 className="text-[32px] leading-[36px] font-bold md:text-[36px] md:leading-[40px]">
                        Welcome..🖐️
                    </h1>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Let us know more about yourself.
                    </p>
                </section>

                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="text-[18px] leading-[24px] font-bold md:text-[24px] md:leading-[28px]">
                            Personal Information.
                        </h2>
                    </div>

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
                        name="abhaId"
                        label="ABHA ID"
                        placeholder="ABHA ID"
                        iconSrc="/assets/icons/abha.svg"
                        iconAlt="abha"
                    />

                    <div className="flex flex-col gap-6 xl:flex-row">
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
                            fieldType={FormFieldType.PHONE_INPUT}
                            control={form.control}
                            name="phone"
                            label="Phone Number"
                            placeholder="(555)-123-4567"
                        />
                    </div>

                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            fieldType={FormFieldType.DATE_PICKER}
                            control={form.control}
                            name="birthDate"
                            label="Date of Birth"
                        />
                        <CustomFormField
                            fieldType={FormFieldType.SKELETON}
                            control={form.control}
                            name="gender"
                            label="Gender"
                            renderSkeleton={(field) => (
                                <FormControl>
                                    <RadioGroup
                                        className="flex h-11 gap-6 xl:justify-between"
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        {GenderOptions.map((option) => (
                                            <div
                                                key={option}
                                                className="flex h-full flex-1 items-center gap-2 rounded-md border border-dashed border-dark-500 bg-dark-400 p-3 bg-[#2121215f]"
                                            >
                                                <RadioGroupItem value={option} id={option} />
                                                <Label htmlFor={option} className="cursor-pointer">
                                                    {option}
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            )}
                        />
                    </div>

                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="address"
                            label="Address"
                            placeholder="14th Street, New York"
                        />
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="occupation"
                            label="Occupation"
                            placeholder="Software Engineer"
                        />
                    </div>

                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="emergencyContactName"
                            label="Emergency contact name"
                            placeholder="Guardian's name"
                        />
                        <CustomFormField
                            fieldType={FormFieldType.PHONE_INPUT}
                            control={form.control}
                            name="emergencyContactNumber"
                            label="Emergency contact number"
                            placeholder="(555)-123-4567"
                        />
                    </div>
                </section>

                {/* Medical Information */}
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h1 className="text-[18px] leading-[24px] font-bold md:text-[24px] md:leading-[28px]">
                            Medical Information.
                        </h1>
                    </div>

                    {/* PRIMARY CARE PHYSICIAN */}
                    <CustomFormField
                        fieldType={FormFieldType.SELECT}
                        control={form.control}
                        name="primaryPhysician"
                        label="Primary Physician"
                        placeholder={doctorsLoading ? "Loading doctors..." : "Select a Physician"}
                    >
                        {doctorsLoading ? (
                            <SelectItem value="loading" disabled>
                                Loading doctors...
                            </SelectItem>
                        ) : doctors.length === 0 ? (
                            <SelectItem value="none" disabled>
                                No doctors available
                            </SelectItem>
                        ) : (
                            doctors.map((doctor) => (
                                <SelectItem
                                    key={doctor.id}
                                    value={doctor.name}
                                    className="shad-select-item"
                                >
                                    <div className="flex cursor-pointer items-center gap-2">
                                        <Image
                                            src={doctor.image || "/doctors/default.png"}
                                            width={32}
                                            height={32}
                                            alt={doctor.name}
                                            className="rounded-full border border-dark-500"
                                        />
                                        <div>
                                            <p className="font-medium">{doctor.name}</p>
                                            {doctor.specialization && (
                                                <p className="text-xs text-muted-foreground">
                                                    {doctor.specialization}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </SelectItem>
                            ))
                        )}
                    </CustomFormField>

                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="insuranceProvider"
                            label="Insurance provider"
                            placeholder="BlueCross BlueShield"
                        />
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="insurancePolicyNumber"
                            label="Insurance policy number"
                            placeholder="ABC123456789"
                        />
                    </div>

                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            fieldType={FormFieldType.TEXTAREA}
                            control={form.control}
                            name="allergies"
                            label="Allergies (if any)"
                            placeholder="Peanuts, Penicillin, Pollen"
                        />
                        <CustomFormField
                            fieldType={FormFieldType.TEXTAREA}
                            control={form.control}
                            name="currentMedication"
                            label="Current medication (if any)"
                            placeholder="Ibuprofen 200mg, Paracetamol 500mg"
                        />
                    </div>

                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            fieldType={FormFieldType.TEXTAREA}
                            control={form.control}
                            name="familyMedicalHistory"
                            label="Family medical history (if relevant)"
                            placeholder="Mention if you have any disease in your family"
                        />
                        <CustomFormField
                            fieldType={FormFieldType.TEXTAREA}
                            control={form.control}
                            name="pastMedicalHistory"
                            label="Past medical history"
                            placeholder="Mention any past medical history"
                        />
                    </div>
                </section>

                {/* Identification */}
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="text-[18px] leading-[24px] font-bold md:text-[24px] md:leading-[28px]">
                            Identification and Verification
                        </h2>
                    </div>

                    <CustomFormField
                        fieldType={FormFieldType.SELECT}
                        control={form.control}
                        name="identificationType"
                        label="Identification Type"
                        placeholder="Select identification type"
                    >
                        {IdentificationTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                                {type}
                            </SelectItem>
                        ))}
                    </CustomFormField>

                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="identificationNumber"
                        label="Identification Number"
                        placeholder="123456789"
                    />

                    <CustomFormField
                        fieldType={FormFieldType.SKELETON}
                        control={form.control}
                        name="identificationDocument"
                        label="Scanned Copy of Identification Document"
                        renderSkeleton={(field) => (
                            <FormControl>
                                <FileUploader files={field.value} onChange={field.onChange} />
                            </FormControl>
                        )}
                    />
                </section>

                {/* Consent */}
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="text-[18px] leading-[24px] font-bold md:text-[24px] md:leading-[28px]">
                            Consent and Privacy
                        </h2>
                    </div>

                    <CustomFormField
                        fieldType={FormFieldType.CHECKBOX}
                        control={form.control}
                        name="treatmentConsent"
                        label="I consent to receive treatment for my health condition."
                    />

                    <CustomFormField
                        fieldType={FormFieldType.CHECKBOX}
                        control={form.control}
                        name="disclosureConsent"
                        label="I consent to the use and disclosure of my health information for treatment purposes."
                    />

                    <CustomFormField
                        fieldType={FormFieldType.CHECKBOX}
                        control={form.control}
                        name="privacyConsent"
                        label="I acknowledge that I have reviewed and agree to the privacy policy."
                    />
                </section>

                {error && (
                    <div className="rounded-md bg-red-50 p-4 border border-red-200">
                        <p className="text-sm text-red-600 font-medium">{error}</p>
                    </div>
                )}

                <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
            </form>
        </Form>
    );
}

export default RegisterForm;