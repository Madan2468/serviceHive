import { useState, useEffect } from 'react';
import { Search, Download } from 'lucide-react';

interface FiltersProps {
  onFilterChange: (filters: any) => void;
  onExport: () => void;
}

const Filters = ({ onFilterChange, onExport }: FiltersProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');
  const [sort, setSort] = useState('latest');

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({ search: searchTerm, status, source, sort });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, status, source, sort]);

  return (
    <div className="bg-transparent mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between transition-colors p-2">
      <div className="flex-1 w-full relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-md text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:bg-white/80 dark:focus:bg-gray-800/80 outline-none transition-all shadow-sm"
        />
      </div>
      
      <div className="flex w-full sm:w-auto gap-3 flex-wrap">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2.5 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-md text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none hover:bg-white/60 dark:hover:bg-gray-800/60 transition-colors shadow-sm cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Lost">Lost</option>
        </select>
        
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="px-4 py-2.5 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-md text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none hover:bg-white/60 dark:hover:bg-gray-800/60 transition-colors shadow-sm cursor-pointer"
        >
          <option value="">All Sources</option>
          <option value="Website">Website</option>
          <option value="Instagram">Instagram</option>
          <option value="Referral">Referral</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2.5 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-md text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none hover:bg-white/60 dark:hover:bg-gray-800/60 transition-colors shadow-sm cursor-pointer"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>

        <button
          onClick={onExport}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/40 hover:bg-white/80 dark:bg-gray-800/40 dark:hover:bg-gray-700/80 backdrop-blur-md text-gray-800 dark:text-white rounded-2xl transition-all font-medium border border-gray-200/50 dark:border-gray-700/50 shadow-sm cursor-pointer hover:scale-105 active:scale-95"
        >
          <Download size={18} />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>
    </div>
  );
};

export default Filters;
