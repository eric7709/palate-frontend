"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, AlertCircle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SelectOption {
  label: string;
  value: string;
}

// ─── Input ────────────────────────────────────────────────────────────────────

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  type?: string;
  disabled?: boolean;
}

export function InputField({ label, value, onChange, placeholder, error, type = "text", disabled }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-3 py-2.5 rounded-lg bg-[#1a1c21] border text-sm text-white placeholder-gray-600
            focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
            ${error
              ? "border-red-500/50 focus:border-red-500/80 focus:ring-1 focus:ring-red-500/20"
              : "border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 hover:border-white/20"
            }`}
        />
        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <AlertCircle className="w-4 h-4 text-red-400" />
          </div>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1 text-[11px] text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export function SelectField({ label, value, onChange, options, placeholder = "Select an option", error, disabled }: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find(o => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (opt: SelectOption) => {
    onChange(opt.value);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{label}</label>
      <div ref={ref} className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(o => !o)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#1a1c21] border text-sm transition-all duration-200 text-left
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error
              ? "border-red-500/50 focus:border-red-500/80"
              : open
                ? "border-indigo-500/50 ring-1 ring-indigo-500/20"
                : "border-white/10 hover:border-white/20"
            }`}
        >
          <span className={selected ? "text-white" : "text-gray-600"}>{selected?.label ?? placeholder}</span>
          <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180 text-indigo-400" : "text-gray-600"}`} />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute z-50 mt-1.5 w-full bg-[#1e2028] border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
            <div className="max-h-52 overflow-y-auto">
              {options.length === 0 ? (
                <div className="px-3 py-4 text-center text-xs text-gray-600">No options available</div>
              ) : (
                options.map(opt => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(opt)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-sm text-left transition-colors duration-100
                        ${isSelected
                          ? "bg-indigo-500/15 text-indigo-300"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                        }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="flex items-center gap-1 text-[11px] text-red-400">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}