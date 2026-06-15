"use client";

import { useEffect } from "react";
import { useOrderCustomerStore } from "@/models/customer/store";

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const hydrateFromStorage = useOrderCustomerStore(
    (state) => state.hydrateFromStorage
  );
  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  return <>{children}</>;
}