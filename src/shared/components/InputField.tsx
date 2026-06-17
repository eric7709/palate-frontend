"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, AlertCircle } from "lucide-react";
import { UseFormRegisterReturn } from "react-hook-form";

export interface SelectOption {
  label: string;
  value: string;
}

// ─── Input ────────────────────────────────────────────────────────────────────

interface InputFieldProps {
  label: string;
  placeholder?: string;
  error?: string;
  type?: string;
  disabled?: boolean;
  registration?: UseFormRegisterReturn;
  required?: boolean;
}

export function InputField({
  label,
  placeholder,
  error,
  type = "text",
  disabled,
  registration,
  required,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-medium text-gray-600 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500 text-xs">*</span>}
      </label>
      <div className="relative group">
        <input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          {...registration}
          className={`w-full px-3 py-1.5 rounded-lg bg-white border text-xs text-gray-800 placeholder-gray-400
            transition-all duration-200 ease-out
            focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed
            ${
              error
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-gray-300 hover:border-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20"
            }`}
        />
        {error && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
          </div>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1 text-[10px] text-red-500">
          <AlertCircle className="w-2.5 h-2.5" />
          {error}
        </p>
      )}
    </div>
  );
}


interface TextareaFieldProps {
  label: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  rows?: number;
  registration?: UseFormRegisterReturn;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  maxLength?: number;
}

export function TextareaField({
  label,
  placeholder,
  error,
  disabled,
  rows = 3,
  registration,
  required,
  value,
  onChange,
  maxLength,
}: TextareaFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-medium text-gray-600 flex items-center gap-1">
          {label}
          {required && <span className="text-red-500 text-xs">*</span>}
        </label>
        {maxLength && (
          <span className="text-[10px] text-gray-400">
            {(value ?? "").length}/{maxLength}
          </span>
        )}
      </div>

      <div className="relative group">
        <textarea
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          onChange={onChange}
          {...registration}
          className={`w-full px-3 py-1.5 rounded-lg bg-white border text-xs text-gray-800 placeholder-gray-400
            transition-all duration-200 ease-out resize-y
            focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "pr-8" : ""}
            ${
              error
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-gray-300 hover:border-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20"
            }`}
        />

        {error && (
          <div className="absolute right-2 top-2">
            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
          </div>
        )}
      </div>

      {error && (
        <p className="flex items-center gap-1 text-[10px] text-red-500">
          <AlertCircle className="w-2.5 h-2.5" />
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
  required?: boolean;
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  error,
  disabled,
  required,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

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
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-medium text-gray-600 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500 text-xs">*</span>}
      </label>
      <div ref={ref} className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-white border text-xs
            transition-all duration-200 ease-out text-left
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              error
                ? "border-red-400"
                : open
                ? "border-gray-500 ring-2 ring-gray-500/20"
                : "border-gray-300 hover:border-gray-400"
            }`}
        >
          <span className={selected ? "text-gray-800" : "text-gray-400"}>
            {selected?.label ?? placeholder}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
              open ? "rotate-180 text-gray-500" : "text-gray-400"
            }`}
          />
        </button>

        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-lg bg-white border border-gray-200 shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <div className="max-h-56 overflow-y-auto custom-scroll">
              {options.length === 0 ? (
                <div className="px-3 py-3 text-center text-xs text-gray-500">
                  No options available
                </div>
              ) : (
                options.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(opt)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-all duration-100
                        ${
                          isSelected
                            ? "bg-gray-100 text-gray-800"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check className="w-3 h-3 text-gray-600 shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="flex items-center gap-1 text-[10px] text-red-500">
          <AlertCircle className="w-2.5 h-2.5" />
          {error}
        </p>
      )}
    </div>
  );
}