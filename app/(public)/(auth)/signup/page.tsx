"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signupUser, verifyUserOTP } from "@/services/AuthServices";
import FormField from "@/app/components/auth/FormField";
import PasswordField from "@/app/components/auth/PasswordField";

export default function SignupPage() {
    const [step, setStep] = useState<'signup' | 'verify'>('signup');
    const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [otp, setOtp] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setError(null);
        setIsLoading(true);
        try {
            await signupUser({ u_name: formData.name, email: formData.email, u_pass: formData.password });
            setStep('verify');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await verifyUserOTP({ email: formData.email, otp });
            alert("Account verified successfully! Please log in.");
            router.push('/login');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full bg-white dark:bg-neutral-950">
            <div className="hidden md:block md:w-1/2 relative">
                <Image src="/img/LoginImage.jpg" alt="OptiTrade Platform" layout="fill" objectFit="cover" priority />
            </div>
            <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
                <div className="max-w-md w-full space-y-8">
                    {step === 'signup' ? (
                        <>
                            <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">Create your account</h2>
                            <form onSubmit={handleSignup} className="mt-8 space-y-6">
                                <FormField label="Name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Full Name" />
                                <FormField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email Address" />
                                <PasswordField label="Password" name="password" value={formData.password} onChange={handleChange} />
                                <PasswordField label="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                                <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800">
                                    {isLoading ? 'Creating...' : 'Create Account'}
                                </button>
                            </form>
                            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                                Already have an account?{' '}
                                <Link href="/login" className="font-medium text-orange-600 hover:text-orange-500">Log in</Link>
                            </p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">Verify your Email</h2>
                            <p className="text-center text-neutral-500">An OTP has been sent to {formData.email}</p>
                            <form onSubmit={handleVerify} className="mt-8 space-y-6">
                                <FormField label="OTP" name="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
                                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                                <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800">
                                    {isLoading ? 'Verifying...' : 'Verify'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}