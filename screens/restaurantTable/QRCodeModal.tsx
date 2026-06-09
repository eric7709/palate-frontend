import { QRCodeSVG } from "qrcode.react";
import { XCircle, ExternalLink } from "lucide-react";
import Link from "next/link"; // using Next.js Link; for plain React, use <a>
import { RestaurantTableResponseDTO } from "@/models/restaurantTable/types";


const getQrValue = (id: number) =>
  `${typeof window !== 'undefined' ? window.location.origin : ''}/menu/${id}`;

export function QrCOdeModal({ table, onClose }: { table: RestaurantTableResponseDTO; onClose: () => void }) {
  const url = getQrValue(table.id); // full URL for QR code
  const menuPath = `/menu/${table.id}`; // relative path for the button

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-xs bg-gray-800/95 border border-gray-700/60 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700/60">
          <h3 className="text-sm font-medium text-white">Table QR Code</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-700 transition-colors">
            <XCircle className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <div className="px-4 py-6 text-center space-y-3">
          <div className="bg-white p-3 rounded-lg inline-block">
            <QRCodeSVG value={url} size={160} level="H" includeMargin />
          </div>

          {/* Table info */}
          <div>
            <p className="text-white text-sm font-medium">{table.tableName}</p>
            <p className="text-gray-500 text-xs">Table #{table.tableNumber} · ID {table.id}</p>
          </div>

          {/* Navigation button */}
          <Link href={menuPath}>
            <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors">
              <ExternalLink className="w-4 h-4" />
              Go to Menu
            </button>
          </Link>

          <p className="text-gray-500 text-[11px]">Scan QR or click the button to open the menu</p>
        </div>
      </div>
    </div>
  );
}