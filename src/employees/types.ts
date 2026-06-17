import { AccountResponseDTO, RoleType } from "@/src/auth";



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
    role: RoleType | null;
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