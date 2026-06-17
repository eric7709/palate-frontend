"use client";

import { QRCodeSVG } from "qrcode.react";
import { X, ExternalLink } from "lucide-react";
import { RoomResponseDTO } from "@/src/room/types";
import Link from "next/link";

export function RoomQrCodeModal({ room, onClose }: { room: RoomResponseDTO; onClose: () => void }) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL;

  const qrValue = `${baseUrl}/room-order/${room.qrCode}`;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/20">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-xs bg-gray-50 border border-gray-200 rounded-2xl shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200/60">
          <h3 className="text-sm font-semibold text-gray-700">Room QR Code</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-200/70 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-6 text-center space-y-3">
          <div className="bg-white p-3 rounded-xl border border-gray-200 inline-block shadow-sm">
            <QRCodeSVG value={qrValue} size={160} level="H" includeMargin />
          </div>

          <div>
            <p className="text-gray-800 text-sm font-medium">
              Room {room.roomNumber}
            </p>
            <p className="text-gray-500 text-xs">
              {room.floor != null ? `Floor ${room.floor} · ` : ""}ID {room.id}
            </p>
            <p className="text-gray-400 text-[10px] font-mono mt-1">
              {room.qrCode}
            </p>
          </div>
          <Link href={qrValue} target="_blank" rel="noopener noreferrer">
            <button className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2.5 px-3 rounded-lg shadow-md transition-colors">
              <ExternalLink className="w-4 h-4" />
              Go to Menu
            </button>
          </Link>

          <p className="text-gray-500 mt-2 text-[11px]">
            Scan QR or click the button to open the menu
          </p>
        </div>
      </div>
    </div>
  );
}