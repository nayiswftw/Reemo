import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  columns,
  rows = 20,
}) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm overflow-x-auto">
      {/* Table Header Skeleton */}
      <div className="flex min-w-full h-12 bg-gray-50 rounded-t-lg sticky top-0 z-10">
        {[...Array(columns)].map((_, index) => (
          <div
            key={`header-col-${index}`}
            className={`flex-1 min-w-[150px] px-4 py-3`}
          >
            <Skeleton className="h-5 w-[80%] rounded-md" />
          </div>
        ))}
      </div>

      {/* Table Body Skeleton */}
      <div className="divide-y divide-gray-100">
        {[...Array(rows)].map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="flex min-w-full hover:bg-gray-50 transition-colors"
          >
            {[...Array(columns)].map((_, colIndex) => (
              <div
                key={`row-${rowIndex}-col-${colIndex}`}
                className={`flex-1 min-w-[150px] px-4 py-3`}
              >
                <Skeleton 
                  className={`h-4 w-${colIndex === 0 ? '[70%]' : '[60%]'} rounded-md`} 
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
