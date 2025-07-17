// Auth
export const LOGIN = '/login';
export const SIGNUP = '/signup';
export const VERIFY_OTP = '/verify-otp';
export const FORGOT_PASSWORD = '/forgot-password';
export const VERIFY_RESET_OTP = '/verify-reset-otp';

// Portfolio
export const PORTFOLIO_DATA = '/portfolio'; // Append ?user_id=:userId in component
export const USER_METRICS = (userId: string) => `/metrics/${userId}`;
export const PORTFOLIO_BUY = '/portfolio/buy';
export const PORTFOLIO_SELL = '/portfolio/sell';

// Stocks & Market Data
export const DASH_SCREENER_DATA = '/stocks';
export const STOCK_HISTORICAL_DATA = (stockSymbol: string) => `/stocks/${stockSymbol}`;

export const NEWS_ARTICLES = '/news'; // Append ?page=:page&page_size=:pageSize in component
export const NASDAQ_SUMMARY = '/NASDAQ-summary';
export const NASDAQ_INTRADAY = '/NASDAQ-intraday';

// Watchlist
export const GET_WATCHLIST = (userId: string) => `/watchlist/${userId}`;
export const ADD_TO_WATCHLIST = (userId: string, symbol: string) => `/watchlist/${userId}/${symbol}`;
export const REMOVE_FROM_WATCHLIST = (userId: string, symbol: string) => `/watchlist/${userId}/${symbol}`;

//Transaction History
export const GET_TRANSACTION_HISTORY = `/transactions`;

// User
export const USERS_ENDPOINT = 'https://archlinux.tail9023a4.ts.net/users';
export const USER_BALANCE = (userId: string) => `/users/${userId}/balance`;
export const GET_USER = (userId: string) => `/users/${userId}`;

// Stock Prices
export const ALL_STOCK_PRICES = `/stocks/prices`;