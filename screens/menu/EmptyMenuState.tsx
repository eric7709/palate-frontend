export function EmptyMenuState({ search }: { search: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <p className="text-gray-400 text-lg font-medium">No menu items found</p>
      <p className="text-gray-300 text-sm mt-1">
        {search ? `No results for "${search}"` : "No items available in this category"}
      </p>
    </div>
  );
}