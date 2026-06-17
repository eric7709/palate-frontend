import { useOrderCustomerStore } from "./store";
import { Customer, CustomerData } from "./types"


export const setCustomerData = (customer: Customer) => {
    if (typeof window === "undefined" || !customer) return;
    localStorage.setItem("order_customer", JSON.stringify(customer));
    useOrderCustomerStore.getState().setCustomer(customer);
};