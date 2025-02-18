import { ChevronDown, Loader } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/helper";
import { useAuthContext } from "@/context/auth-provider";
import useWorkspaceId from "@/hooks/use-workspace-id";
import useGetWorkspaceMembers from "@/hooks/api/use-get-workspace-members";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeWorkspaceMemberRoleMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Permissions } from "@/constant";
const AllMembers = () => {
  const { user, hasPermission } = useAuthContext();

  const canChangeMemberRole = hasPermission(Permissions.CHANGE_MEMBER_ROLE);

  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  const { data, isPending } = useGetWorkspaceMembers(workspaceId);
  const members = data?.members || [];
  const roles = data?.roles || [];

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: changeWorkspaceMemberRoleMutationFn,
  });

  const handleSelect = (roleId: string, memberId: string) => {
    if (!roleId || !memberId) return;
    const payload = {
      workspaceId,
      data: {
        roleId,
        memberId,
      },
    };
    mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["members", workspaceId],
        });
        toast({
          title: "Success",
          description: "Member's role changed successfully",
          variant: "success",
        });
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
    <div className="container mx-auto p-4">
      {isPending ? (
        <div className="flex justify-center py-8">
          <Loader className="w-8 h-8 animate-spin" />
        </div>
      ) : null}

      <div className="grid gap-6">
        {members?.map((member) => {
          const name = member.userId?.name;
          const initials = getAvatarFallbackText(name);
          const avatarColor = getAvatarColor(name);
          return (
            <div key={member.userId._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4 p-4 bg-card rounded-lg border shadow-sm">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage
                    src={member.userId?.profilePicture || ""}
                    alt={name}
                  />
                  <AvatarFallback className={`${avatarColor} text-sm`}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{name}</p>
                  <p className="text-sm text-muted-foreground break-all">
                    {member.userId.email}
                  </p>
                </div>
              </div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto min-w-[120px] capitalize disabled:opacity-95 disabled:pointer-events-none"
                    disabled={
                      isLoading ||
                      !canChangeMemberRole ||
                      member.userId._id === user?._id
                    }
                  >
                    {member.role.name?.toLowerCase()}
                    {canChangeMemberRole && member.userId._id !== user?._id && (
                      <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </PopoverTrigger>
                {canChangeMemberRole && (
                  <PopoverContent className="w-[300px] p-0" align="end">
                    <Command>
                      <CommandInput
                        placeholder="Select new role..."
                        disabled={isLoading}
                        className="disabled:pointer-events-none"
                      />
                      <CommandList>
                        {isLoading ? (
                          <div className="flex justify-center py-4">
                            <Loader className="w-6 h-6 animate-spin" />
                          </div>
                        ) : (
                          <>
                            <CommandEmpty>No roles found.</CommandEmpty>
                            <CommandGroup>
                              {roles?.map(
                                (role) =>
                                  role.name !== "OWNER" && (
                                    <CommandItem
                                      key={role._id}
                                      disabled={isLoading}
                                      className="disabled:pointer-events-none gap-2 py-3 px-4 cursor-pointer"
                                      onSelect={() => handleSelect(role._id, member.userId._id)}
                                    >
                                      <div>
                                        <p className="font-medium capitalize">
                                          {role.name?.toLowerCase()}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                          {role.name === "ADMIN"
                                            ? "Can view, create, edit tasks, project and manage settings"
                                            : role.name === "MEMBER"
                                            ? "Can view and edit only tasks created by them"
                                            : ""}
                                        </p>
                                      </div>
                                    </CommandItem>
                                  )
                              )}
                            </CommandGroup>
                          </>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                )}
              </Popover>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllMembers;
