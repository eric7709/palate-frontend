"use client";

import { useGetAllEmployees } from '@/models/employee/hooks';
import { useEmployeeStore } from '@/models/employee/store';
import { Edit, Trash2, Circle } from 'lucide-react';

// Predefined background colors for avatars
const AVATAR_COLORS = [
  'bg-indigo-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-purple-500',
  'bg-blue-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-teal-500',
];

const roleColor = (role: string) => {
  switch (role) {
    case 'ROLE_ADMIN':   return 'bg-purple-50 text-purple-700 border border-purple-200/50';
    case 'ROLE_CASHIER': return 'bg-blue-50 text-blue-700 border border-blue-200/50';
    case 'ROLE_WAITER':  return 'bg-emerald-50 text-emerald-700 border border-emerald-200/50';
    case 'ROLE_CHEF':    return 'bg-orange-50 text-orange-700 border border-orange-200/50';
    case 'ROLE_COOK':    return 'bg-amber-50 text-amber-700 border border-amber-200/50';
    case 'ROLE_BAKER':   return 'bg-pink-50 text-pink-700 border border-pink-200/50';
    case 'ROLE_MANAGER': return 'bg-indigo-50 text-indigo-700 border border-indigo-200/50';
    default:             return 'bg-gray-50 text-gray-600 border border-gray-200/50';
  }
};

const roleDot = (role: string) => {
  switch (role) {
    case 'ROLE_ADMIN':   return 'bg-purple-500';
    case 'ROLE_CASHIER': return 'bg-blue-500';
    case 'ROLE_WAITER':  return 'bg-emerald-500';
    case 'ROLE_CHEF':    return 'bg-orange-500';
    case 'ROLE_COOK':    return 'bg-amber-500';
    case 'ROLE_BAKER':   return 'bg-pink-500';
    case 'ROLE_MANAGER': return 'bg-indigo-500';
    default:             return 'bg-gray-400';
  }
};

const roleLabel = (role: string) => role?.replace('ROLE_', '').toUpperCase();

export default function EmployeeTable() {
  const { search, setModal, setSelectedEmployee } = useEmployeeStore();
  const { data, isLoading } = useGetAllEmployees({ search });

  const employees = data?.content;
  if (employees?.length === 0) return null;

  const getAvatarColor = (id: number) => AVATAR_COLORS[id % AVATAR_COLORS.length];

  const getInitial = (employee: any) => {
    const first = employee.firstName?.trim();
    if (first) return first.charAt(0).toUpperCase();
    const last = employee.lastName?.trim();
    if (last) return last.charAt(0).toUpperCase();
    return 'E';
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Employee</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Gender</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {employees?.map((employee) => (
            <tr
              key={employee.id}
              className="group transition-all duration-150 hover:bg-linear-to-r hover:from-gray-50/80 hover:to-transparent"
            >
              {/* Employee (Avatar + Name) */}
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-white ${getAvatarColor(employee.id)}`}
                  >
                    {getInitial(employee)}
                  </div>
                  <p className="text-xs font-medium text-gray-800 group-hover:text-gray-900 transition-colors">
                    {employee.firstName} {employee.lastName}
                  </p>
                </div>
              </td>

              {/* Email */}
              <td className="px-3 py-2.5 text-xs text-gray-500">{employee.email}</td>

              {/* Phone */}
              <td className="px-3 py-2.5 text-xs text-gray-500">{employee.phoneNumber}</td>

              {/* Gender */}
              <td className="px-3 py-2.5 text-xs text-gray-500 capitalize">
                {employee.gender?.toLowerCase() || '—'}
              </td>

              {/* Role */}
              <td className="px-3 py-2.5">
                <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${roleColor(employee.role)}`}>
                  <Circle className={`w-1.5 h-1.5 fill-current ${roleDot(employee.role)}`} />
                  {roleLabel(employee.role)}
                </div>
              </td>

              {/* Actions */}
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => { setSelectedEmployee(employee); setModal('editEmployee'); }}
                    className="p-1.5 rounded-lg bg-indigo-50 text-indigo-500 hover:bg-indigo-100 hover:text-indigo-700 transition-all duration-200 hover:scale-105 active:scale-95"
                    title="Edit employee"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => { setSelectedEmployee(employee); setModal('deleteEmployee'); }}
                    className="p-1.5 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-700 transition-all duration-200 hover:scale-105 active:scale-95"
                    title="Delete employee"
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