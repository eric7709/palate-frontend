import { RestaurantTableResponseDTO } from '@/models/restaurantTable/types';
import { Hash, Users, Clock } from 'lucide-react';

interface TableCardProps {
  table: RestaurantTableResponseDTO;
}

export function TableCard({ table }: TableCardProps) {
  const getInitials = (name?: string) => 
    name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "??";

  return (
    <div className="bg-[#1a1c21] border border-white/10 rounded-lg p-3 hover:border-emerald-500/50 transition-colors shadow-sm">
      <div className="flex justify-between items-start">
        {/* Table Identity */}
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-tight">{table.tableName}</h3>
          <div className="flex items-center gap-1 mt-1 text-emerald-400">
            <Hash className="w-3 h-3" />
            <span className="text-base font-bold">{table.tableNumber}</span>
          </div>
        </div>

        {/* Waiter Badge */}
        <div className="flex items-center gap-2 bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">
          <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] text-indigo-300 font-bold">
            {getInitials(table.cashierName)}
          </div>
          <span className="text-[11px] text-indigo-200 font-medium">{table.cashierName?.split(' ')[0]}</span>
        </div>
      </div>

      {/* Footer Metadata */}
      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-gray-500">
        <div className="flex items-center gap-1.5">
          <Users className="w-3 h-3" />
          <span className="text-[10px]">{table.capacity}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          <span className="text-[10px]">{table.status}</span>
        </div>
      </div>
    </div>
  );
}