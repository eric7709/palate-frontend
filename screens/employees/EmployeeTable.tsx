"use client"

import { useGetAllEmployees } from '@/models/employee/hooks';
import { useEmployeeStore } from '@/models/employee/store';
import { Edit, Trash2 } from 'lucide-react';

const roleColor = (role: string) => {
  switch (role) {
    case 'ROLE_ADMIN': return 'bg-purple-100 text-purple-800';
    case 'ROLE_CASHIER': return 'bg-blue-100 text-blue-800';
    case 'ROLE_WAITER': return 'bg-emerald-100 text-emerald-800';
    case 'ROLE_CHEF': return 'bg-orange-100 text-orange-800';
    case 'ROLE_COOK': return 'bg-amber-100 text-amber-800';
    case 'ROLE_BAKER': return 'bg-pink-100 text-pink-800';
    case 'ROLE_MANAGER': return 'bg-indigo-100 text-indigo-800';
    default: return 'bg-gray-200 text-gray-700';
  }
};

const roleLabel = (role: string) =>
  role?.replace('ROLE_', '').charAt(0) + role?.replace('ROLE_', '').slice(1).toLowerCase();

const statusColor = (s: string) => {
  const l = s?.toLowerCase();
  if (l === 'active') return 'bg-emerald-100 text-emerald-800';
  if (l === 'inactive') return 'bg-gray-200 text-gray-700';
  return 'bg-gray-200 text-gray-700';
};

export default function EmployeeTable() {
  const { search, setModal, setSelectedEmployeeId } = useEmployeeStore();
  const { data } = useGetAllEmployees({ search });
  console.log(data?.content, "wbjDBwbdjd")

  const employees = data?.content;
  if (employees?.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-3xl border-blue-500/30 border bg-linear-to-br from-blue-500/20 to-gray-950">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700/60">
            {['#', 'Name', 'Email', 'Phone', 'Gender', 'Role', 'Status', 'Actions'].map((h) => (
              <th key={h} className="px-3 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700/40">
          {employees?.map((employee, index) => (
            <tr key={employee.id} className="hover:bg-gray-700/20 transition-colors">
              <td className="px-3 py-2 font-mono text-[10px] text-gray-500">#{index+1}</td>
              <td className="px-3 py-2">
                <p className="text-white text-[13px] font-medium">
                  {employee.firstName} {employee.lastName}
                </p>
              </td>
              <td className="px-3 py-2 text-gray-400 text-xs">{employee.email}</td>
              <td className="px-3 py-2 text-gray-400 text-xs">{employee.phoneNumber}</td>
              <td className="px-3 py-2 text-gray-400 text-xs capitalize">{employee.gender?.toLowerCase()}</td>
              <td className="px-3 py-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${roleColor(employee.role)}`}>
                  {roleLabel(employee.role)}
                </span>
              </td>
              <td className="px-3 py-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColor(employee.status)}`}>
                  {employee.status || 'Unknown'}
                </span>
              </td>
              <td className="px-3 py-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => { setSelectedEmployeeId(employee.id); setModal('editEmployee'); }}
                    className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => { setSelectedEmployeeId(employee.id); setModal('deleteEmployee'); }}
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
  );
}