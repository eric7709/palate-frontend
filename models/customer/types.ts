
export interface CustomerRequestDTO {
  name: string;
  phoneNumber: string;
  title: string;
  email: string;
}

export type Customer ={
  id: number 
  name: string;
  title: string;
  phoneNumber?: string; 
  email?: string;      
}
// customer/types.ts
type CustomerModal = "createCustomer" | "deleteCustomer" | "editCustomer";

export interface CustomerStore {
    selectedCustomer: Customer | null;
    modal: CustomerModal | null;

    page: number;
    size: number;
    search: string;

    setSelectedCustomer: (customer: Customer | null) => void;
    setModal: (modal: CustomerModal | null) => void;
    closeModal: () => void;
    setPage: (page: number) => void;
    setSize: (size: number) => void;
    setSearch: (search: string) => void;
    resetFilters: () => void;
}

export interface CustomerData {
  id: number | null;
  name: string;
  phoneNumber: string;
  title: string;
}

export type OrderCustomerState = {
  // Unified object state
  customer: CustomerData | null;

  // Actions
  setCustomer: (data: CustomerData) => void;
  clearCustomer: () => void;
  hydrateFromStorage: () => void;
};