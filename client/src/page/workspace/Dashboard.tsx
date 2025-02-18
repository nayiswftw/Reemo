import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import useCreateProjectDialog from "@/hooks/use-create-project-dialog";
import WorkspaceAnalytics from "@/components/workspace/workspace-analytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentProjects from "@/components/workspace/project/recent-projects";
import RecentTasks from "@/components/workspace/task/recent-tasks";
import RecentMembers from "@/components/workspace/member/recent-members";

const WorkspaceDashboard = () => {
  const { onOpen } = useCreateProjectDialog();
  
  return (
    <main className="flex-1 container mx-auto px-4 py-6 md:py-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Workspace Overview
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Here&apos;s an overview for this workspace!
          </p>
        </div>
        <Button 
          onClick={onOpen}
          className="w-full sm:w-auto shadow-sm hover:shadow-md transition-shadow"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="mb-8">
        <WorkspaceAnalytics />
      </div>

      <div className="rounded-xl shadow-sm">
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="w-full justify-start bg-gray-50/80 backdrop-blur-sm p-1 h-14 rounded-t-xl">
            <TabsTrigger 
              className="flex-1 sm:flex-none px-4 py-2 data-[state=active]:shadow-md transition-all"
              value="projects"
            >
              Recent Projects
            </TabsTrigger>
            <TabsTrigger 
              className="flex-1 sm:flex-none px-4 py-2 data-[state=active]:shadow-md transition-all"
              value="tasks"
            >
              Recent Tasks
            </TabsTrigger>
            <TabsTrigger 
              className="flex-1 sm:flex-none px-4 py-2 data-[state=active]:shadow-md transition-all"
              value="members"
            >
              Recent Members
            </TabsTrigger>
          </TabsList>
          <div className="bg-white p-4 rounded-b-xl">
            <TabsContent value="projects" className="mt-0">
              <RecentProjects />
            </TabsContent>
            <TabsContent value="tasks" className="mt-0">
              <RecentTasks />
            </TabsContent>
            <TabsContent value="members" className="mt-0">
              <RecentMembers />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  );
};

export default WorkspaceDashboard;
