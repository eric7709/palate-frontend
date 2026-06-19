"use client";
import { useEffect } from "react";
import { HistoryHeader } from "./HistoryHeader";
import { HistoryCardList } from "./HistoryCardList";
import { CustomerOrderDTO } from "../../types";
import { useOrderRequestStore } from "../../store/index.request";

interface Props {
  onReorder?: (order: CustomerOrderDTO) => void;
}

export  function HistoryPage({ onReorder }: Props) {
  const { modal, setModal } = useOrderRequestStore();
  const isOpen = modal === "HISTORY";

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={() => setModal(null)}
      />

      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-gray-50 shadow-2xl z-50 flex flex-col animate-slide-in-right">
        <HistoryHeader />
        <div className="flex-1 overflow-y-auto">
          <HistoryCardList  />
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.28s cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>
    </>
  );
}