'use client';

import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
};

export default function AdminSearch({
  value,
  onChange,
  placeholder = "Search...",
}: Props) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

      <input
        type="text"
        onChange={(e) => onChange(e.target.value)}
        value={value}
        placeholder={placeholder}
        className="
      h-10
      w-full
      rounded-xl
      border-0
      bg-white
      pl-11
      pr-4
      text-sm
      font-medium
      text-slate-800
    placeholder:text-slate-400
      shadow-sm
      ring-1
      ring-slate-200
      transition-all
      duration-200
      hover:ring-slate-300
      focus:outline-none
    "
      />
    </div>
  );
}