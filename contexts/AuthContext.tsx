// File: contexts/AuthContext.tsx
"use client";
///
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

// User object shape
interface User {
    id: string;
    u_name: string;
    email: string;
    [key: string]: any;
}

// Context type including isLoading
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, userData?: any) => void;
    logout: () => void;
    checkAuthStatus: () => void;
    getUser: () => User | null;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true); // <- Added this

    const getUser = () => user;

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = () => {
        setIsLoading(true); // <- Start loading
        const token = localStorage.getItem("token");

        if (token) {
            try {
                let userData: User;
                if (token === "dummy-token") {
                    userData = {
                        id: "dev-user",
                        u_name: "Developer",
                        email: "dev@example.com"
                    };
                } else {
                    const decoded = jwtDecode<{
                        id: string;
                        u_name: string;
                        email: string;
                        [key: string]: any;
                    }>(token);
                    userData = {
                        id: decoded.id,
                        u_name: decoded.u_name,
                        email: decoded.email
                    };
                }

                setUser(userData);
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Invalid token:", error);
                logout();
            }
        }

        setIsLoading(false); // <- Done loading
    };

    const login = (token: string, userData?: any) => {
        localStorage.setItem("token", token);

        let authUser: User;
        if (token === "dummy-token") {
            authUser = userData;
        } else {
            const decoded = jwtDecode<{
                id: string;
                u_name: string;
                email: string;
                [key: string]: any;
            }>(token);
            authUser = {
                id: decoded.id,
                u_name: decoded.u_name,
                email: decoded.email,
                ...userData
            };
        }

        setUser(authUser);
        setIsAuthenticated(true);
        setIsLoading(false);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isLoading,
                login,
                logout,
                checkAuthStatus,
                getUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
