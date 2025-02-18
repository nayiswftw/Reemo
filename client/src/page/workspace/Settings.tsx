import { Separator } from "@/components/ui/separator";
import WorkspaceHeader from "@/components/workspace/common/workspace-header";
import EditWorkspaceForm from "@/components/workspace/edit-workspace-form";
import DeleteWorkspaceCard from "@/components/workspace/settings/delete-workspace-card";
import { Permissions } from "@/constant";
import withPermission from "@/hoc/with-permission";

const Settings = () => {
  return (
    <div className="w-full min-h-screen bg-background">
      <WorkspaceHeader />
      <Separator className="my-6" />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto py-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
            Workspace Settings
          </h2>

          <div className="space-y-8 bg-card rounded-lg shadow-sm">
            <div className="p-6">
              <EditWorkspaceForm />
            </div>
            <Separator />
            <div className="p-6">
              <DeleteWorkspaceCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const SettingsWithPermission = withPermission(
  Settings,
  Permissions.MANAGE_WORKSPACE_SETTINGS
);

export default SettingsWithPermission;
