"use client";
import { Loader2, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

type Props = {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export default function DeleteModal({
  show,
  onClose,
  onConfirm,
  isDeleting,
  title,
  description,
  children,
}: Props) {
  useEffect(() => {
    if (!show) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [show, onClose]);
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/20">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-[325px] bg-white border border-gray-200 shadow-xl rounded-2xl p-5">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-rose-500" />
          </div>
        </div>
        {/* Title */}
        <div className="text-center mb-4">
          <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
          {description && (
            <p className="text-[11px] text-gray-500 mt-1">{description}</p>
          )}
        </div>
        {/* Children */}
        {children && (
          <div className="mb-4 p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-600">
            {children}
          </div>
        )}
        {/* Footer */}
        <div className="flex items-center gap-2 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-[0.98] cursor-pointer"
          >
            {isDeleting && <Loader2 size={13} className="animate-spin" />}
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}