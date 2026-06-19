"use client";
import { X, Loader2 } from 'lucide-react';
import React, { useEffect } from 'react';

type Props = {
  title: string;
  description?: string;
  onClose: () => void;
  onSave: () => void;
  children: React.ReactNode;
  show?: boolean;
  isSubmitting: boolean;
};

export default function CompactModal({
  title,
  description,
  isSubmitting,
  onClose,
  onSave,
  children,
  show,
}: Props) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className={`fixed duration-150 inset-0 z-5000 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm ${
        show ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <form
        onSubmit={onSave}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-87.5 bg-white border-2 border-gray-200 shadow-md rounded-2xl p-5"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
            {description && (
              <p className="text-[11px] text-gray-500 mt-0.5">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="mb-6 max-h-72 overflow-y-auto modal-content-area">
          {children}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3">
           <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-medium cursor-pointer bg-gray-400  hover:bg-gray-500 rounded-lg text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold bg-blue-600 cursor-pointer text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-95"
          >
            {isSubmitting && <Loader2 size={14} className="animate-spin" />}
            Save
          </button>
        </div>
      </form>
    </div>
  );
}