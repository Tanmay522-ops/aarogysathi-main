"use client"


import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Doctors, FormFieldType,  getAppointmentSchema,  userFormSchema } from "../types";
import z from "zod";


import CustomFormField from "./CustomFormField";
import SubmitButton from "./SubmitButton";
import { useState } from "react";

import Image from "next/image";
import { SelectItem } from "../../components/ui/select";
import { Form } from "../../components/ui/form";

const AppointmentForm = ({
    userId,type
}:{
    userId : string;
    type: "create" | "schedule" | "cancel"
}) => {

  const[isLoading,setIsLoading]  = useState(false)

    const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
        primaryPhysician: "",
        schedule: new Date(),
        reason: "",
        note: "",
        cancellationReason: "",
    },
  })

    const onSubmit = async (
        values: z.infer<typeof AppointmentFormValidation>
    ) => {
        setIsLoading(true);

        let status;
        switch (type) {
            case "schedule":
                status = "scheduled";
                break;
            case "cancel":
                status = "cancelled";
                break;
            default:
                status = "pending";
        }
    }

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
            buttonLabel = "Submit Apppointment";
    }



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" flex-1 space-y-6  ">
        <section className="mb-12 space-y-4">
          <h1 className="text-[32px] leading-[36px] font-bold md:text-36-bold"> New Appointment...🖐️ </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">Request a new appointment in 10 seconds</p>
        </section>
        
              {type !== "cancel" && (
                  <>
                      <CustomFormField
                          fieldType={FormFieldType.SELECT}
                          control={form.control}
                          name="primaryPhysician"
                          label="Doctor"
                          placeholder="Select a doctor"
                      >
                          {Doctors.map((doctor, i) => (
                              <SelectItem key={doctor.name + i} value={doctor.name}>
                                  <div className="flex cursor-pointer items-center gap-2">
                                      <Image
                                          src={doctor.image}
                                          width={32}
                                          height={32}
                                          alt="doctor"
                                          className="rounded-full border border-dark-500"
                                      />
                                      <p>{doctor.name}</p>
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
                          dateFormat="MM/dd/yyyy  -  h:mm aa"
                      />

                      <div
                          className="flex flex-col gap-6 xl:flex-row"
                      >
                          <CustomFormField
                              fieldType={FormFieldType.TEXTAREA}
                              control={form.control}
                              name="reason"
                              label="Reason for appointment"
                              placeholder="Enter reason for appointment"
                            
                          />

                          <CustomFormField
                              fieldType={FormFieldType.TEXTAREA}
                              control={form.control}
                              name="note"
                              label="Notes"
                              placeholder="Enter notes"
                             
                          />
                      </div>
                  </>
              )}

              {type === "cancel" && (
                  <CustomFormField
                      fieldType={FormFieldType.TEXTAREA}
                      control={form.control}
                      name="cancellationReason"
                      label="Reason for cancellation"
                      placeholder="Enter reason for cancellation"
                  />
              )}
       
              <SubmitButton
                  isLoading={isLoading}
                  className={`${type === "cancel" ? "bg-red-700 text-white" : "bg-green-500 text-white"} w-full`}
              >
                 {buttonLabel}
              </SubmitButton>
      </form>
    </Form>
  )
}

export default AppointmentForm
