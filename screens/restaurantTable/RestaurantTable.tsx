import { useGetAllTables, useUpdateTable } from '@/models/restaurantTable/hooks';
import { useTableStore } from '@/models/restaurantTable/store';
import { RestaurantTableResponseDTO } from '@/models/restaurantTable/types';
import { Edit, Trash2, CheckCircle, XCircle, QrCode } from 'lucide-react';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

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
  const copy = () => navigator.clipboard.writeText(url);

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
        <div className="px-4 py-4 text-center space-y-3">
          <div className="bg-white p-3 rounded-lg inline-block">
            <QRCodeSVG value={url} size={160} level="H" includeMargin />
          </div>
          <div>
            <p className="text-white text-sm font-medium">{table.tableName}</p>
            <p className="text-gray-500 text-xs">Table #{table.tableNumber} · ID {table.id}</p>
          </div>
          <div className="bg-gray-900/60 rounded-lg p-2.5 text-left">
            <p className="text-[10px] text-gray-500 mb-1">Menu URL</p>
            <p className="text-blue-400 text-xs break-all">{url}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={copy} className="flex-1 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              Copy URL
            </button>
            <button onClick={() => window.open(url, '_blank')} className="flex-1 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
              Open Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RestaurantTable() {
  const { setModal, setSelectedTable, search } = useTableStore();
  const { data } = useGetAllTables({ search });
  const { mutate, isPending } = useUpdateTable();
  const [qrTable, setQrTable] = useState<RestaurantTableResponseDTO | null>(null);

  const tables = data?.content;
  if (tables?.length === 0) return null;

  const onToggleStatus = (table: RestaurantTableResponseDTO) => {
    const status = table.status === 'AVAILABLE' ? 'OCCUPIED' : 'AVAILABLE';
    mutate({ id: table.id, payload: { ...table, status } });
  };

  return (
    <>
      <div className="overflow-x-auto rounded-3xl border-blue-500/30 border bg-linear-to-br from-blue-500/20 to-gray-950">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700/60">
              {['#', 'Name', 'Number', 'Capacity', 'Waiter', 'Cashier', 'Status', 'Actions'].map((h) => (
                <th key={h} className="px-3 py-2.5 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/40">
            {tables?.map((table, index) => (
              <tr key={table.id} className="hover:bg-gray-700/20 transition-colors">
                <td className="px-3 py-2 font-mono text-[10px] text-gray-500">#{index+1}</td>
                <td className="px-3 py-2 text-white text-[12px] font-medium">{table.tableName}</td>
                <td className="px-3 py-2 text-gray-300">{table.tableNumber}</td>
                <td className="px-3 py-2 text-gray-300">{table.capacity ?? '—'}</td>
                <td className="px-3 py-2">
                  {table.waiterName ? (
                    <span className="px-2 py-0.5 rounded-full bg-gray-700/60 text-gray-300 text-[10px]">{table.waiterName}</span>
                  ) : (
                    <span className="text-gray-600 text-[10px]">—</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  {table.cashierName ? (
                    <span className="px-2 py-0.5 rounded-full bg-gray-700/60 text-gray-300 text-[10px]">{table.cashierName}</span>
                  ) : (
                    <span className="text-gray-600 text-[10px]">—</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColor(table.status)}`}>
                    {table.status}
                  </span>
                </td>
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
                      onClick={() => onToggleStatus(table)}
                      disabled={isPending}
                      className="p-1.5 rounded-lg bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 transition-colors disabled:opacity-50"
                      title="Toggle status"
                    >
                      {table.status === 'AVAILABLE' ? (
                        <CheckCircle className="w-3.5 h-3.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => { setSelectedTable(table); setModal('editTable'); }}
                      className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => { setSelectedTable(table); setModal('deleteTable'); }}
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
    </>
  );
}