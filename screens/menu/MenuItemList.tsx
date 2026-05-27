"use client";
import { useGetAllMenuItems } from "@/models/menuItem/hooks";
import { useMenuItemStore } from "@/models/menuItem/store"; // Adjust path
import MenuItemCard from './MenuItemCard';
import { useEffect, useState } from "react";
import Loader from "@/ui/Loader";

export default function MenuItemList() {
  const { search, categoryId } = useMenuItemStore();
  const [hydrated, setHydrated] = useState(false)
  const { data, isLoading } = useGetAllMenuItems({
    search,
    categoryId
  });

  useEffect(() => {
    setHydrated(true)
  }, [])


  if (isLoading && !hydrated) return <Loader />

  return (
    <div className="grid grid-cols-1 mt-4 px-3 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {data?.content.map((item) => (
        <MenuItemCard key={item.id} menuItem={item} />
      ))}
    </div>
  );
}