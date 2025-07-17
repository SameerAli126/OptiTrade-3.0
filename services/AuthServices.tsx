// File: app/services/authService.ts
import { LOGIN, SIGNUP, VERIFY_OTP, FORGOT_PASSWORD, VERIFY_RESET_OTP } from "@/app/config/apiEndpoints";
////
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// A generic function to handle API calls and errors
async function apiCall(endpoint: string, options: RequestInit) {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, options);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
        throw new Error(errorData.message || 'Request failed');
    }
    return response.json();
}

export const loginUser = async (credentials: { email: string, u_pass: string }) => {
    return apiCall(LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
};

export const signupUser = async (userData: { u_name: string, email: string, u_pass: string }) => {
    return apiCall(SIGNUP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
};

export const verifyUserOTP = async (otpData: { email: string, otp: string }) => {
    return apiCall(VERIFY_OTP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(otpData),
    });
};

export const requestPasswordReset = async (email: string) => {
    return apiCall(FORGOT_PASSWORD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
};

export const verifyResetOTP = async (email: string, otp: string, newPassword: string) => {
    return apiCall(VERIFY_RESET_OTP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, new_password: newPassword }),
    });
};