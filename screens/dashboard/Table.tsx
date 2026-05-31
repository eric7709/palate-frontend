import { DollarSignIcon } from 'lucide-react'
import React from 'react'

export default function Table() {
    const tableHeaders = ["#", "Table", "Customer", "Total", "Status", "Time"]
    const orders = [
        { id: 1, table: 'Table 1', customer: 'John Doe', total: 45.50, status: 'COMPLETED', time: '10:30 AM' },
        { id: 2, table: 'Table 3', customer: 'Jane Smith', total: 78.00, status: 'PENDING', time: '11:15 AM' },
        { id: 3, table: 'Table 5', customer: 'Mike Johnson', total: 120.00, status: 'PREPARING', time: '11:45 AM' },
        { id: 4, table: 'Table 2', customer: 'Sarah Wilson', total: 65.50, status: 'COMPLETED', time: '12:00 PM' },
        { id: 5, table: 'Table 4', customer: 'David Brown', total: 95.00, status: 'SERVED', time: '12:30 PM' },
        { id: 6, table: 'Table 6', customer: 'Emily Davis', total: 145.00, status: 'COMPLETED', time: '1:00 PM' },
        { id: 7, table: 'Table 2', customer: 'Chris Wilson', total: 55.50, status: 'PENDING', time: '1:30 PM' },
        { id: 8, table: 'Table 8', customer: 'Lisa Anderson', total: 88.00, status: 'PREPARING', time: '2:00 PM' },
    ]
    return (
        <div className="text-white bg-linear-to-b from-gray-950 to-gray-800 rounded-2xl border border-white">
            <div className='flex text-sm border-b font-semibold items-center p-3 justify-between'>
                <div className="">
                    <p className='text-base'>Recent Orders</p>
                    <p className='font-normal text-[12px] text-gray-300'>Latest Transactions</p>
                </div>
                <DollarSignIcon />
            </div>
            <table className='w-full text-sm font-normal'>
                <thead>
                    <tr>
                        {tableHeaders.map((el) => (
                            <th className='px-3 py-2 text-left font-medium'>{el}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {orders.map((o: any, i: number) => (
                        <tr key={o.id} className="hover:bg-gray-800/30 text-[13px] transition-colors">
                            <td className="px-3 py-2 font-mono text-xs text-gray-500">#{o.id}</td>
                            <td className="px-3 py-2">{o.table}</td>
                            <td className="px-3 py-2 text-gray-300">{o.customer}</td>
                            <td className="px-3 py-2 font-medium text-emerald-400">${o.total}</td>
                            <td className="px-3 text-[11px] py-2">
                                <span className={`px-1.5 py-0.5 rounded  font-medium text-white`}>
                                    {o.status}
                                </span>
                            </td>
                            <td className="px-3 py-2 text-gray-500">{o.time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

const STATUS_STYLES: Record<string, string> = {
    COMPLETED: 'bg-emerald-100 text-emerald-800',
    PENDING: 'bg-amber-100 text-amber-800',
    PREPARING: 'bg-blue-100 text-blue-800',
    SERVED: 'bg-purple-100 text-purple-800',
};