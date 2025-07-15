// File: app/(app)/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import DashboardShell from "@/components/dashboard-shell"; // Assuming this is your dashboard shell

export default function AppLayout({
                                      children,
                                  }: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading || !isAuthenticated) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-neutral-950">
                <p>Verifying authentication...</p>
            </div>
        );
    }

    // If authenticated, render the DashboardShell which contains the sidebar and header
    return (
        <DashboardShell>
            {children}
        </DashboardShell>
    );
}