"use client";
import { MenuItemResponseDTO } from "@/src/menuItems/types";
import { MenuItemCard } from "./MenuItemCard";

type Props = {
  items: MenuItemResponseDTO[]
}

export function MenuItemList({ items }: Props) {

  return (
    <div className="grid grid-cols-1 mt-4 px-3 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((item) => (
        <MenuItemCard key={item.id} menuItem={item} />
      ))}
    </div>
  );
}