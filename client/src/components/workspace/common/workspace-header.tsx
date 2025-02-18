import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthContext } from "@/context/auth-provider";
import { Loader } from "lucide-react";

const WorkspaceHeader = () => {
  const { workspaceLoading, workspace } = useAuthContext();
  return (
    <header className="w-full px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-3xl mx-auto">
        {workspaceLoading ? (
          <div className="flex justify-center items-center h-16">
            <Loader className="w-6 h-6 animate-spin text-gray-600" />
          </div>
        ) : (
          <div className="flex items-center gap-3 sm:gap-4">
            <Avatar className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-lg shadow-sm">
              <AvatarFallback 
                className="rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 text-white font-semibold"
                style={{ fontSize: 'calc(1rem + 1vw)' }}
              >
                {workspace?.name?.split(" ")?.[0]?.charAt(0) || "W"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                {workspace?.name}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Free Plan
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default WorkspaceHeader;
