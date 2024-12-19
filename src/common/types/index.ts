import { Stock } from 'src/stock/entities/stock.entity';
import { ACCESS, ACCOUNT, PORTFOLIO_RISK, TRANSACTION } from '../constants';

export type ResponseResult = {
  success: boolean;
};

export type CreateUserResponse = ResponseResult & {
  data: {
    id: number;
  };
};

export type LoginUserResponse = ResponseResult & {
  data: {
    accessToken: string;
  };
};

export type FindAccountResponse = ResponseResult & {
  data: {
    amount: number;
  };
};

export type CreateStockResponse = CreateUserResponse;

export type FindStocksResponse = ResponseResult & {
  data: Stock[];
};

export type CreatePortfolioResponse = CreateUserResponse;

export type AccessTokenPayload = {
  id: number;
  userId: string;
  name: string;
};

export type AccessType = (typeof ACCESS)[keyof typeof ACCESS];

export type AccountType = (typeof ACCOUNT)[keyof typeof ACCOUNT];

export type TransactionType = (typeof TRANSACTION)[keyof typeof TRANSACTION];

export type PortfolioRiskType =
  (typeof PORTFOLIO_RISK)[keyof typeof PORTFOLIO_RISK];
