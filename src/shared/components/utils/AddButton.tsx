"use client";

import { Plus } from "lucide-react";

type Props = {
  title: string;
  onClick?: () => void;
};

export default function AddButton({ title, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold bg-white border border-gray-200 text-gray-700 shadow-sm transition-all duration-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 active:scale-95 cursor-pointer"
    >
      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
      <span>{title}</span>
    </button>
  );
}