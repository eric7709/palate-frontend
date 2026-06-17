import { useOrderCustomerStore } from "./store";
import { Customer, CustomerData } from "./types"

export const convertToCustomerData = (customer: Customer): CustomerData => {
    return {
        id: customer.id,
        name: customer.name,
        phoneNumber: String(customer.phoneNumber),
        title: customer.title
    }
}

export const setCustomerData = (customer: Customer) => {
    if (typeof window === "undefined" || !customer) return;
    // 1. Convert the passed customer object to the correct format
    const customerData = convertToCustomerData(customer);
    // 2. Save the unified JSON string directly to localStorage
    localStorage.setItem("order_customer", JSON.stringify(customerData));
    // 3. Update the Zustand store memory state
    useOrderCustomerStore.getState().setCustomer(customerData);
};