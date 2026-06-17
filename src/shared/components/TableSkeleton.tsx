interface TableSkeletonProps {
  rows?: number;
  columns?: number; // Accepts 2, 3, 4, or 5 columns (Default is 5)
  className?: string; // For passing custom Tailwind heights like h-[400px]
}

export function TableSkeleton({ rows = 5, columns = 5, className = "" }: TableSkeletonProps) {
  // Map column count to matching layout distributions
  const getColWidthClass = (index: number) => {
    if (columns === 2) return index === 0 ? "w-3/4" : "w-1/4 flex justify-end";
    if (columns === 3) return index === 0 ? "w-2/4" : index === 1 ? "w-1/4" : "w-1/4 flex justify-end";
    if (columns === 4) return index === 0 ? "w-2/5" : "w-1/5";
    
    // Default 5 columns distribution
    return index === 0 ? "w-1/4" : index === 4 ? "ml-auto shrink-0" : "w-1/6";
  };

  return (
    <div className={`w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm animate-pulse ${className}`}>
      
      {/* Dynamic Header Row */}
      <div className="flex items-center border-b border-gray-100 bg-gray-50/70 px-6 py-3.5">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div 
            key={`head-${colIndex}`} 
            className={getColWidthClass(colIndex)}
          >
            <div className={`h-4 bg-gray-200 rounded ${colIndex === columns - 1 && columns <= 3 ? 'w-12' : 'w-20'}`} />
          </div>
        ))}
      </div>

      {/* Dynamic Body Rows */}
      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex items-center px-6 py-4">
            {Array.from({ length: columns }).map((_, colIndex) => {
              const widthClass = getColWidthClass(colIndex);

              return (
                <div key={`cell-${rowIndex}-${colIndex}`} className={widthClass}>
                  {colIndex === 0 ? (
                    /* Column 1: Dominant Data Info (Title + Subtitle) */
                    <div className="space-y-2">
                      <div className="h-3.5 bg-gray-200 rounded w-32" />
                      <div className="h-2.5 bg-gray-100 rounded w-20" />
                    </div>
                  ) : colIndex === columns - 1 ? (
                    /* Last Column: Action Button Capsule / Circle */
                    <div className="w-8 h-8 bg-gray-100 rounded-full" />
                  ) : colIndex === 3 && columns === 5 ? (
                    /* Column 4 (Status Pill Layout) */
                    <div className="h-6 bg-gray-100 rounded-full w-20" />
                  ) : (
                    /* Standard Plain Text Columns */
                    <div className="h-3 bg-gray-100 rounded w-16" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

    </div>
  );
}