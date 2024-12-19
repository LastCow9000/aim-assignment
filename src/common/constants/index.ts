export const ACCESS = {
  LOGIN: 'login',
  LOGOUT: 'logout',
} as const;

export const ACCOUNT = {
  USD: 'usd',
  KRW: 'krw',
} as const;

export const TRANSACTION = {
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
} as const;

export const PORTFOLIO_RISK = {
  AGGRESSIVE: 'aggressive',
  MODERATE: 'moderate',
} as const;

export const MIN_STOCK_COUNT = 10;

export const MIN_DISTRIBUTION_COUNT = 5;
