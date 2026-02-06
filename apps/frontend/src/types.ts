import { z } from "zod"
export const userFormSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be at most 50 characters"),
    email: z.string().email("Invalid email address"),
    abhaId: z.string().min(5, "Abha ID is required"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(50, "Password must be at most 50 characters"),
    otp: z
        .string()
        .optional()
        .refine(
            (val) => !val || (val.length === 6 && /^\d+$/.test(val)),
            "OTP must be 6 digits"
        ),
});

export type UserFormInput = z.infer<typeof userFormSchema>

export enum FormFieldType {
    INPUT = "input",
    TEXTAREA = "textarea",
    PHONE_INPUT = "phone_input",
    CHECKBOX = "Checkbox",
    DATE_PICKER = "datePicker",
    SELECT = "select",
    SKELETON = "skeleton",
}

export const GenderOptions = ["Male", "Female", "Other"] as const;

export type Gender = (typeof GenderOptions)[number];



export const Doctors = [
    {
        image: "/assets/images/dr-green.png",
        name: "John Green",
    },
    {
        image: "/assets/images/dr-cameron.png",
        name: "Leila Cameron",
    },
    {
        image: "/assets/images/dr-livingston.png",
        name: "David Livingston",
    },
    {
        image: "/assets/images/dr-peter.png",
        name: "Evan Peter",
    },
    {
        image: "/assets/images/dr-powell.png",
        name: "Jane Powell",
    },
    {
        image: "/assets/images/dr-remirez.png",
        name: "Alex Ramirez",
    },
    {
        image: "/assets/images/dr-lee.png",
        name: "Jasmine Lee",
    },
    {
        image: "/assets/images/dr-cruz.png",
        name: "Alyana Cruz",
    },
    {
        image: "/assets/images/dr-sharma.png",
        name: "Hardik Sharma",
    },
];


export const IdentificationTypes = [
    "Aadhaar Card",
    "Birth Certificate",
    "Driver's License",
    "Medical Insurance Card/Policy",
    "Military ID Card",
    "National Identity Card",
    "Passport",
    "Resident Alien Card (Green Card)",
    "Social Security Card",
    "State ID Card",
    "Student ID Card",
    "Voter ID Card",
];

export type FileUploaderProps = {
    // files is a type of File which is an array of files 
    // maybe at some time at the start the file will be  undefined so we can define it 
    files: File[] | undefined;
    // onChange is a function that accept files 
    onChange: (files: File[]) => void;
};

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);



export const PatientFormValidation = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be at most 50 characters"),
    email: z.string().email("Invalid email address"),
    abhaId: z.string().min(5, "ABHA ID is required"),
    phone: z
        .string()
        .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
    birthDate: z.date(),
    gender: z.enum(["Male", "Female", "Other"]),
    address: z
        .string()
        .min(5, "Address must be at least 5 characters")
        .max(500, "Address must be at most 500 characters"),
    occupation: z
        .string()
        .min(2, "Occupation must be at least 2 characters")
        .max(500, "Occupation must be at most 500 characters"),
    emergencyContactName: z
        .string()
        .min(2, "Contact name must be at least 2 characters")
        .max(50, "Contact name must be at most 50 characters"),
    emergencyContactNumber: z
        .string()
        .refine(
            (emergencyContactNumber) => /^\+\d{10,15}$/.test(emergencyContactNumber),
            "Invalid phone number"
        ),
    primaryPhysician: z.string().min(2, "Select at least one doctor"),
    insuranceProvider: z
        .string()
        .min(2, "Insurance name must be at least 2 characters")
        .max(50, "Insurance name must be at most 50 characters"),
    insurancePolicyNumber: z
        .string()
        .min(2, "Policy number must be at least 2 characters")
        .max(50, "Policy number must be at most 50 characters"),
    allergies: z.string().optional(),
    currentMedication: z.string().optional(),
    familyMedicalHistory: z.string().optional(),
    pastMedicalHistory: z.string().optional(),
    identificationType: z.string().optional(),
    identificationNumber: z.string().optional(),
    identificationDocument: z.custom<File[]>().optional(),
    treatmentConsent: z.boolean().refine(val => val === true, {
        message: "You must consent to treatment",
    }),
    disclosureConsent: z.boolean().refine(val => val === true, {
        message: "You must consent to disclosure",
    }),
    privacyConsent: z.boolean().refine(val => val === true, {
        message: "You must consent to privacy policy",
    }),


});

export type patientFormInput = z.infer<typeof PatientFormValidation>



export const PatientFormDefaultValues = {
    name: "",
    abhaId: "",
    email: "",
    phone: "",
    birthDate: new Date(Date.now()),
    gender: "Male" as Gender,
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
    identificationDocument: [],
};





export const CreateAppointmentSchema = z.object({
    primaryPhysician: z.string().min(2, "Select at least one doctor"),
    schedule: z.date(),
    reason: z
        .string()
        .min(2, "Reason must be at least 2 characters")
        .max(500, "Reason must be at most 500 characters"),
    note: z.string().optional(),
    cancellationReason: z.string().optional(),
});

export const ScheduleAppointmentSchema = z.object({
    primaryPhysician: z.string().min(2, "Select at least one doctor"),
    schedule: z.date(),
    reason: z.string().optional(),
    note: z.string().optional(),
    cancellationReason: z.string().optional(),
});

export const CancelAppointmentSchema = z.object({
    primaryPhysician: z.string().min(2, "Select at least one doctor"),
    schedule: z.date(),
    reason: z.string().optional(),
    note: z.string().optional(),
    cancellationReason: z
        .string()
        .min(2, "Reason must be at least 2 characters")
        .max(500, "Reason must be at most 500 characters"),
});

export function getAppointmentSchema(type: string) {
    switch (type) {
        case "create":
            return CreateAppointmentSchema;
        case "cancel":
            return CancelAppointmentSchema;
        default:
            return ScheduleAppointmentSchema;
    }
}