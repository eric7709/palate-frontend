"use client";
import { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: "sm" | "md" | "lg";
}

const widths = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export default function Modal({ show, onClose, title, children, footer, width = "md" }: ModalProps) {
  useEffect(() => {
    if (!show) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className={`w-full ${widths[width]} bg-[#1a1c21] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
          <h2 className="text-sm font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/8 transition-all active:scale-90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4 flex-1">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-5 py-4 border-t border-white/6 flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}