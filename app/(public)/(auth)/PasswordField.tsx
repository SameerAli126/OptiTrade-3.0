// File: app/components/auth/PasswordField.tsx
"use client";
/////
import React, { useState } from 'react';

// Define the props for this component
interface PasswordFieldProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
}

export default function PasswordField({ label, name, ...props }: PasswordFieldProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative">
            <label htmlFor={name || label.toLowerCase()} className="sr-only">
                {label}
            </label>
            <input
                id={name || label.toLowerCase()}
                name={name || label.toLowerCase()}
                type={showPassword ? "text" : "password"}
                placeholder={label}
                required
                className="w-full p-3 pr-10 border border-gray-300 dark:border-neutral-700 placeholder-gray-500 text-gray-900 dark:text-gray-100 bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                {...props}
            />
            {/* This is the show/hide button positioned inside the input field */}
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
                {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
        </div>
    );
}