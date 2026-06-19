"use client";
import { useState } from "react";
import { OrderFilters } from "./OrderFilter";
import HeaderWrapper from "@/src/shared/components/utils/HeaderWrapper";
import AdminSearch from "@/src/shared/components/input/AdminSearch";
import { useOrderStore } from "../../../store";
import { Header } from "./Header";
import { CardList } from "./CardList";
import { OrderTable } from "./OrderTable";

export function Base() {
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