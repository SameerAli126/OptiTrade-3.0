// File: contexts\AppProviders.tsx
"use client"; // <--- ADD THIS LINE

import { ReactNode } from 'react';
// ... (the rest of the file is correct)
import { AuthProvider } from './AuthContext';
import { ContextProvider } from './ContextProvider';
import { StockDataProvider } from './StockDataContext';
import { WatchlistProvider } from './WatchlistContext';

interface AppProvidersProps {
    children: ReactNode;
}

/**
 * AppProviders combines all context providers into a single component
 * This makes it easier to wrap the application with all providers
 * The order of providers is important - providers that depend on other providers should be nested inside them
 */
export function AppProviders({ children }: AppProvidersProps) {
    return (
        <AuthProvider>
            <ContextProvider>
                <StockDataProvider>
                    <WatchlistProvider>
                        {children}
                    </WatchlistProvider>
                </StockDataProvider>
            </ContextProvider>
        </AuthProvider>
    );
}