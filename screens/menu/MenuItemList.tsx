"use client";
import MenuItemCard from './MenuItemCard';
import { MenuItemResponseDTO } from "@/models/menuItem/types";

type Props = {
  items: MenuItemResponseDTO[]
}

export default function MenuItemList({ items }: Props) {

  return (
    <div className="grid grid-cols-1 mt-4 px-3 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((item) => (
        <MenuItemCard key={item.id} menuItem={item} />
      ))}
    </div>
  );
}