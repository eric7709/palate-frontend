// Enums matching your Java Enums
export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE"
}

export enum Role {
    ADMIN = "ADMIN",
    WAITER = "WAITER",
    CASHIER = "CASHIER"
}

export type RoleType = 
  | "ROLE_ADMIN" 
  | "ROLE_CHEF" 
  | "ROLE_COOK" 
  | "ROLE_BAKER" 
  | "ROLE_WAITER" 
  | "ROLE_CASHIER" 
  | "ROLE_MANAGER";


// Request DTOs
export interface AccountRequestDTO {
    id: number
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    gender?: Gender;
    password?: string;
    status?: string;
    role?: RoleType;
}

export interface LoginRequestDTO {
    email?: string;
    password?: string;
}

export interface ChangePasswordRequestDTO {
    oldPassword?: string;
    newPassword?: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

// Response DTOs
export interface AuthResponseDTO {
    accessToken: string;
    refreshToken: string;
    user: AccountRequestDTO; // Define a UserDTO if available
}

export interface MeDTO {
    id: number;
    email: string;
    role: Role;
}

export interface AccessTokenResponse {
    accessToken: string;
}

export interface MessageResponse {
    message: string;
}

export interface AuthStore {
    user: AccountRequestDTO | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    // Actions
    setAuth: (user: AccountRequestDTO, accessToken: string, refreshToken: string) => void;
    setAccessToken: (token: string) => void;
    logout: () => void;
}