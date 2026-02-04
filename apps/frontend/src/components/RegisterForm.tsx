"use client"


import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Doctors, FormFieldType, IdentificationTypes, PatientFormDefaultValues, PatientFormValidation } from "../types";
import z, { optional } from "zod";


import CustomFormField from "./CustomFormField";
import SubmitButton from "./SubmitButton";
import { useState } from "react";


import { GenderOptions } from "../types";

import Image from "next/image";
import FileUploader from "./FileUploader";
import { Form, FormControl } from "../../components/ui/form";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";
import { SelectItem } from "../../components/ui/select";





export function RegisterForm() {

    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof PatientFormValidation>>({
        resolver: zodResolver(PatientFormValidation),
        defaultValues:{
            ...PatientFormDefaultValues,
            name:"",
            email:"",
            phone:"",
        }
    });



    async function onSubmit({ name, email, phone }: z.infer<typeof PatientFormValidation>) {
        setIsLoading(true)
        try {
            const userData = { name, email, phone }
            // we have to take this userData and pass it somewhere to create this user in the database

        } catch (error) {
            console.log(error)

        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" flex-1 space-y-12  ">
                <section className=" space-y-4">
                    <h1 className="text-[32px] leading-[36px] font-bold md:text-[36px] leading-[40px] font-bold"> Welcome..🖐️ </h1>
                    <p className="text-sm text-muted-foreground leading-relaxed">Let us know more about yourself.</p>
                </section>
                <section className=" space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="text-[18px] leading-[24px] font-bold md:text-[24px] leading-[28px] font-bold">Personal Information.</h2>
                    </div>

                    <CustomFormField
                        // Here we are defining fieldType here
                        // filed type will be used to render different types of inputs or fileds

                        // {/* NAME */}

                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="name"
                        label="Full Name"
                        placeholder="John Doe"
                        iconSrc="/assets/icons/user.svg"
                        iconAlt="user"

                    />

                    {/* EMAIL & PHONE */}

                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="email"
                            label="Email"
                            placeholder="johndoe@gmail.com "
                            iconSrc="/assets/icons/email.svg"
                            iconAlt="email"
                        />
                        <CustomFormField
                            fieldType={FormFieldType.PHONE_INPUT}
                            control={form.control}
                            name="Phone"
                            label="Phone Number"
                            placeholder="(555)-123-4567 "
                        />
                    </div>

                    {/* BirthDate & Gender */}

                    <div className="flex flex-col gap-6 xl:flex-row ">
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

                            // reason we are calling skelton becz we can pass the rendorskeloton property
                            renderSkeleton={(field) => (
                                <FormControl>
                                    <RadioGroup className="flex h-11 gap-6 xl:justify-between"
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        {GenderOptions.map((option) => (
                                            <div key={option} className="flex h-full flex-1 items-center gap-2 rounded-md border border-dashed border-dark-500 bg-dark-400 p-3 bg-[#2121215f]">
                                                <RadioGroupItem value={option} id={option} />
                                                <Label htmlFor={option}
                                                    className="cursor-pointer">
                                                    {option}
                                                </Label>
                                            </div>
                                        ))}

                                    </RadioGroup>
                                </FormControl>
                            )}
                        />
                    </div>

                    {/* Address & Occupation */}

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

                    {/* Emergency Contact Name & Emergency Contact Number */}

                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="emergencyContactName"
                            label="Emergency contact name"
                            placeholder="Gaurdian's name"
                        />
                        <CustomFormField
                            fieldType={FormFieldType.PHONE_INPUT}
                            control={form.control}
                            name="emergencyContactNumber"
                            label="Emergency contact number"
                            placeholder="(555)-123-4567 "
                        />
                    </div>
                </section>

                {/* Medical information */}

                <section className=" space-y-6">
                    <div className="mb-9 space-y-1">
                        <h1 className="text-[18px] leading-[24px] font-bold md:text-[24px] leading-[28px] font-bold">Medical Information.</h1>
                    </div>


                    {/* PRIMARY CARE PHYSICIAN */}
                    <CustomFormField
                        fieldType={FormFieldType.SELECT}
                        control={form.control}
                        name="primaryPhysician"
                        label="Primary Physician"
                        placeholder="Select a Physician"

                    // now we pass the additional children in the custom form field
                    >
                        {Doctors.map((doctor) => (
                            <SelectItem
                                key={doctor.name}
                                value={doctor.name}
                                className="shad-select-item"
                            >
                                <div className="flex cursor-pointer items-center gap-2">
                                    <Image
                                        src={doctor.image}
                                        width={32}
                                        height={32}
                                        alt={doctor.name}
                                        className="rounded-full border border-dark-500"
                                    />
                                    <p>{doctor.name}</p>
                                </div>
                            </SelectItem>
                        ))}

                    </CustomFormField>

                    {/* INSURANCE & POLICY NUMBER */}

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

                    {/* ALLERGY & CURRENT MEDICATIONS */}
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
                            name="currentMedications"
                            label="current medication (if any)"
                            placeholder="Ibuprofen 200mg, paracetamol 500mg"
                        />
                    </div>


                    {/* FAMILY MEDICATION & PAST MEDICATIONS */}

                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            fieldType={FormFieldType.TEXTAREA}
                            control={form.control}
                            name="familyMedicalHistory"
                            label=" Family medical history (if relevant)"
                            placeholder="Mention if you have any disease in your family"
                        />

                        <CustomFormField
                            fieldType={FormFieldType.TEXTAREA}
                            control={form.control}
                            name="pastMedicalHistory"
                            label="Past medical history"
                            placeholder="Mention any Past medical History"
                        />
                    </div>
                </section>

                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="text-[18px] leading-[24px] font-bold md:text-[24px] leading-[28px] font-bold">Identification and Verfication</h2>
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

                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="text-[18px] leading-[24px] font-bold md:text-[24px] leading-[28px] font-bold">Consent and Privacy</h2>
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
                        label="I consent to the use and disclosure of my health
                            information for treatment purposes."
                    />

                    <CustomFormField
                        fieldType={FormFieldType.CHECKBOX}
                        control={form.control}
                        name="privacyConsent"
                        label="I acknowledge that I have reviewed and agree to the
                            privacy policy"
                    />
                </section>
                <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
            </form>
        </Form>
    )
}

export default RegisterForm
