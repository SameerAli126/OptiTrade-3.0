// File: contexts\StockDataContext.tsx
"use client"; // <--- ADD THIS LINE

import { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DASH_SCREENER_DATA } from "../config/apiEndpoints";
// ... (the rest of the file is correct, no other changes needed)
// Define types
interface StockData {
    // Define the structure of your stock data here
    // This is a placeholder and should be updated with actual stock data structure
    [key: string]: any;
}

interface StockDataContextType {
    stockData: StockData[] | undefined;
    isLoading: boolean;
    error: Error | null;
}

interface StockDataProviderProps {
    children: ReactNode;
}

const StockDataContext = createContext<StockDataContextType | undefined>(undefined);

const fetchStocks = async (): Promise<StockData[]> => {
    const response = await fetch(`/api${DASH_SCREENER_DATA}`);
    if (!response.ok) throw new Error('Failed to fetch stocks');
    return response.json();
};

export const StockDataProvider = ({ children }: StockDataProviderProps) => {
    const { data, isLoading, error } = useQuery<StockData[], Error>({
        queryKey: ['stocks'],
        queryFn: fetchStocks,
    });

    return (
        <StockDataContext.Provider value={{
            stockData: data,
            isLoading,
            error
        }}>
            {children}
        </StockDataContext.Provider>
    );
};

export const useStockData = (): StockDataContextType => {
    const context = useContext(StockDataContext);
    if (!context) {
        throw new Error('useStockData must be used within a StockDataProvider');
    }
    return context;
};