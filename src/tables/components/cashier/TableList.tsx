"use client"
import { useGetTablesByAccount } from '@/src/tables/hooks/hooks.api';
import { TableCard } from './TableCard';
import Loader from '@/src/shared/components/loaders/Loader';
import { useAuthStore } from '@/src/auth/store';


export default function TableList() {
    const { user } = useAuthStore()
    const { data, isLoading } = useGetTablesByAccount({ cashierId: user?.id })
    if (isLoading) return <Loader />

    if (data?.length == 0) return <div className="min-h-[80vh] flex items-center justify-center text-white">
        No Table assigned yet</div>


    return (
        <div className="p-6 w-full mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {data?.map((table) => (
                    <TableCard key={table.id} table={table} />
                ))}
            </div>
        </div>
    );
}