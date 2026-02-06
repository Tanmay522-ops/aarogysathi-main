"use client"


import { FormFieldType } from "../types"

import Image from "next/image";
import { Control } from "react-hook-form";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";


import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Checkbox } from "../../components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form";
import { Select, SelectContent, SelectTrigger, SelectValue } from "../../components/ui/select";


interface CustomProps {
    control: Control<any>,
    fieldType: FormFieldType,
    name: string;
    label?: string;
    placeholder?: string;
    iconSrc?: string;
    iconAlt?: string;
    disabled?: boolean;
    dateFormat?: string;
    type?:string;
    showTimeSelect?: boolean;
    children?: React.ReactNode; // sometime we want to show something inside the input  thats why we use children
    renderSkeleton?: (field: any) => React.ReactNode;  // this is typically use when we haev to show a loading state for an input  

}

// we have created a new functional component that will render 
//  different kinds of input 
const RenderField = ({
    field,
    props,
}: {
    field: any
    props: CustomProps
}) => {

    const { fieldType, iconSrc, iconAlt, placeholder, showTimeSelect, dateFormat,renderSkeleton,type } = props

    switch (fieldType) {
        case FormFieldType.INPUT:
            return (
                <div className="flex rounded-md border border-dark-500 bg-dark-400    ">
                    {iconSrc && (
                        <Image
                            src={iconSrc}
                            height={24}
                            width={24}
                            alt={iconAlt || "icon"}
                            className="ml-2 "
                            
                        />
                    )}

                    <FormControl>
                        <Input
                            {...field}
                            value={field.value ?? ""}
                            type={type}
                            placeholder={placeholder}
                            className=" bg-dark-400 placeholder:text-dark-600 border-dark-500 h-11 focus-visible:ring-0 focus-visible:ring-offset-0 border-0"
                        />
                    </FormControl>
                </div>
            );

        case FormFieldType.TEXTAREA:
            return (
                <FormControl>
                    <Textarea
                        placeholder={props.placeholder}
                        {...field}
                        className="shad-textArea"
                        disabled={props.disabled}
                    />
                </FormControl>
            );

        case FormFieldType.PHONE_INPUT:
            return (
                <FormControl className="phone-input-dark">
                    <PhoneInput
                        defaultCountry="IN"
                        placeholder={placeholder}
                        international
                        withCountryCallingCode
                        value={field.value as string | undefined}
                        onChange={field.onChange}
                        className="mt-2 h-11 rounded-md px-3 text-sm border bg-dark-400 placeholder:text-dark-600 border-dark-500"

                    />
                </FormControl>
            );
        case FormFieldType.CHECKBOX:
            return (
                <FormControl>
                    <div className="flex items-center gap-4">
                        <Checkbox
                            id={props.name}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                        <label htmlFor={props.name} className="checkbox-label">
                            {props.label}
                        </label>
                    </div>
                </FormControl>
            );
        case FormFieldType.DATE_PICKER:
            return (
                <div className="flex rounded-md border border-dark-500 bg-dark-400 ">
                    <Image
                        src="/assets/icons/calendar.svg"
                        height={24}
                        width={24}
                        alt="user"
                        className="ml-2"
                    />
                    <FormControl>

                        <DatePicker
                            selected={field.value}
                            onChange={(date: Date | null) => field.onChange(date)}
                            dateFormat={dateFormat ?? "MM/dd/yyyy"}
                            showTimeSelect={showTimeSelect ?? false}
                            timeInputLabel="Time:"
                            className="overflow-hidden border-transparent w-full placeholder:text-dark-600  h-11 text-14-medium rounded-md px-3 outline-none"
                            calendarClassName="date-picker-calendar"
                            
                        />
                    </FormControl>
                </div>
            );
        case FormFieldType.SELECT:
            return (
                <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger className="shad-select-trigger">
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent className="shad-select-content">
                            {props.children}
                        </SelectContent>
                    </Select>
                </FormControl>
            );
        case FormFieldType.SKELETON:
            return renderSkeleton ? renderSkeleton(field) : null;

        default:
            return null
    }
}

const CustomFormField = (props: CustomProps) => {
    const { control, name, label, fieldType } = props

    return (
        <FormField
            control={control}
            name={name}  // now each one of our form field can have unique name
            render={({ field }) => (

                // we dont need every single one of our form fields
                //  to have the same layout this layout is used for the input
                // but sometimes may be we want to render something else 
                // so i will delete the prvious layout and move forward 
                // with the dynamic layout below  
                <FormItem className="flex-1">
                    {fieldType !== FormFieldType.CHECKBOX && label && (
                        <FormLabel>{label}</FormLabel>
                    )}

                    {/* we will pass the field equal to field so we know
                     what kind of field we want to render   */}
                    {/* we will pass the entire props object right here */}
                    <RenderField field={field} props={props} />
                    {/* To show error */}
                    <FormMessage className="text-red-400" />
                </FormItem>
            )}
        />
    )
}

export default CustomFormField
