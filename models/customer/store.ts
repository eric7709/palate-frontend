import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CustomerStore } from "../customer/types";

const defaultFilters = {
    page: 0,
    size: 50,
    search: "",
};

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set) => ({
      selectedCustomer: null,
      isFormOpen: true,
      isDeleteModalOpen: false,
      ...defaultFilters,
      setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
      openForm: () => set({ isFormOpen: true }),
      closeForm: () => set({ isFormOpen: false, selectedCustomer: null }),
      openDeleteModal: () => set({ isDeleteModalOpen: true }),
      closeDeleteModal: () => set({ isDeleteModalOpen: false, selectedCustomer: null }),
      setPage: (page) => set({ page }),
      setSize: (size) => set({ size }),
      setSearch: (search) => set({ search }),
      resetFilters: () => set({ ...defaultFilters }),
    }),
    {
      name: "customer-storage",
      storage: createJSONStorage(() => localStorage),
      // This ensures ONLY selectedCustomer is saved to storage
      partialize: (state) => ({ selectedCustomer: state.selectedCustomer }),
    }
  )
);