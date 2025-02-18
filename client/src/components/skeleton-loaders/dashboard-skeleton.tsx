import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "lucide-react";

export function DashboardSkeleton() {
  return (
    <div className="p-2 sm:p-4 relative min-h-screen">
      {/* Loader overlay */}
      <div className="fixed inset-0 z-50 flex items-start pt-16 justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-white/10 shadow-lg">
          <Loader size="20" className="animate-spin text-primary" />
          <span className="text-sm font-semibold text-muted-foreground">Loading...</span>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row gap-4 lg:space-x-4">
        {/* Sidebar */}
        <div className="w-full lg:w-64 space-y-6 p-2">
          {/* Workspace name */}
          <Skeleton className="h-8 w-[70%]" />
          
          {/* Navigation items */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-[80%]" />
            <Skeleton className="h-6 w-[60%]" />
            <Skeleton className="h-6 w-[75%]" />
          </div>
          
          {/* Project Section */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-[85%]" />
            <div className="space-y-2 pl-2">
              <Skeleton className="h-5 w-[70%]" />
              <Skeleton className="h-5 w-[65%]" />
              <Skeleton className="h-5 w-[75%]" />
            </div>
          </div>
          
          {/* User info */}
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6 p-2">
          {/* Header */}
          <Skeleton className="h-10 w-[200px] sm:w-[300px]" />
          
          {/* Overview cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </div>
          
          {/* Recent section */}
          <div className="space-y-4">
            <Skeleton className="h-7 w-[180px]" />
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <Skeleton className="h-6 w-[60%] sm:w-[70%]" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
