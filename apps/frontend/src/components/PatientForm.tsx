"use client"


import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { FormFieldType,  userFormSchema } from "../types";
import z from "zod";


import CustomFormField from "./CustomFormField";
import SubmitButton from "./SubmitButton";
import { useState } from "react";
import { Form } from "../../components/ui/form";

const PatientForm = () => {

  const[isLoading,setIsLoading]  = useState(false)

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone:"",
      abhaId: "",
    },
  })

  async function onSubmit({name,email,phone}: z.infer<typeof userFormSchema>) {
    setIsLoading(true)
    try {
      const userData = {name,email,phone}
      // we have to take this userData and pass it somewhere to create this user in the database
      
    } catch (error) {
      console.log(error)
      
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" flex-1 space-y-6  ">
        <section className="mb-8 space-y-4">
          <h1 className="text-[32px] leading-[36px] font-bold md:text-36-bold"> Hi There...🖐️ </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">Schedule your First appointment.</p>
        </section>
        <CustomFormField
        // Here we are defining fieldType here
        // filed type will be used to render different types of inputs or fileds
        fieldType={FormFieldType.INPUT}
        control= {form.control}
        name="name"
        label="Full Name"
        placeholder="John Doe"
        iconSrc="/assets/icons/user.svg"
        iconAlt= "user"

        />

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
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="abhaId"
          label="ABHA ID"
          placeholder="ABCX12345678"
          iconSrc="/assets/icons/abha.svg"
          iconAlt="abha"
        />
        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="Phone"
          label="Phone Number"
          placeholder="(555)-123-4567 "


        />
       
        <SubmitButton isLoading= {isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  )
}

export default PatientForm
