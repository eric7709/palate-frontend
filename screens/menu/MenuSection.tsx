import { useGetAllCategories } from "@/models/category/hooks";
import { useGetAllMenuItems } from "@/models/menuItem/hooks";
import CategorySkeleton from "./CategorySkeleton";
import Categories from "./Categories";
import Search from "./Search";
import { MenuSkeleton } from "./MenuItemSkeleton";
import MenuItemList from "./MenuItemList";
import { EmptyMenuState } from "./EmptyMenuState";
import { useMenuItemStore } from "@/models/menuItem/store";

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
        <MenuSkeleton />
      ) : hasNoResults ? (
        <EmptyMenuState search={search} />
      ) : (
        <MenuItemList items={menuItems} />
      )}
    </>
  );
}