"use client"
import { MenuItemSkeleton } from "@/src/orders";
import { CategorySkeleton } from "@/src/orders/components/browse/categories/CategorySkeleton";
import { Header } from "@/src/orders/components/shared/Header";

export default function Loader() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <CategorySkeleton />
            <MenuItemSkeleton />
        </div>
    )
}
