"use client"
import { useGetAllCategories } from "@/src/categories/hooks/hooks.api";
import { useGetAllMenuItems } from "@/src/menuItems/hooks/hooks.api";
import { EmptyMenuState } from "../shared/EmptyMenuState";
import { useMenuItemStore } from "@/src/menuItems/store";
import { CategorySkeleton } from "../categories/CategorySkeleton";
import { Categories } from "../categories/Categories";
import { Search } from "./Search";
import { MenuItemSkeleton } from "../shared/MenuItemSkeleton";
import { MenuItemList } from "./MenuItemList";

export function MenuSection() {
    const { search, categoryId } = useMenuItemStore();
  
  const { data: menuItemsData, isLoading: menuLoading } = useGetAllMenuItems({ search, categoryId: categoryId });
  const { data: categoriesData, isLoading: categoriesLoading } = useGetAllCategories({});

  const menuItems = menuItemsData?.content ?? [];
  const hasNoResults = !menuLoading && menuItems.length === 0;

  return (
    <>
      {categoriesLoading ? (
        <CategorySkeleton />
      ) : (
        <Categories categories={categoriesData?.content ?? []} />
      )}
      <Search />
      {menuLoading ? (
        <MenuItemSkeleton />
      ) : hasNoResults ? (
        <EmptyMenuState search={search} />
      ) : (
        <MenuItemList items={menuItems} />
      )}
    </>
  );
}