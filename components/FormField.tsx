import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import {
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Define the props interface for the FormField component
interface FormFieldProps<T extends FieldValues> {
    // Control object from react-hook-form
    control: Control<T>;
    // Name of the field
    name: Path<T>;
    // Label for the field
    label: string;
    // Placeholder for the input
    placeholder: string;
    // Type of the input field (text, email, password, file)
    type?: 'text' | 'email' | 'password' | 'file';
}

// Define the FormField component
const FormField = ({ control, name, label, placeholder, type = 'text' }: FormFieldProps<T>) => (
    // Use Controller from react-hook-form to manage the form field
    <Controller name={name} control={control} render={({ field }) => ( // Render prop to access the field object
        // FormItem component to wrap the label, input, and message
        <FormItem>
            {/* FormLabel component for the label */}
            <FormLabel className="label">{label}</FormLabel>
            {/* FormControl component to wrap the input */}
            <FormControl>
                {/* Input component for the input field */}
                <Input className='input' placeholder={placeholder} type={type} {...field} />
            </FormControl>
            {/* FormMessage component for displaying validation messages */}
            <FormMessage />
        </FormItem>
    )}
    />
)        

export default FormField;
