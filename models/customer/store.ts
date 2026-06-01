import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CustomerStore } from "../customer/types";

type CustomerModal = "createCustomer" | "deleteCustomer" | "editCustomer";

const defaultFilters = {
    page: 0,
    size: 50,
    search: "",
};

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set) => ({
      selectedCustomer: null,
      modal: null,
      ...defaultFilters,
      setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
      setModal: (modal) => set({ modal }),
      closeModal: () => set({ modal: null, selectedCustomer: null }),
      setPage: (page) => set({ page }),
      setSize: (size) => set({ size }),
      setSearch: (search) => set({ search }),
      resetFilters: () => set({ ...defaultFilters }),
    }),
    {
      name: "customer-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ selectedCustomer: state.selectedCustomer }),
    }
  )
);