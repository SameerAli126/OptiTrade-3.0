// File: app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { loginUser } from "@/services/AuthServices";
import LoginImage from "@/app/assets/img/LoginImage.jpg";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login: loginToContext } = useAuth(); // Renamed to avoid confusion

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const data = await loginUser({ email, u_pass: password });
            loginToContext(data.token, data.user);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full bg-white dark:bg-neutral-900">
            {/* Left Side Image */}
            <div className="hidden md:block md:w-1/2 relative">
                <Image src={LoginImage} alt="Login Visual" layout="fill" objectFit="cover" priority />
            </div>

            {/* Right Side Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                            Log in to OptiTrade
                        </h2>
                    </div>
                    <form onSubmit={handleLogin} className="mt-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="sr-only">Email address</label>
                                <input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                       autoComplete="email" required
                                       className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 placeholder-gray-500 text-gray-900 dark:text-gray-100 bg-transparent rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                       placeholder="Email address"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                       autoComplete="current-password" required
                                       className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 placeholder-gray-500 text-gray-900 dark:text-gray-100 bg-transparent rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                       placeholder="Password"
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <div>
                            <button type="submit" disabled={isLoading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-800 disabled:cursor-not-allowed">
                                {isLoading ? "Signing in..." : "Sign in"}
                            </button>
                        </div>
                    </form>
                    <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                        Not a member?{' '}
                        <Link href="/signup" className="font-medium text-orange-600 hover:text-orange-500">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}