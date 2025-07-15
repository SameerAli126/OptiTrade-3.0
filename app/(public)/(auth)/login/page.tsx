// File: app/(public)/(auth)/login/page.tsx
"use client";
///
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { loginUser, requestPasswordReset, verifyResetOTP } from "@/services/AuthServices";
import FormField from "@/app/(public)/(auth)/FormField";
import PasswordField from "@/app/(public)/(auth)/PasswordField";
import ForgotPasswordForm from "@/app/(public)/(auth)/ForgotPasswordForm";
import LoginImage from "@/app//assets/img/LoginImage.jpg";

type View = 'login' | 'forgot_request' | 'forgot_reset';

export default function LoginPage() {
    const [view, setView] = useState<View>('login');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login: loginToContext } = useAuth();

    // State for login form
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // State for password reset form
    const [resetEmail, setResetEmail] = useState("");
    const [resetOtp, setResetOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const data = await loginUser({ email: loginEmail, u_pass: loginPassword });
            loginToContext(data.token, data.user);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordResetRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await requestPasswordReset(resetEmail);
            setView('forgot_reset'); // Move to OTP entry stage
        } catch(err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordResetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await verifyResetOTP(resetEmail, resetOtp, newPassword);
            alert("Password has been reset successfully. Please log in.");
            setView('login');
            // Clear fields
            setResetEmail("");
            setResetOtp("");
            setNewPassword("");
        } catch(err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const renderForm = () => {
        if (view === 'login') {
            return (
                <>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">Log in to OptiTrade</h2>
                    <form onSubmit={handleLogin} className="mt-8 space-y-6">
                        <FormField label="Email" type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Email address" />
                        <PasswordField label="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800">
                            {isLoading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>
                    <div className="text-center">
                        <button onClick={() => { setView('forgot_request'); setError(null); }} className="text-sm font-medium text-orange-600 hover:text-orange-500">
                            Forgot your password?
                        </button>
                    </div>
                </>
            );
        }

        return (
            <>
                <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">Reset Password</h2>
                <ForgotPasswordForm
                    stage={view === 'forgot_request' ? 'request' : 'reset'}
                    email={resetEmail}
                    otp={resetOtp}
                    newPassword={newPassword}
                    setEmail={setResetEmail}
                    setOtp={setResetOtp}
                    setNewPassword={setNewPassword}
                    onRequestSubmit={handlePasswordResetRequest}
                    onResetSubmit={handlePasswordResetSubmit}
                    onBackToLogin={() => { setView('login'); setError(null); }}
                    isLoading={isLoading}
                    error={error}
                />
            </>
        );
    };

    return (
        <div className="flex h-screen w-full bg-white dark:bg-neutral-950">
            <div className="hidden md:block md:w-1/2 relative">
                <Image src={LoginImage} alt="OptiTrade Platform" layout="fill" objectFit="cover" priority />
            </div>
            <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
                <div className="max-w-md w-full space-y-8">
                    {renderForm()}
                    {view === 'login' && (
                        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                            Not a member?{' '}
                            <Link href="/signup" className="font-medium text-orange-600 hover:text-orange-500">
                                Create an account
                            </Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}