
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-github-dark">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold mb-6">
          <span className="text-github-green">404</span>
        </h1>
        <p className="text-xl text-github-light/80 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Button asChild className="bg-github-green hover:bg-github-green-hover text-white button-glow">
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
