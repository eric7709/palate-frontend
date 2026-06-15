"use client";

import { useEffect, useState } from "react";
import { useGetAllMenuItems } from "@/models/menuItem/hooks";
import MenuItemCard from "./MenuItemCard";
import Loader from "@/ui/Loader";

export default function MenuList() {
    const [search, setSearch] = useState("");
    const { data, isLoading } = useGetAllMenuItems({ search });
    const [hasLoaded, setHasLoaded] = useState(false)

    useEffect(() => {
        setHasLoaded(true)
    }, [])

    if (isLoading && !hasLoaded) return <Loader />

    return (
        <div className="mx-auto w-full p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-gray-800">Menu Management</h2>
                {/* Search Input - Light Theme */}
                <input
                    type="text"
                    placeholder="Search items..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full md:w-64"
                />
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {data?.content.map((item) => (
                    <MenuItemCard key={item.id} menuItem={item} />
                ))}
            </div>

            {/* Empty State - Light Theme */}
            {data?.content.length === 0 && (
                <p className="text-center text-gray-500 mt-10">No items found matching your search.</p>
            )}
        </div>
    );
}