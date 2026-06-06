"use client"
import { useGetAllTables } from '@/models/restaurantTable/hooks';
import { useTableStore } from '@/models/restaurantTable/store';
import { RestaurantTableResponseDTO } from '@/models/restaurantTable/types';
import { Edit, Trash2, QrCode, UserPlus, UserMinus, XCircle } from 'lucide-react';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { AllocateStaffModal } from './AllocateStaffModal';
import { DeallocateStaffModal } from './DeallocateStaffModal';
import Loader from '@/ui/Loader';

const statusColor = (s: string) => {
  const u = s?.toUpperCase();
  if (u === 'AVAILABLE') return 'bg-emerald-100 text-emerald-800';
  if (u === 'OCCUPIED') return 'bg-red-100 text-red-800';
  if (u === 'RESERVED') return 'bg-amber-100 text-amber-800';
  return 'bg-gray-200 text-gray-700';
};

const getQrValue = (id: number) =>
  `${typeof window !== 'undefined' ? window.location.origin : ''}/menu/${id}`;

function QrModal({ table, onClose }: { table: RestaurantTableResponseDTO; onClose: () => void }) {
  const url = getQrValue(table.id);

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
          <div>
            <p className="text-white text-sm font-medium">{table.tableName}</p>
            <p className="text-gray-500 text-xs">Table #{table.tableNumber} · ID {table.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RestaurantTable() {
  const { setModal, setSelectedTable, search } = useTableStore();
  const { data, refetch, isLoading } = useGetAllTables({ search });
  const [qrTable, setQrTable] = useState<RestaurantTableResponseDTO | null>(null);

  const [allocateModal, setAllocateModal] = useState<{
    tableId: number;
    tableName: string;
    role: 'waiter' | 'cashier';
  } | null>(null);

  const [deallocateModal, setDeallocateModal] = useState<{
    tableId: number;
    tableName: string;
    staffId: number;
    staffName: string;
    role: 'waiter' | 'cashier';
  } | null>(null);

  const tables = data?.content;
  if (tables?.length === 0) return null;
  
  return (
    <>
      <div className="overflow-x-auto rounded-3xl border-blue-500/30 border bg-linear-to-br from-blue-500/20 to-gray-950">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700/60">
              {['#', 'Name', 'Number', 'Capacity', 'Waiter', 'Cashier', 'Status', 'Actions'].map((h) => (
                <th
                  key={h}
                  className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/40">
            {tables?.map((table, index) => (
              <tr key={table.id} className="hover:bg-gray-700/20 transition-colors">
                <td className="px-3 py-2 font-mono text-[10px] text-gray-500">#{index + 1}</td>
                <td className="px-3 py-2 text-white text-[12px] font-medium">{table.tableName}</td>
                <td className="px-3 py-2 text-gray-300">{table.tableNumber}</td>
                <td className="px-3 py-2 text-gray-300">{table.capacity ?? '—'}</td>

                {/* Waiter column */}
                <td className="px-3 py-2">
                  {table.waiterName ? (
                    <div className="flex items-center gap-1">
                      <span className="px-2 py-0.5 rounded-full bg-gray-700/60 text-gray-300 text-[10px]">
                        {table.waiterName}
                      </span>
                      <button
                        onClick={() =>
                          setDeallocateModal({
                            tableId: table.id,
                            tableName: table.tableName,
                            staffId: table.waiterId!,
                            staffName: table.waiterName!,
                            role: 'waiter',
                          })
                        }
                        className="p-1 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                        title="Deallocate waiter"
                      >
                        <UserMinus className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        setAllocateModal({
                          tableId: table.id,
                          tableName: table.tableName,
                          role: 'waiter',
                        })
                      }
                      className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[10px] transition-colors"
                    >
                      <UserPlus className="w-3 h-3" />
                      Allocate
                    </button>
                  )}
                </td>

                {/* Cashier column */}
                <td className="px-3 py-2">
                  {table.cashierName ? (
                    <div className="flex items-center gap-1">
                      <span className="px-2 py-0.5 rounded-full bg-gray-700/60 text-gray-300 text-[10px]">
                        {table.cashierName}
                      </span>
                      <button
                        onClick={() =>
                          setDeallocateModal({
                            tableId: table.id,
                            tableName: table.tableName,
                            staffId: table.cashierId!,
                            staffName: table.cashierName!,
                            role: 'cashier',
                          })
                        }
                        className="p-1 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                        title="Deallocate cashier"
                      >
                        <UserMinus className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        setAllocateModal({
                          tableId: table.id,
                          tableName: table.tableName,
                          role: 'cashier',
                        })
                      }
                      className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[10px] transition-colors"
                    >
                      <UserPlus className="w-3 h-3" />
                      Allocate
                    </button>
                  )}
                </td>

                {/* Status */}
                <td className="px-3 py-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColor(
                      table.status
                    )}`}
                  >
                    {table.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setQrTable(table)}
                      className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 transition-colors"
                      title="QR Code"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTable(table);
                        setModal('editTable');
                      }}
                      className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTable(table);
                        setModal('deleteTable');
                      }}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {qrTable && <QrModal table={qrTable} onClose={() => setQrTable(null)} />}
      {allocateModal && (
        <AllocateStaffModal
          tableId={allocateModal.tableId}
          tableName={allocateModal.tableName}
          role={allocateModal.role}
          onClose={() => setAllocateModal(null)}
          onSuccess={() => refetch()}
        />
      )}
      {deallocateModal && (
        <DeallocateStaffModal
          tableId={deallocateModal.tableId}
          tableName={deallocateModal.tableName}
          staffId={deallocateModal.staffId}
          staffName={deallocateModal.staffName}
          role={deallocateModal.role}
          onClose={() => setDeallocateModal(null)}
          onSuccess={() => refetch()}
        />
      )}
    </>
  );
}