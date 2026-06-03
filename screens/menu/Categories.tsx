"use client";
import { CategoryResponseDTO } from "@/models/category/types";
import { useMenuItemStore } from "@/models/menuItem/store";

type Props = {
  categories: CategoryResponseDTO[];
};

export default function Categories({ categories }: Props) {
  const { categoryId, setCategoryId } = useMenuItemStore();

  return (
    <div className="flex sticky top-14 z-30 bg-white border-b border-gray-200 items-center gap-2 px-3 overflow-x-auto py-2.5 shadow-sm">
      {/* "All" button */}
      <button
        onClick={() => setCategoryId(null)}
        className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
          categoryId === null
            ? "bg-blue-600 text-white shadow-sm"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        All
      </button>

      {/* Category buttons */}
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => setCategoryId(category.id)}
          className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
            categoryId === category.id
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}