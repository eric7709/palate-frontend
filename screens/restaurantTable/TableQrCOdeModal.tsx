import { QRCodeSVG } from "qrcode.react";
import { X, ExternalLink } from "lucide-react";
import Link from "next/link";
import { RestaurantTableResponseDTO } from "@/models/restaurantTable/types";

export function TableQrCodeModal({ table, onClose }: { table: RestaurantTableResponseDTO; onClose: () => void }) {
  const qrValue = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/table-order/${table.qrCode}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-xs bg-white border border-gray-200 rounded-xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-medium text-gray-800">Table QR Code</h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        </div>


        {/* Body */}
        <div className="px-4 py-6 text-center space-y-3">
          <p className="text-gray-800 text-sm font-medium">{table.tableName}</p>
          <div className="bg-white p-3 rounded-lg inline-block shadow-sm border border-gray-100">
            <QRCodeSVG value={qrValue} size={160} level="H" includeMargin />
          </div>

          {/* Table info */}
          <div>
            <p className="text-gray-500 text-xl"> <b className="text-black">No. {table.tableNumber}</b></p>
          </div>

          {/* Navigation button */}
          <Link href={qrValue} target="_blank" rel="noopener noreferrer">
            <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-[13px]  cursor-pointer duration-300 active:scale-90 font-semibold py-2.5  px-3 rounded-lg transition-colors">
              Go to Menu
            </button>
          </Link>

          <p className="text-gray-400 text-[11px] mt-2">
            Scan QR or click the button to open the menu
          </p>
        </div>
      </div>
    </div>
  );
}