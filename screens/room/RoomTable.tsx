"use client";

import { useGetAllRooms } from '@/models/room/hooks';
import { useRoomStore } from '@/models/room/store';
import { RoomResponseDTO } from '@/models/room/types';
import { Edit, Trash2, QrCode, UserPlus, X } from 'lucide-react';
import { useState } from 'react';
import { RoomQrCodeModal } from './RoomQrCodeModal';
import { DeallocateCashierModal } from './DeallocateCashierModal';
import { AllocateCashierModal } from './AllocateCashierModal';
import Loader from '@/ui/Loader';
import { MenuSkeleton } from '../menu/MenuItemSkeleton';
import { TableSkeleton } from '@/ui/TableSkeleton';

const floorColors = [
  'bg-linear-to-br from-indigo-100 to-indigo-200 text-indigo-800',
  'bg-linear-to-br from-emerald-100 to-emerald-200 text-emerald-800',
  'bg-linear-to-br from-amber-100 to-amber-200 text-amber-800',
  'bg-linear-to-br from-rose-100 to-rose-200 text-rose-800',
  'bg-linear-to-br from-cyan-100 to-cyan-200 text-cyan-800',
  'bg-linear-to-br from-purple-100 to-purple-200 text-purple-800',
  'bg-linear-to-br from-blue-100 to-blue-200 text-blue-800',
  'bg-linear-to-br from-orange-100 to-orange-200 text-orange-800',
  'bg-linear-to-br from-pink-100 to-pink-200 text-pink-800',
  'bg-linear-to-br from-teal-100 to-teal-200 text-teal-800',
];

export default function RoomTable() {
  const { search, setModal, setSelectedRoom } = useRoomStore();
  const { data, refetch, isLoading } = useGetAllRooms({ search });
  const [qrRoom, setQrRoom] = useState<RoomResponseDTO | null>(null);

  

  const [allocateModal, setAllocateModal] = useState<{
    roomId: number;
    roomNumber: string;
  } | null>(null);

  const [deallocateModal, setDeallocateModal] = useState<{
    roomId: number;
    roomNumber: string;
    cashierId: number;
    cashierName: string;
  } | null>(null);

  const rooms = data?.content;
  if (rooms?.length === 0) return null;

  const getFloorStyle = (floor?: number) => {
    if (floor === undefined || floor === null) return floorColors[0];
    return floorColors[floor % floorColors.length];
  };

  if(isLoading) return <TableSkeleton rows={7} />

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Room</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Floor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Cashier</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rooms?.map((room) => {
                const status = room.status?.toUpperCase() === 'AVAILABLE' ? 'AVAILABLE' : 'UNAVAILABLE';
                const statusColor = status === 'AVAILABLE' ? 'text-green-600' : 'text-red-600';

                return (
                  <tr key={room.id} className="transition-colors duration-150 hover:bg-slate-50/60">
                    {/* Room Number */}
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-800">{room.roomNumber}</span>
                    </td>

                    {/* Floor badge */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${getFloorStyle(Number(room.floor))}`}>
                        {room.floor ?? '—'}
                      </span>
                    </td>

                    {/* Cashier assignment */}
                    <td className="px-4 py-3">
                      {room.cashierName ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-red-100 text-red-600 px-2.5 py-1 text-xs font-medium ">
                            {room.cashierName}
                          </span>
                          <button
                            onClick={() =>
                              setDeallocateModal({
                                roomId: room.id,
                                roomNumber: room.roomNumber,
                                cashierId: room.cashierId!,
                                cashierName: room.cashierName!,
                              })
                            }
                            className=" cursor-pointer items-center gap-1.5 rounded-full bg-red-50 grid place-content-center h-6 w-6 text-xs font-medium text-red-600 border border-red-200 transition-colors hover:bg-red-100 hover:text-red-700"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAllocateModal({ roomId: room.id, roomNumber: room.roomNumber })}
                          className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600 border border-green-200 transition-colors hover:bg-green-100 hover:text-green-700"
                        >
                          <UserPlus className="h-3.5 w-3.5" />
                          Assign
                        </button>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-bold uppercase ${statusColor}`}>
                        {status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setQrRoom(room)}
                          className="rounded-lg p-1.5 bg-purple-50 text-purple-600 transition-colors hover:bg-purple-100 hover:text-purple-700"
                          title="QR Code"
                        >
                          <QrCode className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => { setSelectedRoom(room); setModal('UPDATE'); }}
                          className="rounded-lg p-1.5 bg-indigo-50 text-indigo-600 transition-colors hover:bg-indigo-100 hover:text-indigo-700"
                          title="Edit"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => { setSelectedRoom(room); setModal('DELETE'); }}
                          className="rounded-lg p-1.5 bg-rose-50 text-rose-600 transition-colors hover:bg-rose-100 hover:text-rose-700"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {qrRoom && <RoomQrCodeModal room={qrRoom} onClose={() => setQrRoom(null)} />}
      {allocateModal && (
        <AllocateCashierModal
          roomId={allocateModal.roomId}
          roomNumber={allocateModal.roomNumber}
          onClose={() => setAllocateModal(null)}
          onSuccess={() => refetch()}
        />
      )}
      {deallocateModal && (
        <DeallocateCashierModal
          roomId={deallocateModal.roomId}
          roomNumber={deallocateModal.roomNumber}
          cashierId={deallocateModal.cashierId}
          cashierName={deallocateModal.cashierName}
          onClose={() => setDeallocateModal(null)}
          onSuccess={() => refetch()}
        />
      )}
    </>
  );
}