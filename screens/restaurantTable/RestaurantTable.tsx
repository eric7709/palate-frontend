"use client";
import { useGetAllTables } from '@/models/restaurantTable/hooks';
import { useTableStore } from '@/models/restaurantTable/store';
import { RestaurantTableResponseDTO } from '@/models/restaurantTable/types';
import { Edit, Trash2, QrCode, UserPlus, X } from 'lucide-react';
import { useState } from 'react';
import { AllocateStaffModal } from './AllocateStaffModal';
import { DeallocateStaffModal } from './DeallocateStaffModal';
import { TableQrCodeModal } from './TableQrCOdeModal';

export default function RestaurantTable() {
  const { setModal, setSelectedTable, search } = useTableStore();
  const { data, refetch } = useGetAllTables({ search });
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
  if (!tables?.length) return null;

  const getStatusColor = (status?: string) => {
    const s = status?.toUpperCase();
    if (s === 'AVAILABLE') return 'text-green-600';
    if (s === 'OCCUPIED') return 'text-red-600';
    if (s === 'RESERVED') return 'text-amber-600';
    return 'text-gray-500';
  };

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Number</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Capacity</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Waiter</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Cashier</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tables.map((table) => (
                <tr key={table.id} className="transition-colors duration-150 hover:bg-slate-50/60">
                  {/* Name */}
                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-800">{table.tableName}</span>
                  </td>

                  {/* Number */}
                  <td className="px-4 py-3">
                    <span className="text-slate-700">{table.tableNumber}</span>
                  </td>

                  {/* Capacity */}
                  <td className="px-4 py-3">
                    <span className="text-slate-700">{table.capacity ?? '—'}</span>
                  </td>

                  {/* Waiter */}
                  <td className="px-4 py-3">
                    {table.waiterName ? (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-600">
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
                          className="grid h-6 w-6 place-content-center rounded-full border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-100 hover:text-red-700"
                          title="Deallocate waiter"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          setAllocateModal({ tableId: table.id, tableName: table.tableName, role: 'waiter' })
                        }
                        className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600 transition-colors hover:bg-green-100 hover:text-green-700"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        Assign
                      </button>
                    )}
                  </td>

                  {/* Cashier */}
                  <td className="px-4 py-3">
                    {table.cashierName ? (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-600">
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
                          className="grid h-6 w-6 place-content-center rounded-full border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-100 hover:text-red-700"
                          title="Deallocate cashier"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          setAllocateModal({ tableId: table.id, tableName: table.tableName, role: 'cashier' })
                        }
                        className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600 transition-colors hover:bg-green-100 hover:text-green-700"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        Assign
                      </button>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-bold uppercase ${getStatusColor(table.status)}`}>
                      {table.status?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setQrTable(table)}
                        className="rounded-lg bg-purple-50 p-1.5 text-purple-600 transition-colors hover:bg-purple-100 hover:text-purple-700"
                        title="QR Code"
                      >
                        <QrCode className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => { setSelectedTable(table); setModal('editTable'); }}
                        className="rounded-lg bg-indigo-50 p-1.5 text-indigo-600 transition-colors hover:bg-indigo-100 hover:text-indigo-700"
                        title="Edit"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => { setSelectedTable(table); setModal('deleteTable'); }}
                        className="rounded-lg bg-rose-50 p-1.5 text-rose-600 transition-colors hover:bg-rose-100 hover:text-rose-700"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {qrTable && <TableQrCodeModal table={qrTable} onClose={() => setQrTable(null)} />}
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