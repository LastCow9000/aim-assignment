type Result = {
  success: boolean;
};

export type CreateUserResponse = Result & {
  data: {
    id: number;
  };
};
