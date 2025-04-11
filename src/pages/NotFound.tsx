
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <div className="space-y-4">
          <div>
            <a href="/" className="text-blue-500 hover:text-blue-700 underline">
              Return to Home
            </a>
          </div>
          <div>
            <Button asChild variant="outline">
              <a href="/contrato/src/utils/db_test.php" target="_blank" rel="noopener noreferrer">
                Database Test Page
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
