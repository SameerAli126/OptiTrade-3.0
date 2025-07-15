import {
  GET_WATCHLIST,
  ADD_TO_WATCHLIST,
  REMOVE_FROM_WATCHLIST
} from '@/config/apiEndpoints';
import type { StockData } from '@/types/stock';

export interface WatchlistItem {
  user_id: string;
  stock_symbol: string;
  added_at: string;
}

export const WatchlistService = {
  /**
   * Fetches the user's watchlist from the API
   * @param userId The ID of the user
   * @returns An array of watchlist items
   */
  getWatchlist: async (userId: string): Promise<WatchlistItem[]> => {
    try {
      const response = await fetch(`/api${GET_WATCHLIST(userId)}`);
      if (!response.ok) throw new Error('Failed to fetch watchlist');
      return await response.json();
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      return [];
    }
  },

  /**
   * Adds a stock to the user's watchlist
   * @param userId The ID of the user
   * @param symbol The symbol of the stock to add
   * @returns A boolean indicating whether the operation was successful
   */
  addToWatchlist: async (userId: string, symbol: string): Promise<boolean> => {
    if (!userId) {
      console.error('User ID is missing');
      return false;
    }

    try {
      const response = await fetch(`/api${ADD_TO_WATCHLIST(userId, symbol)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Network Error:', error);
      return false;
    }
  },

  /**
   * Removes a stock from the user's watchlist
   * @param userId The ID of the user
   * @param symbol The symbol of the stock to remove
   * @returns A boolean indicating whether the operation was successful
   */
  removeFromWatchlist: async (userId: string, symbol: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api${REMOVE_FROM_WATCHLIST(userId, symbol)}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      return false;
    }
  },

  /**
   * Fetches full stock data for all stocks in the watchlist
   * @param userId The ID of the user
   * @param stocksData All available stock data
   * @returns An array of StockData objects for the watchlist items
   */
  getWatchlistWithFullData: async (userId: string, stocksData: StockData[]): Promise<StockData[]> => {
    try {
      const watchlistItems = await WatchlistService.getWatchlist(userId);
      const watchlistSymbols = watchlistItems.map(item => item.stock_symbol);
      
      // Filter the stocks data to only include stocks in the watchlist
      return stocksData.filter(stock => watchlistSymbols.includes(stock.symbol));
    } catch (error) {
      console.error('Error getting watchlist with full data:', error);
      return [];
    }
  }
};