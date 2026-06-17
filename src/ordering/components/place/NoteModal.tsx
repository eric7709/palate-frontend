"use client";

import { useState, useEffect } from "react";
import { X, StickyNote } from "lucide-react";
import { useOrderRequestStore } from "../../store.request";
import { TextareaField } from "@/src/shared/components/InputField";

export function NoteModal() {
  const { modal, setModal, orderRequest, setNote } = useOrderRequestStore();
  const [draft, setDraft] = useState(orderRequest.note ?? "");

  const isOpen = modal === "NOTE";

  useEffect(() => {
    if (isOpen) {
      setDraft(orderRequest.note ?? "");
    }
  }, [isOpen, orderRequest.note]);

  if (!isOpen) return null;

  const handleSave = () => {
    setNote(draft.trim());
    setModal("CONFIRM");
  };

  const handleCancel = () => {
    setModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <StickyNote className="w-4 h-4 text-gray-500" />
            <h2 className="text-sm font-semibold text-gray-800">
              Add a note
            </h2>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4">
          <TextareaField
            label="Special instructions"
            placeholder="e.g. No onions, extra spicy, allergic to peanuts..."
            rows={4}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <p className="mt-1 text-[10px] text-gray-400">
            This note will be visible to the kitchen and waiter.
          </p>
        </div>

        <div className="flex gap-2 px-4 py-3 border-t border-gray-100">
          <button
            onClick={handleCancel}
            className="flex-1 py-2.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-lg bg-gray-900 text-xs font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Save note
          </button>
        </div>
      </div>
    </div>
  );
}