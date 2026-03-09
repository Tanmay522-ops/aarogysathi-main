import { coerce, z } from "zod"
export const userFormSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be at most 50 characters"),
    email: z.string().email("Invalid email address"),
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

// Add to your existing types file

export const DoctorFormValidation = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be at most 50 characters"),
    email: z.string().email("Invalid email address"),
    phone: z
        .string()
        .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
    specialization: z
        .string()
        .min(2, "Specialization is required")
        .max(100, "Specialization must be at most 100 characters"),
    qualification: z
        .string()
        .min(2, "Qualification is required")
        .max(200, "Qualification must be at most 200 characters"),
    licenseNumber: z
        .string()
        .min(5, "License number is required")
        .max(50, "License number must be at most 50 characters"),
    // ✅ FIX: Use union and transform
    experience: z.number().min(0, "Experience must be at least 0 years").max(70, "Experience seems invalid"),
    consultationFee: z.number().min(0, "Consultation fee must be positive").max(100000, "Consultation fee seems too high"),
    address: z
        .string()
        .min(5, "Address must be at least 5 characters")
        .max(500, "Address must be at most 500 characters"),
    availability: z.date(), 
    about: z
        .string()
        .min(10, "About must be at least 10 characters")
        .max(1000, "About must be at most 1000 characters")
        .optional(),
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
    licenseDocument: z.custom<File[]>().optional(),
    profileImage: z.custom<File[]>().optional(),
    termsConsent: z.boolean().refine(val => val === true, {
        message: "You must agree to the terms and conditions",
    }),
    codeOfConductConsent: z.boolean().refine(val => val === true, {
        message: "You must agree to the code of conduct",
    }),
});

export type DoctorFormInput = z.infer<typeof DoctorFormValidation>;


export const SpecializationOptions = [
    "General Physician",
    "Cardiologist",
    "Dermatologist",
    "Pediatrician",
    "Orthopedic",
    "Neurologist",
    "Gynecologist",
    "Psychiatrist",
    "Dentist",
    "Ophthalmologist",
    "ENT Specialist",
    "Pulmonologist",
    "Gastroenterologist",
    "Urologist",
    "Endocrinologist",
    "Oncologist",
    "Radiologist",
    "Anesthesiologist",
    "Pathologist",
    "Other",
] as const;


export const DoctorFormDefaultValues = {
    name: "",
    email: "",
    phone: "",
    specialization: "",
    qualification: "",
    licenseNumber: "",
    experience: 0,
    consultationFee: 0,
    address: "",
    availability: {
        date: undefined,
        slots: [],
    },
    about: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    licenseDocument: [] ,
    profileImage: [],
    termsConsent: false,
    codeOfConductConsent: false,
};


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
    abhaId: z.string().min(5, "ABHA ID is required").optional().or(z.literal("")),
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





export const AppointmentStatusOptions = [
    "PENDING",
    "SCHEDULED",
    "CONFIRMED",
    "CANCELLED",
    "COMPLETED",
    "NO_SHOW",
] as const;

export type AppointmentStatus = (typeof AppointmentStatusOptions)[number];

// Base Appointment Schema (shared fields)
const BaseAppointmentSchema = z.object({
    doctorId: z.string().min(1, "Please select a doctor"),
    schedule: z.date().refine((date) => date > new Date(), {
        message: "Appointment must be scheduled for a future date",
    }),
    reason: z
        .string()
        .min(2, "Reason must be at least 2 characters")
        .max(500, "Reason must be at most 500 characters")
        .optional(),
    note: z
        .string()
        .max(1000, "Note must be at most 1000 characters")
        .optional(),
});

// Create Appointment Schema (for patients)
export const CreateAppointmentSchema = BaseAppointmentSchema.extend({
    reason: z
        .string()
        .min(2, "Reason must be at least 2 characters")
        .max(500, "Reason must be at most 500 characters"), // Required for creation
});

// Schedule/Confirm Appointment Schema (for doctors/admin)
export const ScheduleAppointmentSchema = BaseAppointmentSchema.extend({
    status: z.enum(["SCHEDULED", "CONFIRMED"]).optional(),
    note: z.string().optional(),
});

// Cancel Appointment Schema
export const CancelAppointmentSchema = z.object({
    cancellationReason: z
        .string()
        .min(2, "Cancellation reason must be at least 2 characters")
        .max(500, "Cancellation reason must be at most 500 characters"),
});

// Complete Appointment Schema (for doctors)
export const CompleteAppointmentSchema = z.object({
    note: z
        .string()
        .max(1000, "Note must be at most 1000 characters")
        .optional(),
});

// Update Appointment Schema (for admin/doctor)
export const UpdateAppointmentSchema = z.object({
    doctorId: z.string().optional(),
    schedule: z.date().optional(),
    reason: z.string().max(500).optional(),
    note: z.string().max(1000).optional(),
    status: z.enum([
        "PENDING",
        "SCHEDULED",
        "CONFIRMED",
        "CANCELLED",
        "COMPLETED",
        "NO_SHOW",
    ]).optional(),
    cancellationReason: z.string().max(500).optional(),
});

// Reschedule Appointment Schema
export const RescheduleAppointmentSchema = z.object({
    schedule: z.date().refine((date) => date > new Date(), {
        message: "Appointment must be scheduled for a future date",
    }),
    reason: z
        .string()
        .max(500, "Reason must be at most 500 characters")
        .optional(),
});

// Helper function to get the right schema
export function getAppointmentSchema(type: string) {
    switch (type) {
        case "create":
            return CreateAppointmentSchema;
        case "schedule":
        case "confirm":
            return ScheduleAppointmentSchema;
        case "cancel":
            return CancelAppointmentSchema;
        case "complete":
            return CompleteAppointmentSchema;
        case "reschedule":
            return RescheduleAppointmentSchema;
        case "update":
            return UpdateAppointmentSchema;
        default:
            return CreateAppointmentSchema;
    }
}

// Type exports
export type CreateAppointmentInput = z.infer<typeof CreateAppointmentSchema>;
export type ScheduleAppointmentInput = z.infer<typeof ScheduleAppointmentSchema>;
export type CancelAppointmentInput = z.infer<typeof CancelAppointmentSchema>;
export type CompleteAppointmentInput = z.infer<typeof CompleteAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof UpdateAppointmentSchema>;
export type RescheduleAppointmentInput = z.infer<typeof RescheduleAppointmentSchema>;

// Default values for appointment forms
export const CreateAppointmentDefaultValues = {
    doctorId: "",
    schedule: new Date(),
    reason: "",
    note: "",
};

export const ScheduleAppointmentDefaultValues = {
    doctorId: "",
    schedule: new Date(),
    reason: "",
    note: "",
    status: "SCHEDULED" as const,
};

export const CancelAppointmentDefaultValues = {
    cancellationReason: "",
};

// Appointment display/filter helpers
export const AppointmentStatusColors = {
    PENDING: "bg-yellow-100 text-yellow-800",
    SCHEDULED: "bg-blue-100 text-blue-800",
    CONFIRMED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    COMPLETED: "bg-gray-100 text-gray-800",
    NO_SHOW: "bg-orange-100 text-orange-800",
} as const;

export const AppointmentStatusLabels = {
    PENDING: "Pending",
    SCHEDULED: "Scheduled",
    CONFIRMED: "Confirmed",
    CANCELLED: "Cancelled",
    COMPLETED: "Completed",
    NO_SHOW: "No Show",
} as const;