import { ACCESS, ACCOUNT, TRANSACTION } from '../constants';

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

export type AccessTokenPayload = {
  id: number;
  userId: string;
  name: string;
};

export type AccessType = (typeof ACCESS)[keyof typeof ACCESS];

export type AccountType = (typeof ACCOUNT)[keyof typeof ACCOUNT];

export type TransactionType = (typeof TRANSACTION)[keyof typeof TRANSACTION];
