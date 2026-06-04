// ui/CustomSelect.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string | null;
  onSelect: (value: string | null) => void;
  options: Option[];
  placeholder?: string;
  icon?: React.ReactNode;
  align?: "left" | "right";
  fullWidth?: boolean;
}

export default function CustomSelect({
  value,
  onSelect,
  options,
  placeholder = "Select",
  icon,
  align = "right",
  fullWidth = false,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find((opt) => opt.value === value)?.label || placeholder;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (val: string) => {
    onSelect(val === "" ? null : val);
    setOpen(false);
  };

  return (
    <div ref={ref} className={`relative ${fullWidth ? "w-full" : "w-fit"}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center justify-between gap-1.5 px-2 py-1.5 rounded-lg border text-xs transition-all duration-200 w-full
          ${
            open
              ? "bg-blue-500/20 border-indigo-500/50 text-white shadow-md shadow-indigo-500/10"
              : "bg-blue-500/5 border-blue-500/30 text-gray-300 hover:bg-blue-500/10 hover:border-blue-500/50"
          }`}
      >
        <div className="flex items-center gap-1.5 truncate">
          {icon && <span className="shrink-0">{icon}</span>}
          <span className={value ? "text-white font-mono text-[11px]" : "text-gray-400 text-xs"}>
            {selectedLabel}
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
            open ? "rotate-180 text-indigo-400" : "text-gray-500"
          }`}
        />
      </button>

      {open && (
        <div
          className={`absolute z-50 mt-2 min-w-[180px] bg-[#0f1119] border border-blue-500/30 rounded-xl shadow-2xl shadow-black/50 overflow-hidden
            ${align === "right" ? "right-0" : "left-0"}`}
        >
          <ul className="py-1 max-h-60 overflow-auto">
            {options.map((opt) => (
              <li
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`px-3 py-1.5 text-[11px] cursor-pointer transition-colors
                  ${
                    value === opt.value
                      ? "bg-indigo-500/20 text-indigo-300"
                      : "text-gray-300 hover:bg-white/8 hover:text-white"
                  }`}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}