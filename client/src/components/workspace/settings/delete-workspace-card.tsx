import { ConfirmDialog } from "@/components/resuable/confirm-dialog";
import PermissionsGuard from "@/components/resuable/permission-guard";
import { Button } from "@/components/ui/button";
import { Permissions } from "@/constant";
import { useAuthContext } from "@/context/auth-provider";
import useConfirmDialog from "@/hooks/use-confirm-dialog";
import { toast } from "@/hooks/use-toast";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { deleteWorkspaceMutationFn } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const DeleteWorkspaceCard = () => {
  const { workspace } = useAuthContext();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  const { open, onOpenDialog, onCloseDialog } = useConfirmDialog();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteWorkspaceMutationFn,
  });

  const handleConfirm = () => {
    mutate(workspaceId, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ["userWorkspaces"],
        });
        navigate(`/workspace/${data.currentWorkspace}`);
        setTimeout(() => onCloseDialog(), 100);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };
  return (
    <>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            Delete Workspace
          </h1>
        </div>

        <PermissionsGuard
          showMessage
          requiredPermission={Permissions.DELETE_WORKSPACE}
        >
          <div className="space-y-6">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                Deleting a workspace is a permanent action and cannot be undone. Once
                you delete a workspace, all its associated data, including projects,
                tasks, and member roles, will be permanently removed. Please proceed
                with caution and ensure this action is intentional.
              </p>
            </div>
            <div className="flex justify-end">
              <Button
                variant="destructive"
                onClick={onOpenDialog}
                className="h-10 px-6 text-sm font-medium transition-colors"
              >
                Delete Workspace
              </Button>
            </div>
          </div>
        </PermissionsGuard>
      </div>

      <ConfirmDialog
        isOpen={open}
        isLoading={isPending}
        onClose={onCloseDialog}
        onConfirm={handleConfirm}
        title={`Delete ${workspace?.name} Workspace`}
        description="Are you sure you want to delete? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

export default DeleteWorkspaceCard;
