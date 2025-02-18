import { Loader } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { BASE_ROUTE } from "@/routes/common/routePaths";
import useAuth from "@/hooks/api/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invitedUserJoinWorkspaceMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const InviteUser = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const param = useParams();
  const inviteCode = param.inviteCode as string;

  const { data: authData, isPending } = useAuth();
  const user = authData?.user;

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: invitedUserJoinWorkspaceMutationFn,
  });

  const returnUrl = encodeURIComponent(
    `${BASE_ROUTE.INVITE_URL.replace(":inviteCode", inviteCode)}`
  );

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    mutate(inviteCode, {
      onSuccess: (data) => {
        queryClient.resetQueries({
          queryKey: ["userWorkspaces"],
        });
        navigate(`/workspace/${data.workspaceId}`);
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
    <div className="flex min-h-svh items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex items-center justify-center">
            <Logo />
            <span className="ml-3 text-2xl font-bold text-gray-900">
              Reemo
            </span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Join Workspace
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            You've been invited to join a Reemo workspace!
          </p>
        </div>
        <Card className="shadow-md">
          <CardHeader className="text-center">
            <CardTitle className="text-lg font-medium">
              Confirm Your Participation
            </CardTitle>
            <CardDescription>
              {user
                ? "You're logged in. Click below to join the workspace."
                : "Please log in or sign up to join this workspace."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isPending ? (
              <div className="flex justify-center">
                <Loader className="!w-10 !h-10 animate-spin" />
              </div>
            ) : (
              <div>
                {user ? (
                  <form onSubmit={handleSubmit}>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full justify-center !bg-green-600 hover:!bg-green-700 focus:!ring-green-500"
                    >
                      {isLoading && (
                        <Loader className="!w-5 !h-5 animate-spin mr-2" />
                      )}
                      Join Workspace
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <Link to={`/sign-up?returnUrl=${returnUrl}`}>
                      <Button className="w-full justify-center">
                        Sign Up
                      </Button>
                    </Link>
                    <Link to={`/?returnUrl=${returnUrl}`}>
                      <Button
                        variant="secondary"
                        className="w-full justify-center border border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Log In
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InviteUser;
