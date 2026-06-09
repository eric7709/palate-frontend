
export default function CategorySkeleton() {
    return (
        <div className="flex gap-2 px-4 py-3 overflow-x-auto">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-8 w-20 rounded-full bg-gray-100 animate-pulse shrink-0" />
            ))}
        </div>
    )
}
