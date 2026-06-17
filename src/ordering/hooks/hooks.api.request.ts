"use client"
import { useEffect } from 'react';
import { useCustomerStore } from "../../customers/store";
import { useGetTableById } from "../../tables/hooks/hooks.api";
import { useOrderRequestStore } from "../store.request";

export const useGetOrderRequest = (tableId: string) => {
    const { data } = useGetTableById(Number(tableId));
    const customer = useCustomerStore(store => store.selectedCustomer);
    const setOrderDetails = useOrderRequestStore(store => store.setOrderDetails);
    useEffect(() => {
        if (!data) return;
        setOrderDetails({
            tableId: Number(tableId),
            cashierId: Number(data.cashierId),
            waiterId: Number(data.waiterId),
            customerId: Number(customer?.id),
            customerName: customer?.name,
            customerPhoneNumber: customer?.phoneNumber,
            customerTitle: customer?.title
        });
    }, [data, customer, tableId, setOrderDetails]);
    return { isLoading: !data };
};


export const useOrderSummary = () => {
    const { orderRequest } = useOrderRequestStore();

    const summary = orderRequest.items.reduce(
        (acc, item) => {
            acc.totalQuantity += item.quantity;
            acc.totalPrice += item.quantity * item.price;
            return acc;
        },
        { totalQuantity: 0, totalPrice: 0 }
    );
    return summary;
};