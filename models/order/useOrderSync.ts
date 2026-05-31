"use client";
import { useEffect, useState } from "react";
import { useGetCustomerOrdersToday } from "@/models/order/hooks";
import { useOrderHistoryStore } from "@/models/customer/store.history";

export function useOrderSync() {
  const [customerId, setCustomerId] = useState<number | undefined>(undefined);
  const { setOrders, setLoading, setError } = useOrderHistoryStore();

  useEffect(() => {
    const id = localStorage.getItem("id");
    if (id) setCustomerId(Number(id));
  }, []);

  const { data, isLoading, error } = useGetCustomerOrdersToday(customerId);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (error) setError(error as Error);
  }, [error, setError]);

  useEffect(() => {
    if (data) setOrders(data);
  }, [data, setOrders]);

  return { customerId }; // ← was missing
}