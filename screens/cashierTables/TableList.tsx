"use client"
import { useGetTablesByAccount } from '@/models/restaurantTable/hooks';
import { TableCard } from './TableCard';
import Loader from '@/ui/Loader';


export default function TableList() {
    const { data, isLoading } = useGetTablesByAccount({ cashierId: 3 })
      if(isLoading) return <Loader />
    return (
        <div className="p-6 max-w-400 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {data?.map((table) => (
                    <TableCard key={table.id} table={table} />
                ))}
            </div>
        </div>
    );
}