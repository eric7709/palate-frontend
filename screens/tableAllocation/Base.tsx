"use client";

import { useState } from "react";
import { TableAllocationHeader } from "./TableAllocationHeader";
import { TableAllocationFilters } from "./TableAllocationFilters";
import { TableAllocationList } from "./TableAllocationList";

export function Base() {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-5 p-4">
      <TableAllocationHeader
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((prev) => !prev)}
      />
      <TableAllocationFilters showFilters={showFilters} />
      <TableAllocationList />
    </div>
  );
}