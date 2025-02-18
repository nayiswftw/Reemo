import { Separator } from "@/components/ui/separator";
import InviteMember from "@/components/workspace/member/invite-member";
import AllMembers from "@/components/workspace/member/all-members";
import WorkspaceHeader from "@/components/workspace/common/workspace-header";

export default function Members() {
  return (
    <div className="w-full min-h-screen bg-background">
      <WorkspaceHeader />
      <Separator className="my-4" />
      <main className="px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl mx-auto pt-6 pb-12">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Workspace members
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
              Workspace members can view and join all Workspace projects, tasks,
              and create new tasks in the Workspace.
            </p>
          </div>
          
          <div className="mt-8">
            <Separator className="mb-8" />
            
            <div className="space-y-8">
              <section className="bg-card rounded-lg p-6">
                <InviteMember />
              </section>
              
              <Separator className="!h-[0.5px]" />
              
              <section className="bg-card rounded-lg p-6">
                <AllMembers />
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
