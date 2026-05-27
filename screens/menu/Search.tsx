"use client";
import { useEffect, useState } from "react";
import { useMenuItemStore } from "@/models/menuItem/store";
import { Search as SearchIcon, X } from "lucide-react";

export default function Search() {
  const { search, setSearch } = useMenuItemStore();
  const [inputValue, setInputValue] = useState(search);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(inputValue);
    }, 500);

    return () => clearTimeout(handler);
  }, [inputValue, setSearch]);

  // Sync with store if reset from outside
  useEffect(() => {
    setInputValue(search);
  }, [search]);

  return (
    <div className="px-4 mt-3">
      <div className="relative w-full mx-auto">
        <div className="relative flex items-center">
          <SearchIcon className="absolute left-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search menu items..."
            className="w-full bg-white border border-gray-300 rounded-lg py-2 pl-10 pr-10 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
          {inputValue && (
            <button
              onClick={() => setInputValue("")}
              className="absolute right-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-3 h-3 text-gray-500" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}