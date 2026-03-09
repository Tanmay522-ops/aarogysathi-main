"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormFieldType, getAppointmentSchema, CreateAppointmentDefaultValues, ScheduleAppointmentDefaultValues, CancelAppointmentDefaultValues } from "../types";
import z from "zod";
import CustomFormField from "./CustomFormField";
import SubmitButton from "./SubmitButton";
import { useState, useEffect } from "react";
import Image from "next/image";
import { SelectItem } from "../../components/ui/select";
import { Form } from "../../components/ui/form";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

interface Doctor {
    id: string;
    name: string;
    image: string;
    specialization?: string;
    qualification?: string;
    experience?: number;
    consultationFee?: number;
    availability?: string;
}

const AppointmentForm = ({
    userId,
    patientId,
    type,
    appointmentId,
}: {
    userId: string;
    patientId: string;
    type: "create" | "schedule" | "cancel";
    appointmentId?: string;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [doctorsLoading, setDoctorsLoading] = useState(true);
    const [doctorsError, setDoctorsError] = useState<string | null>(null);
    const router = useRouter();
    const { getToken } = useAuth();

    const AppointmentFormValidation = getAppointmentSchema(type);

    // Get appropriate default values based on type
    const getDefaultValues = () => {
        switch (type) {
            case "create":
                return CreateAppointmentDefaultValues;
            case "schedule":
                return ScheduleAppointmentDefaultValues;
            case "cancel":
                return CancelAppointmentDefaultValues;
            default:
                return CreateAppointmentDefaultValues;
        }
    };

    const form = useForm<z.infer<typeof AppointmentFormValidation>>({
        resolver: zodResolver(AppointmentFormValidation),
        defaultValues: getDefaultValues() as any,
    });

    // Fetch doctors from API
    useEffect(() => {
        const fetchDoctors = async () => {
            if (type === "cancel") {
                setDoctorsLoading(false);
                return;
            }

            try {
                setDoctorsLoading(true);
                const token = await getToken();

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_APPOINTMENT_API_URL}/doctors/active`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log("📡 Response status:", response.status);

                if (!response.ok) {
                    throw new Error("Failed to fetch doctors");
                }

                const data = await response.json();
                setDoctors(data.doctors);
                setDoctorsError(null);
            } catch (err) {
                setDoctorsError(err instanceof Error ? err.message : "An error occurred");
                console.error("Error fetching doctors:", err);
            } finally {
                setDoctorsLoading(false);
            }
        };

        fetchDoctors();
    }, [type, getToken]);

    const onSubmit = async (values: z.infer<typeof AppointmentFormValidation>) => {
        setIsLoading(true);

        try {
            const token = await getToken();

            if (type === "create") {
                // Create new appointment
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_APPOINTMENT_API_URL}/appointments`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            userId,
                            patientId,
                            doctorId: (values as any).doctorId,
                            schedule: (values as any).schedule.toISOString(),
                            reason: (values as any).reason,
                            note: (values as any).note,
                            status: "PENDING",
                        }),
                    }
                );

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || "Failed to create appointment");
                }

                const { appointment } = await response.json();

                router.push(
                    `/patients/${userId}/new-appointment/success?appointmentId=${appointment.id}`
                );
            } else if (type === "cancel" && appointmentId) {
                // Cancel appointment
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_APPOINTMENT_API_URL}/appointments/${appointmentId}/cancel`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            cancellationReason: (values as any).cancellationReason,
                        }),
                    }
                );

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || "Failed to cancel appointment");
                }

                router.push(`/patients/${userId}/appointments`);
            } else if (type === "schedule" && appointmentId) {
                // Schedule appointment (admin only)
                const scheduleData: any = {};

                if ((values as any).schedule) {
                    scheduleData.schedule = (values as any).schedule.toISOString();
                }
                if ((values as any).note !== undefined) {
                    scheduleData.note = (values as any).note;
                }
                if ((values as any).status) {
                    scheduleData.status = (values as any).status;
                }

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_APPOINTMENT_API_URL}/appointments/${appointmentId}/schedule`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(scheduleData),
                    }
                );

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || "Failed to schedule appointment");
                }

                router.push(`/admin/appointments`);
            }
        } catch (error) {
            console.error("Error submitting appointment:", error);
            alert(
                error instanceof Error ? error.message : "Failed to submit appointment"
            );
        } finally {
            setIsLoading(false);
        }
    };

    let buttonLabel;
    switch (type) {
        case "create":
            buttonLabel = "Create Appointment";
            break;
        case "schedule":
            buttonLabel = "Schedule Appointment";
            break;
        case "cancel":
            buttonLabel = "Cancel Appointment";
            break;
        default:
            buttonLabel = "Submit Appointment";
    }

    // Show loading state while fetching doctors
    if (doctorsLoading && type !== "cancel") {
        return (
            <div className="flex items-center justify-center p-8">
                <p className="text-muted-foreground">Loading doctors...</p>
            </div>
        );
    }

    // Show error state if doctors failed to load
    if (doctorsError && type !== "cancel") {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <p className="text-red-500 mb-2">Failed to load doctors</p>
                    <p className="text-sm text-muted-foreground">{doctorsError}</p>
                </div>
            </div>
        );
    }

    // Show message if no doctors available
    if (!doctorsLoading && doctors.length === 0 && type !== "cancel") {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <p className="text-muted-foreground mb-2">No doctors available</p>
                    <p className="text-sm text-muted-foreground">
                        Please contact an administrator to add doctors to the system.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
                <section className="mb-12 space-y-4">
                    <h1 className="text-[32px] leading-[36px] font-bold md:text-[36px] md:leading-[40px]">
                        {type === "create" && "New Appointment 🖐️"}
                        {type === "schedule" && "Schedule Appointment"}
                        {type === "cancel" && "Cancel Appointment"}
                    </h1>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {type === "create" && "Request a new appointment in 10 seconds"}
                        {type === "schedule" && "Confirm appointment details"}
                        {type === "cancel" && "We hope to see you again soon"}
                    </p>
                </section>

                {type !== "cancel" && (
                    <>
                        <CustomFormField
                            fieldType={FormFieldType.SELECT}
                            control={form.control}
                            name="doctorId"
                            label="Doctor"
                            placeholder="Select a doctor"
                        >
                            {doctors.map((doctor) => (
                                <SelectItem key={doctor.id} value={doctor.id}>
                                    <div className="flex cursor-pointer items-center gap-2">
                                        <Image
                                            src={doctor.image || "/doctors/default.png"}
                                            width={32}
                                            height={32}
                                            alt={doctor.name}
                                            className="rounded-full border border-dark-500"
                                        />
                                        <div className="flex flex-col">
                                            <p className="font-medium">{doctor.name}</p>
                                            {doctor.specialization && (
                                                <p className="text-xs text-muted-foreground">
                                                    {doctor.specialization}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </SelectItem>
                            ))}
                        </CustomFormField>

                        <CustomFormField
                            fieldType={FormFieldType.DATE_PICKER}
                            control={form.control}
                            name="schedule"
                            label="Expected appointment date"
                            showTimeSelect
                            dateFormat="MM/dd/yyyy - h:mm aa"
                        />

                        <div className="flex flex-col gap-6 xl:flex-row">
                            <CustomFormField
                                fieldType={FormFieldType.TEXTAREA}
                                control={form.control}
                                name="reason"
                                label={type === "create" ? "Reason for appointment" : "Reason (optional)"}
                                placeholder="Enter reason for appointment"
                            />

                            <CustomFormField
                                fieldType={FormFieldType.TEXTAREA}
                                control={form.control}
                                name="note"
                                label="Notes (optional)"
                                placeholder="Enter additional notes"
                            />
                        </div>

                        {type === "schedule" && (
                            <CustomFormField
                                fieldType={FormFieldType.SELECT}
                                control={form.control}
                                name="status"
                                label="Appointment Status"
                                placeholder="Select status"
                            >
                                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                            </CustomFormField>
                        )}
                    </>
                )}

                {type === "cancel" && (
                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="cancellationReason"
                        label="Reason for cancellation"
                        placeholder="Please provide a reason for cancellation"
                    />
                )}

                <SubmitButton
                    isLoading={isLoading}
                    className={`${type === "cancel"
                            ? "bg-red-700 text-white hover:bg-red-800"
                            : "bg-green-500 text-white hover:bg-green-600"
                        } w-full`}
                >
                    {buttonLabel}
                </SubmitButton>
            </form>
        </Form>
    );
};

export default AppointmentForm;