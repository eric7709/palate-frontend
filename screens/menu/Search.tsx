"use client";
import { useEffect, useState } from "react";
import { useMenuItemStore } from "@/models/menuItem/store";
import { Search as SearchIcon, X } from "lucide-react";

export default function Search() {
  const { search, setSearch } = useMenuItemStore();
  const [inputValue, setInputValue] = useState(search);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(inputValue);
    }, 500);
    return () => clearTimeout(handler);
  }, [inputValue, setSearch]);

  useEffect(() => {
    setInputValue(search);
  }, [search]);

  return (
    <div className="px-4 mt-4">
      <div
        className={`
          flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all duration-200
          bg-gray-50
          ${isFocused
            ? "border-blue-600 bg-white shadow-[0_0_0_3px_rgba(0,0,0,0.06)]"
            : "border-gray-300 hover:border-gray-300"
          }
        `}
      >
        {/* Icon */}
        <SearchIcon
          className={`w-4 h-4 shrink-0 transition-colors duration-200 ${
            isFocused ? "text-blue-600" : "text-gray-400"
          }`}
        />

        {/* Input */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search menu items..."
          className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none min-w-0"
        />

        {/* Clear button */}
        {inputValue && (
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              setInputValue("");
            }}
            className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-150"
          >
            <X className="w-3 h-3 text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
}