import { ACCESS } from '../constants';

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
