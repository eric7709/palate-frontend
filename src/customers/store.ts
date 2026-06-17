import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CustomerData, CustomerStore, OrderCustomerState } from "../customer/types";

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


export const useOrderCustomerStore = create<OrderCustomerState>((set) => ({
  customer: null,
  // --- Actions ---
  setCustomer: (customerData) => {
    // Save the entire object as a unified JSON string
    localStorage.setItem("order_customer", JSON.stringify(customerData));
    set({ customer: customerData });
  },

  clearCustomer: () => {
    localStorage.removeItem("order_customer");
    set({ customer: null });
  },

  hydrateFromStorage: () => {
    if (typeof window === "undefined") return;

    const savedCustomer = localStorage.getItem("order_customer");
    if (savedCustomer) {
      try {
        set({ customer: JSON.parse(savedCustomer) as CustomerData });
      } catch (e) {
        console.error("Failed to parse saved customer data", e);
        localStorage.removeItem("order_customer"); // Clear corrupted data
      }
    }
  },
}));