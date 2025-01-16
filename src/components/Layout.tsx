import { motion } from "framer-motion";
import { Link, Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-sidebar border-b border-sidebar-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link
                to="/"
                className={`text-sidebar-foreground hover:text-sidebar-primary transition-colors ${
                  location.pathname === "/" ? "font-bold" : ""
                }`}
              >
                Главная
              </Link>
              <Link
                to="/games"
                className={`text-sidebar-foreground hover:text-sidebar-primary transition-colors ${
                  location.pathname.startsWith("/games") ? "font-bold" : ""
                }`}
              >
                Игры
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <Outlet />
      </motion.main>
    </div>
  );
};

export default Layout;