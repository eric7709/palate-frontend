"use client";
import { useState } from "react";
import CardList from "./CardList";
import Header from "./Header";
import OrderTable from "./OrderTable";
import AdminSearch from "../../ui/AdminSearch";
import { useOrderStore } from "@/models/order/store";
import { OrderFilters } from "./OrderFilter";

export default function Base() {
  const { search, setSearch } = useOrderStore();
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="p-3 space-y-4">
      <Header showFilters={showFilters} onToggleFilters={() => setShowFilters(!showFilters)} />
      <CardList />
      <OrderFilters showFilters={showFilters} />
      {!showFilters && <AdminSearch value={search} onChange={setSearch} />}  
      <OrderTable />
    </div>
  );
}