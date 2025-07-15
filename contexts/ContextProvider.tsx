// File: contexts\ContextProvider.tsx
"use client"; // <--- ADD THIS LINE

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react';
// ... (the rest of the file is correct, no other changes needed)
import axios from 'axios';
import { useAuth } from './AuthContext';
import { USER_BALANCE } from '../config/apiEndpoints';

// Define types
interface BalanceDetails {
    cash_balance: number;
    portfolio_value: number;
    net_worth: number;
}

interface ClickedState {
    chat: boolean;
    cart: boolean;
    userProfile: boolean;
    notification: boolean;
    themeSettings: boolean;
    [key: string]: boolean;
}

interface StateContextType {
    currentColor: string;
    currentMode: string;
    activeMenu: boolean;
    screenSize: number | undefined;
    setScreenSize: React.Dispatch<React.SetStateAction<number | undefined>>;
    handleClick: (clicked: string) => void;
    isClicked: ClickedState;
    initialState: ClickedState;
    setIsClicked: React.Dispatch<React.SetStateAction<ClickedState>>;
    setActiveMenu: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentColor: React.Dispatch<React.SetStateAction<string>>;
    setCurrentMode: React.Dispatch<React.SetStateAction<string>>;
    setMode: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setColor: (color: string) => void;
    themeSettings: boolean;
    setThemeSettings: React.Dispatch<React.SetStateAction<boolean>>;
    category: string;
    setCategory: React.Dispatch<React.SetStateAction<string>>;
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    user: any;
    sidebarColor: string;
    setSidebarColor: (color: string) => void;
    balanceDetails: BalanceDetails;
    refreshCashBalance: () => Promise<void>;
}

interface ContextProviderProps {
    children: ReactNode;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

const initialState: ClickedState = {
    chat: false,
    cart: false,
    userProfile: false,
    notification: false,
    themeSettings: false,
};

// Helper function to apply Tailwind Dark/Light theme
const applyThemeMode = (mode: string) => {
    const root = document.documentElement;
    if (mode === 'Dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
};

export const ContextProvider = ({ children }: ContextProviderProps) => {
    const { user, isAuthenticated } = useAuth() || {};

    const [screenSize, setScreenSize] = useState<number | undefined>(undefined);
    const [sidebarColor, setSidebarColor] = useState<string>('#7352FF');
    const [currentColor, setCurrentColor] = useState<string>('#03C9D7');
    const [currentMode, setCurrentMode] = useState<string>('Light');
    const [themeSettings, setThemeSettings] = useState<boolean>(false);
    const [activeMenu, setActiveMenu] = useState<boolean>(true);
    const [isClicked, setIsClicked] = useState<ClickedState>(initialState);
    const [category, setCategory] = useState<string>('Dashboard');
    const [title, setTitle] = useState<string>('Overview');

    const [balanceDetails, setBalanceDetails] = useState<BalanceDetails>({
        cash_balance: 0,
        portfolio_value: 0,
        net_worth: 0,
    });

    const handleClick = (clicked: string) => {
        setIsClicked((prevState) => ({
            ...initialState,
            [clicked]: !prevState[clicked],
        }));
    };

    const refreshCashBalance = async () => {
        const currentUser = user;
        console.log('Attempting to refresh balance details for user:', currentUser);

        if (currentUser?.id) {
            try {
                const token =
                    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

                if (!token) {
                    console.error('No token for balance fetch.');
                    setBalanceDetails({ cash_balance: 0, portfolio_value: 0, net_worth: 0 });
                    return;
                }

                console.log(`API call to /users/${currentUser.id}/balance`);
                const response = await axios.get(`/api${USER_BALANCE(currentUser.id)}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log('Balance API Response:', response.data);
                if (response.data && typeof response.data.cash_balance !== 'undefined') {
                    setBalanceDetails({
                        cash_balance: response.data.cash_balance || 0,
                        portfolio_value: response.data.portfolio_value || 0,
                        net_worth: response.data.net_worth || 0,
                    });
                } else {
                    console.error('Invalid balance data received:', response.data);
                    setBalanceDetails({ cash_balance: 0, portfolio_value: 0, net_worth: 0 });
                }
            } catch (error) {
                console.error('Error refreshing balance details:', error);
                setBalanceDetails({ cash_balance: 0, portfolio_value: 0, net_worth: 0 });
            }
        } else {
            setBalanceDetails({ cash_balance: 0, portfolio_value: 0, net_worth: 0 });
        }
    };

    useEffect(() => {
        if (isAuthenticated && user?.id) {
            refreshCashBalance();
        } else {
            setBalanceDetails({ cash_balance: 0, portfolio_value: 0, net_worth: 0 });
        }
    }, [user, isAuthenticated]);

    const setMode = (e: React.ChangeEvent<HTMLInputElement>) => {
        const mode = e.target.value;
        setCurrentMode(mode);
        if (typeof window !== 'undefined') {
            localStorage.setItem('themeMode', mode);
            applyThemeMode(mode);
        }
    };

    const setColor = (color: string) => {
        setCurrentColor(color);
        if (typeof window !== 'undefined') {
            localStorage.setItem('colorMode', color);
        }
    };

    const setSidebarColorPersistence = (color: string) => {
        setSidebarColor(color);
        if (typeof window !== 'undefined') {
            localStorage.setItem('sidebarColor', color);
        }
    };

    // Load localStorage theme values after client mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedMode = localStorage.getItem('themeMode');
            const storedColor = localStorage.getItem('colorMode');
            const storedSidebarColor = localStorage.getItem('sidebarColor');

            if (storedMode) {
                setCurrentMode(storedMode);
                applyThemeMode(storedMode);
            }
            if (storedColor) {
                setCurrentColor(storedColor);
            }
            if (storedSidebarColor) {
                setSidebarColor(storedSidebarColor);
            }
        }
    }, []);

    return (
        <StateContext.Provider
            value={{
                currentColor,
                currentMode,
                activeMenu,
                screenSize,
                setScreenSize,
                handleClick,
                isClicked,
                initialState,
                setIsClicked,
                setActiveMenu,
                setCurrentColor,
                setCurrentMode,
                setMode,
                setColor,
                themeSettings,
                setThemeSettings,
                category,
                setCategory,
                title,
                setTitle,
                user,
                sidebarColor,
                setSidebarColor: setSidebarColorPersistence,
                balanceDetails,
                refreshCashBalance,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = (): StateContextType => {
    const context = useContext(StateContext);
    if (context === undefined) {
        throw new Error('useStateContext must be used within a ContextProvider');
    }
    return context;
};