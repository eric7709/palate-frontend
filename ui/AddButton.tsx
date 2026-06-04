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
      className="flex items-center gap-1.5 px-3 py-2.5 cursor-pointer rounded-full text-xs font-medium bg-blue-500/5 border border-blue-500/30 text-gray-300 hover:bg-blue-500/10 hover:text-white transition-all duration-200 active:scale-95"
    >
      <Plus size={12} strokeWidth={2.5} />
      <span>{title}</span>
    </button>
  );
}