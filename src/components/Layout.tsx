import { FC, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-github-accent sticky top-0 z-50 bg-github-dark/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-white">
                  <span className="text-github-green">Code</span>mentorX
                </div>
              </Link>
            </div>
            <nav className="flex items-center space-x-4">
              <Link to="/" className="text-github-light/70 hover:text-white">Home</Link>
              <Link to="/problems" className="text-github-light/70 hover:text-white">Problems</Link>
              <Link to="/playground" className="text-github-light/70 hover:text-white">Code Playground</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button className="bg-github-green hover:bg-github-green-hover text-white">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="border-t border-github-accent mt-10 py-8 bg-github-dark">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">CodementorX</h3>
              <p className="text-sm text-gray-400">
                Master coding with AI as your guide, whether you're learning DSA or preparing for competitive programming.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-sm text-gray-400 hover:text-github-green transition-colors">Algorithm Teller</Link></li>
                <li><Link to="#" className="text-sm text-gray-400 hover:text-github-green transition-colors">Debugger</Link></li>
                <li><Link to="#" className="text-sm text-gray-400 hover:text-github-green transition-colors">Complexity Analyzer</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-sm text-gray-400 hover:text-github-green transition-colors">DSA Roadmap</Link></li>
                <li><Link to="#" className="text-sm text-gray-400 hover:text-github-green transition-colors">CP Roadmap</Link></li>
                <li><Link to="#" className="text-sm text-gray-400 hover:text-github-green transition-colors">FAQs</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-sm text-gray-400 hover:text-github-green transition-colors">About Us</Link></li>
                <li><Link to="#" className="text-sm text-gray-400 hover:text-github-green transition-colors">Contact</Link></li>
                <li><Link to="#" className="text-sm text-gray-400 hover:text-github-green transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-github-accent text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} CodementorX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface NavLinkProps {
  to: string;
  current: boolean;
  children: ReactNode;
}

const NavLink: FC<NavLinkProps> = ({ to, current, children }) => {
  return (
    <Link
      to={to}
      className={`px-1 py-2 text-sm font-medium transition-colors relative ${
        current 
          ? "text-github-green" 
          : "text-github-light hover:text-github-green"
      }`}
    >
      {children}
      {current && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-github-green rounded-full" />
      )}
    </Link>
  );
};

export default Layout;
