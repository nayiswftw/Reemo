import Logo from "@/components/logo";
import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useStore } from "@/store/store";

const GoogleOAuth = () => {
  const navigate = useNavigate();
  const [ params ] = useSearchParams();
  const { setAccessToken } = useStore();
  const accessToken = params.get("access_token");
  const currentWorkspace = params.get("current_workspace");

  React.useEffect(()=> {
    if (accessToken) {
      setAccessToken(accessToken);
      if (currentWorkspace){
        navigate(`/workspace/${currentWorkspace}`);
      } else {  
        navigate("/");
      }
    }
  }, [accessToken, currentWorkspace, navigate, setAccessToken]);
  
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 self-center text-lg font-semibold hover:opacity-90 transition-opacity"
        >
          <Logo />
          Reemo
        </Link>

        <Card className="w-full shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4">
              <svg
                className="h-12 w-12 text-destructive"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>

              <h1 className="text-2xl font-bold text-foreground">Authentication Failed</h1>
              <p className="text-muted-foreground text-center">
                We couldn't sign you in with Google. Please try again.
              </p>

              <Button
                onClick={() => navigate("/")}
                className="mt-4 w-full"
                variant="default"
              >
                Return to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GoogleOAuth;
