// src/config/apiEndpoints.js

// Auth
export const LOGIN = '/login';
export const SIGNUP = '/signup';
export const VERIFY_OTP = '/verify-otp';
export const FORGOT_PASSWORD = '/forgot-password';
export const VERIFY_RESET_OTP = '/verify-reset-otp';

// Portfolio
export const PORTFOLIO_DATA = '/portfolio'; // Append ?user_id=:userId in component
export const USER_METRICS = (userId) => `/metrics/${userId}`;
export const PORTFOLIO_BUY = '/portfolio/buy';
export const PORTFOLIO_SELL = '/portfolio/sell';

// Stocks & Market Data
export const DASH_SCREENER_DATA = '/stocks';
export const STOCK_HISTORICAL_DATA = (stockSymbol) => `/stocks/${stockSymbol}`;

export const NEWS_ARTICLES = '/news'; // Append ?page=:page&page_size=:pageSize in component
export const NASDAQ_SUMMARY = '/NASDAQ-summary';
export const NASDAQ_INTRADAY = '/NASDAQ-intraday';


// Watchlist
export const GET_WATCHLIST = (userId) => `/watchlist/${userId}`;
export const ADD_TO_WATCHLIST = (userId, symbol) => `/watchlist/${userId}/${symbol}`;
export const REMOVE_FROM_WATCHLIST = (userId, symbol) => `/watchlist/${userId}/${symbol}`;

//Transaction History
export const GET_TRANSACTION_HISTORY = `/transactions`;

// User
export const USER_BALANCE = (userId) => `/users/${userId}/balance`;

// Stock Prices
export const ALL_STOCK_PRICES = `/stocks/prices`;


// Now implement this API in the screener. but don't fetch all the data. just fetch what you already are fetching. Just add a column before symbol that uses Logo's from the API.
//
//     endpoint: https://archlinux.tail9023a4.ts.net/stocks
//
//     Response example: