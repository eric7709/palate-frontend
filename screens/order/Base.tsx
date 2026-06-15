"use client";
import { useState } from "react";
import CardList from "./CardList";
import Header from "./Header";
import OrderTable from "./OrderTable";
import AdminSearch from "../../ui/AdminSearch";
import { useOrderStore } from "@/models/order/store";
import { OrderFilters } from "./OrderFilter";
import HeaderWrapper from "@/ui/HeaderWrapper";

export default function Base() {
  const { search, setSearch } = useOrderStore();
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="p-3 space-y-4">
      <HeaderWrapper>
        <Header showFilters={showFilters} onToggleFilters={() => setShowFilters(!showFilters)} />
        <CardList />
      </HeaderWrapper>
      <OrderFilters showFilters={showFilters} />
      {!showFilters && <AdminSearch value={search} onChange={setSearch} />}
      <OrderTable />
    </div>
  );
}