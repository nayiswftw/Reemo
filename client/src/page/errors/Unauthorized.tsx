import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Access Denied
        </h2>
        <p className="text-gray-600 mb-8 max-w-md">
          Sorry, you don't have permission to access this page. Please contact your
          administrator if you think this is a mistake.
        </p>
        <div className="space-x-4">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="hover:bg-gray-100"
          >
            Go Back
          </Button>
          <Button
            onClick={() => navigate("/")}
            variant="default"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
