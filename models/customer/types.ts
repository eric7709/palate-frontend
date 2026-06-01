import { CustomerOrderDTO } from "../order/types";

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
