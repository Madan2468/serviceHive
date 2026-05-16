import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import { useTheme } from '../context/ThemeContext';

const DashboardLayout = () => {
  const { theme } = useTheme();

  return (
    <div className={`flex h-screen w-screen overflow-hidden transition-all duration-700 ${
      theme === 'dark' 
        ? "bg-slate-950 bg-[url('/dashboard-bg-dark.png')]" 
        : "bg-blue-50 bg-[url('/dashboard-bg.png')]"
    } bg-cover bg-center`}>
      
      <div className="relative flex items-center justify-center w-full h-full p-4 sm:p-6 lg:p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-row w-full max-w-[1600px] h-[90vh] sm:h-full bg-white/10 dark:bg-slate-900/40 backdrop-blur-[40px] border border-white/40 dark:border-white/10 rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] overflow-hidden"
        >
          <Sidebar />
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-transparent">
            <Header />
            <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-10 bg-transparent">
              <Outlet />
            </main>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardLayout;
