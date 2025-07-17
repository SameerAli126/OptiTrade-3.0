// File: contexts/AuthContext.tsx
"use client";
///
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { USERS_ENDPOINT, GET_USER } from "@/config/apiEndpoints";

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
    fetchUserData: (userId: string) => Promise<User | null>;
    fetchAllUsers: () => Promise<User[]>;
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

    // Fetch all users from the API
    const fetchAllUsers = async (): Promise<User[]> => {
        try {
            const response = await fetch(USERS_ENDPOINT);
            if (!response.ok) {
                throw new Error(`Failed to fetch users: ${response.status}`);
            }
            const users = await response.json();
            return users;
        } catch (error) {
            console.error("Error fetching users:", error);
            return [];
        }
    };

    // Fetch a specific user's data by ID
    const fetchUserData = async (userId: string): Promise<User | null> => {
        try {
            // First try to get from all users endpoint
            const allUsers = await fetchAllUsers();
            const foundUser = allUsers.find(u => u.id.toString() === userId);

            if (foundUser) {
                return foundUser;
            }

            // If not found, try the specific user endpoint
            const response = await fetch(`${USERS_ENDPOINT}/${userId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch user: ${response.status}`);
            }
            const userData = await response.json();
            return userData;
        } catch (error) {
            console.error(`Error fetching user ${userId}:`, error);
            return null;
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        setIsLoading(true); // <- Start loading
        const token = localStorage.getItem("token");

        if (token) {
            try {
                let basicUserData: User;
                if (token === "dummy-token") {
                    basicUserData = {
                        id: "1", // Using ID 1 to match the first user in the example response
                        u_name: "Sameer Khan",
                        email: "khsameer626@gmail.com"
                    };
                } else {
                    const decoded = jwtDecode<{
                        id: string;
                        u_name: string;
                        email: string;
                        [key: string]: any;
                    }>(token);
                    basicUserData = {
                        id: decoded.id,
                        u_name: decoded.u_name,
                        email: decoded.email
                    };
                }

                // Try to fetch complete user data from API
                try {
                    const completeUserData = await fetchUserData(basicUserData.id);
                    if (completeUserData) {
                        setUser(completeUserData);
                    } else {
                        setUser(basicUserData);
                    }
                } catch (error) {
                    console.error("Error fetching complete user data:", error);
                    setUser(basicUserData);
                }

                setIsAuthenticated(true);
            } catch (error) {
                console.error("Invalid token:", error);
                logout();
            }
        }

        setIsLoading(false); // <- Done loading
    };

    const login = async (token: string, userData?: any) => {
        localStorage.setItem("token", token);
        setIsLoading(true);

        let basicUserData: User;
        if (token === "dummy-token") {
            basicUserData = {
                id: "1", // Using ID 1 to match the first user in the example response
                u_name: "Sameer Khan",
                email: "khsameer626@gmail.com",
                ...userData
            };
        } else {
            const decoded = jwtDecode<{
                id: string;
                u_name: string;
                email: string;
                [key: string]: any;
            }>(token);
            basicUserData = {
                id: decoded.id,
                u_name: decoded.u_name,
                email: decoded.email,
                ...userData
            };
        }

        // Try to fetch complete user data from API
        try {
            const completeUserData = await fetchUserData(basicUserData.id);
            if (completeUserData) {
                setUser(completeUserData);
            } else {
                setUser(basicUserData);
            }
        } catch (error) {
            console.error("Error fetching complete user data:", error);
            setUser(basicUserData);
        }

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
                getUser,
                fetchUserData,
                fetchAllUsers
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
