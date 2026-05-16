import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-20 border-b border-white/20 dark:border-white/10 bg-white/5 dark:bg-slate-900/20 flex items-center justify-between px-8 transition-colors duration-200 z-10 backdrop-blur-md">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white drop-shadow-sm">Dashboard</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-2xl bg-white/20 dark:bg-slate-800/40 border border-white/40 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-slate-700/50 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.05)] relative overflow-hidden backdrop-blur-md"
          aria-label="Toggle theme"
        >
          <AnimatePresence mode="wait" initial={false}>
            {theme === 'dark' ? (
              <motion.div
                key="sun"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Sun size={20} />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Moon size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </header>
  );
};

export default Header;
