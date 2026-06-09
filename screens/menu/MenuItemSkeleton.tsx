export function MenuSkeleton() {
  return (
    <div className="flex flex-col gap-2 p-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 bg-white p-2.5 rounded-full border border-gray-100 animate-pulse">
          {/* Circular image */}
          <div className="w-12 h-12 shrink-0 rounded-full bg-gray-100" />
          {/* Name + price */}
          <div className="flex-1 space-y-2 pr-2">
            <div className="h-3 bg-gray-200 rounded-full w-32" />
            <div className="h-3 bg-gray-100 rounded-full w-16" />
          </div>
          {/* Button */}
          <div className="w-16 h-8 bg-gray-200 rounded-full shrink-0" />
        </div>
      ))}
    </div>
  );
}