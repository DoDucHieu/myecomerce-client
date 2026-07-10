export type UserRole = "USER" | "ADMIN";

export type ApiMeta = {
  timestamp: string;
  path: string;
};

export type ErrorDetail = {
  field: string;
  message: string;
};

export type ApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  requestId: string;
  correlationId: string;
  data: T;
  errors: ErrorDetail[] | null;
  meta: ApiMeta;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export type RegisterResponse = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

export type RefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
};

export type GetMeResponse = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

export type UserResponse = {
  id: string;
  email: string;
  name: string;
};

export type CreateUserRequest = {
  email: string;
  name: string;
  passwordHash: string;
};

export type CreateUserResponse = {
  id: string;
  email: string;
  name: string;
};

export type UpdateUserRequest = {
  email: string;
  name: string;
};

export type UpdateUserResponse = {
  id: string;
  email: string;
  name: string;
};

export type GetUsersParams = {
  page: number;
  size: number;
  search?: string;
};

export type PaginationResponse<T> = {
  data: T[];
  page: number;
  size: number;
  total: number;
};
