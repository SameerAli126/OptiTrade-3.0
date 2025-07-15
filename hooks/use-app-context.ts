import { useAuth } from '@/contexts/AuthContext';
import { useStateContext } from '@/contexts/ContextProvider';
import { useStockData } from '@/contexts/StockDataContext';
import { useWatchlist } from '@/contexts/WatchlistContext';

/**
 * Custom hook that combines all context hooks for easier access
 * This hook can be used in any component that needs access to the context data
 */
export function useAppContext() {
  const auth = useAuth();
  const state = useStateContext();
  const stockData = useStockData();
  const watchlist = useWatchlist();

  return {
    auth,
    state,
    stockData,
    watchlist,
  };
}
