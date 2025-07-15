// File: contexts\WatchlistContext.tsx
"use client"; // <--- ADD THIS LINE

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
// ... (the rest of the file is correct, no other changes needed)
import { useStockData } from './StockDataContext';
import { WatchlistService } from '@/services/WatchlistService';
import type { StockData } from '@/types/stock';
import { toast } from 'sonner';

interface WatchlistContextType {
  watchlist: StockData[];
  isLoading: boolean;
  error: Error | null;
  addToWatchlist: (stock: StockData) => Promise<boolean>;
  removeFromWatchlist: (symbol: string) => Promise<boolean>;
  isInWatchlist: (symbol: string) => boolean;
  refreshWatchlist: () => Promise<void>;
}

interface WatchlistProviderProps {
  children: ReactNode;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: WatchlistProviderProps) {
  const { user, isAuthenticated } = useAuth();
  const { stockData } = useStockData();

  const [watchlist, setWatchlist] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const refreshWatchlist = async () => {
    if (!isAuthenticated || !user?.id || !stockData) {
      setWatchlist([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const watchlistData = await WatchlistService.getWatchlistWithFullData(user.id, stockData);
      setWatchlist(watchlistData);
    } catch (err) {
      console.error('Error refreshing watchlist:', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh watchlist'));
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh watchlist when user or stock data changes
  useEffect(() => {
    refreshWatchlist();
  }, [user, isAuthenticated, stockData]);

  const addToWatchlist = async (stock: StockData): Promise<boolean> => {
    if (!isAuthenticated || !user?.id) {
      console.error('User not authenticated');
      toast.error('Please log in to add stocks to your watchlist');
      return false;
    }

    try {
      const success = await WatchlistService.addToWatchlist(user.id, stock.symbol);
      if (success) {
        // Only add to local state if not already in watchlist
        setWatchlist(prev => {
          if (prev.some(item => item.symbol === stock.symbol)) {
            return prev;
          }
          toast.success(`${stock.symbol} added to watchlist`);
          return [...prev, stock];
        });
      }
      return success;
    } catch (err) {
      console.error('Error adding to watchlist:', err);
      toast.error('Failed to add stock to watchlist');
      return false;
    }
  };

  const removeFromWatchlist = async (symbol: string): Promise<boolean> => {
    if (!isAuthenticated || !user?.id) {
      console.error('User not authenticated');
      toast.error('Please log in to manage your watchlist');
      return false;
    }

    try {
      const success = await WatchlistService.removeFromWatchlist(user.id, symbol);
      if (success) {
        setWatchlist(prev => prev.filter(item => item.symbol !== symbol));
        toast.success(`${symbol} removed from watchlist`);
      }
      return success;
    } catch (err) {
      console.error('Error removing from watchlist:', err);
      toast.error('Failed to remove stock from watchlist');
      return false;
    }
  };

  const isInWatchlist = (symbol: string): boolean => {
    return watchlist.some(item => item.symbol === symbol);
  };

  return (
      <WatchlistContext.Provider
          value={{
            watchlist,
            isLoading,
            error,
            addToWatchlist,
            removeFromWatchlist,
            isInWatchlist,
            refreshWatchlist
          }}
      >
        {children}
      </WatchlistContext.Provider>
  );
}

export const useWatchlist = (): WatchlistContextType => {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};