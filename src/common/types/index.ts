import { ACCESS } from '../constants';

type Result = {
  success: boolean;
};

export type CreateUserResponse = Result & {
  data: {
    id: number;
  };
};

export type LoginUserResponse = Result & {
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
