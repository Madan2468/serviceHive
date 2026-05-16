import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Users, BarChart3, LogOut, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItemVariants = {
    hover: { x: 4, scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98 }
  };

  return (
    <div className="w-64 border-r border-white/20 dark:border-white/10 bg-white/5 dark:bg-slate-900/20 flex flex-col transition-colors duration-200">
      <div className="p-8">
        <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white drop-shadow-sm">
          Smart<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Leads</span>
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-3 mt-2">
        <NavLink
          to="/leads"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium ${
              isActive 
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 dark:text-blue-300 border border-white/30 dark:border-white/10 shadow-lg backdrop-blur-md' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-white/5'
            }`
          }
        >
          <motion.div variants={navItemVariants} whileHover="hover" whileTap="tap" className="flex items-center gap-3 w-full">
            <Users size={20} />
            <span className="font-medium">Leads</span>
          </motion.div>
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive 
                ? 'bg-primary/90 text-white shadow-md shadow-primary/20 backdrop-blur-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50 opacity-50 cursor-not-allowed'
            }`
          }
          onClick={(e) => e.preventDefault()}
        >
          <motion.div variants={navItemVariants} whileHover="hover" whileTap="tap" className="flex items-center gap-3 w-full">
            <BarChart3 size={20} />
            <span className="font-medium">Analytics</span>
          </motion.div>
        </NavLink>
      </nav>

      <div className="p-4 border-t border-gray-200/50 dark:border-gray-800/50">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold shadow-md shadow-primary/20">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.role}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 w-full text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
        >
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
