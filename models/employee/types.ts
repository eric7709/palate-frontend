export interface AccountResponseDTO {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    gender: string;
    status: string;
    role: string;
}

// Reusing AccountRequestDTO from the Auth module
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


export interface EmployeeStore {
    // UI State
    selectedEmployeeId: number | null; // Just store the ID for editing/deleting
    isFormOpen: boolean;
    isDeleteModalOpen: boolean;

    // Filter State
    search: string;
    role: string;
    status: string;
    page: number;
    size: number;
    sortBy: string;
    sortDirection: 'asc' | 'desc';

    // Actions
    setSelectedEmployeeId: (id: number | null) => void;
    openForm: (id?: number) => void;
    closeForm: () => void;
    openDeleteModal: (id: number) => void;
    closeDeleteModal: () => void;
    setFilters: (filters: Partial<Omit<EmployeeStore, 'setSelectedEmployeeId' | 'openForm' | 'closeForm' | 'openDeleteModal' | 'closeDeleteModal' | 'setFilters'>>) => void;
    resetFilters: () => void;
}
