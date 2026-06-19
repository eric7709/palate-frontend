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
        className={`flex items-center justify-between gap-1.5 px-2 py-1.5 rounded-lg border text-xs transition-all duration-200 w-full bg-white
          ${
            open
              ? "border-gray-400 shadow-sm"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          }`}
      >
        <div className="flex items-center gap-1.5 truncate">
          {icon && <span className="shrink-0">{icon}</span>}
          <span className={value ? "text-gray-800 font-semibold text-[11px]" : "text-gray-400 text-xs"}>
            {selectedLabel}
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
            open ? "rotate-180 text-gray-500" : "text-gray-400"
          }`}
        />
      </button>

      {open && (
        <div
          className={`absolute z-50 mt-2 min-w-45 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden
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
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
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