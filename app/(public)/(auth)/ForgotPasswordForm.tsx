// File: app/components/auth/ForgotPasswordForm.tsx
"use client";

import React from 'react';
import FormField from '@/app/(public)/(auth)/FormField';
import PasswordField from '@/app/(public)/(auth)/PasswordField';

interface ForgotPasswordFormProps {
    stage: 'request' | 'reset';
    email: string;
    otp: string;
    newPassword: string;
    setEmail: (value: string) => void;
    setOtp: (value: string) => void;
    setNewPassword: (value: string) => void;
    onRequestSubmit: (e: React.FormEvent) => void;
    onResetSubmit: (e: React.FormEvent) => void;
    onBackToLogin: () => void;
    isLoading: boolean;
    error: string | null;
}

export default function ForgotPasswordForm({
                                               stage,
                                               email,
                                               otp,
                                               newPassword,
                                               setEmail,
                                               setOtp,
                                               setNewPassword,
                                               onRequestSubmit,
                                               onResetSubmit,
                                               onBackToLogin,
                                               isLoading,
                                               error
                                           }: ForgotPasswordFormProps) {

    if (stage === 'reset') {
        return (
            <form onSubmit={onResetSubmit} className="space-y-6">
                <p className="text-center text-neutral-500">Enter the OTP sent to your email and your new password.</p>
                <FormField label="OTP" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
                <PasswordField label="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800">
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
                <button type="button" onClick={onBackToLogin} className="w-full text-center text-sm font-medium text-orange-600 hover:text-orange-500">
                    Back to Login
                </button>
            </form>
        );
    }

    return (
        <form onSubmit={onRequestSubmit} className="space-y-6">
            <p className="text-center text-neutral-500">Enter your email address to receive a password reset OTP.</p>
            <FormField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800">
                {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
            <button type="button" onClick={onBackToLogin} className="w-full text-center text-sm font-medium text-orange-600 hover:text-orange-500">
                Back to Login
            </button>
        </form>
    );
}