// File: app/components/auth/FormField.tsx
"use client";

import React from 'react';

// Define the "shape" of the props our component will accept using a TypeScript interface
interface FormFieldProps {
    label: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    name?: string; // Add name attribute for better form handling
    required?: boolean;
}

export default function FormField({ label, name, required = true, ...props }: FormFieldProps) {
    return (
        <div>
            <label htmlFor={name || label.toLowerCase()} className="sr-only">
                {label}
            </label>
            <input
                id={name || label.toLowerCase()}
                name={name || label.toLowerCase()}
                required={required}
                // These are the updated, responsive styles for a dark/light theme
                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 placeholder-gray-500 text-gray-900 dark:text-gray-100 bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                {...props}
            />
        </div>
    );
}