import { RoleType } from "../auth/types";

export interface AccountResponseDTO {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    gender: string;
    status: string;
    role: RoleType;
}

export interface AccountRequestDTO {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    gender: string;
    password?: string;
    status: string;
    role: string;
}

export type Role =
    | "ROLE_ADMIN"
    | "ROLE_CHEF"
    | "ROLE_COOK"
    | "ROLE_BAKER"
    | "ROLE_WAITER"
    | "ROLE_CASHIER"
    | "ROLE_MANAGER";

type EmployeeModal = "createEmployee" | "deleteEmployee" | "editEmployee";

export interface EmployeeStore {
    selectedEmployee: AccountResponseDTO | null;
    modal: EmployeeModal | null;
    search: string;
    role: string;
    status: string;
    page: number;
    size: number;
    sortBy: string;
    sortDirection: "asc" | "desc";

    setSelectedEmployee: (employee: AccountResponseDTO | null) => void;
    setModal: (modal: EmployeeModal | null) => void;
    setSearch: (search: string) => void;
    closeModal: () => void;
    setFilters: (filters: Partial<EmployeeStore>) => void;
    resetFilters: () => void;
}