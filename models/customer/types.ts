export interface CustomerRequestDTO {
  name: string;
  phoneNumber: string;
  title: string;
  email: string;
}

export interface Customer  {
  id: number 
  name: string;
  title: string;
  phoneNumber?: string; 
  email?: string;      
}

export interface CustomerStore {
    selectedCustomer: Customer | null;
    isFormOpen: boolean;
    isDeleteModalOpen: boolean;

    // Pagination & filters
    page: number;
    size: number;
    search: string;

    setSelectedCustomer: (customer: Customer | null) => void;
    openForm: () => void;
    closeForm: () => void;
    openDeleteModal: () => void;
    closeDeleteModal: () => void;
    setPage: (page: number) => void;
    setSize: (size: number) => void;
    setSearch: (search: string) => void;
    resetFilters: () => void;
}
