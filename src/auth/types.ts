// Enums matching your Java Enums
export type Gender =
    "MALE" |
    "FEMALE"

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


export interface MeDTO {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    gender: Gender;
    id: number;        // Java Long maps to TypeScript number (or bigint if you prefer)
    role: Role;
}

export interface AccountResponseDTO {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    gender: Gender | null;
    status: string;
    role: RoleType | null;
}



// Request DTOs
export interface AccountRequestDTO {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    gender?: Gender | null;
    password?: string;
    status?: string;
    role?: RoleType | null;
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
    user: AccountResponseDTO; // Define a UserDTO if available
}



export interface AccessTokenResponse {
    accessToken: string;
}

export interface MessageResponse {
    message: string;
}
export interface AuthStore {
    user: AccountResponseDTO | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    setAuth: (user: AccountResponseDTO, accessToken: string, refreshToken: string) => void;
    setAccessToken: (accessToken: string) => void;
    logout: () => void;
    clearAuth: () => void;
}