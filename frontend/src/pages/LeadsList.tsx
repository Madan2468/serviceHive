import { useState, useEffect, useCallback } from 'react';
import { Plus, TrendingUp, Users, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import Filters from '../components/Filters';
import LeadTable from '../components/LeadTable';
import LeadFormModal from '../components/LeadFormModal';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const LeadsList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: '', source: '', sort: 'latest' });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  
  const { user } = useAuth();

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const { search, status, source, sort } = filters;
      const res = await api.get('/leads', {
        params: {
          page: pagination.page,
          limit: 10,
          search,
          status,
          source,
          sort
        }
      });
      setLeads(res.data.leads);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error('Failed to fetch leads', error);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleExport = async () => {
    try {
      const { search, status, source, sort } = filters;
      const res = await api.get('/leads/export/csv', {
        responseType: 'blob',
        params: { search, status, source, sort }
      });
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'leads.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to export leads', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await api.delete(`/leads/${id}`);
        fetchLeads();
      } catch (error) {
        console.error('Failed to delete lead', error);
        alert('Failed to delete lead. You might not have permission.');
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingLead) {
        await api.put(`/leads/${(editingLead as any)._id}`, data);
      } else {
        await api.post('/leads', data);
      }
      setIsModalOpen(false);
      fetchLeads();
    } catch (error) {
      console.error('Failed to save lead', error);
      throw error;
    }
  };

  const openEditModal = (lead: any) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingLead(null);
    setIsModalOpen(true);
  };

  const canEditDelete = (lead: any) => {
    if (user?.role === 'Admin') return true;
    if (lead.createdBy?._id === user?._id) return true;
    return false;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
            Leads Intelligence
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your pipeline and track conversion metrics in real-time.
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-blue-500 text-white rounded-xl shadow-lg shadow-primary/30 transition-all font-medium border border-white/10"
        >
          <Plus size={20} />
          <span>Add New Lead</span>
        </motion.button>
      </motion.div>

      {/* Stats Hero Banner */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 dark:bg-slate-800/20 backdrop-blur-[20px] rounded-3xl p-6 border border-white/40 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] relative overflow-hidden group transition-all duration-300 hover:shadow-[0_8px_32px_rgba(59,130,246,0.15)]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 rounded-full blur-[40px] -mr-20 -mt-20 transition-transform duration-500 group-hover:scale-150 group-hover:bg-blue-400/30"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Total Leads</p>
              <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-2 drop-shadow-md">{pagination.total || 0}</h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
              <Users size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white/10 dark:bg-slate-800/20 backdrop-blur-[20px] rounded-3xl p-6 border border-white/40 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] relative overflow-hidden group transition-all duration-300 hover:shadow-[0_8px_32px_rgba(16,185,129,0.15)]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/20 rounded-full blur-[40px] -mr-20 -mt-20 transition-transform duration-500 group-hover:scale-150 group-hover:bg-emerald-400/30"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Conversion Rate</p>
              <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-2 drop-shadow-md">14.2%</h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white/10 dark:bg-slate-800/20 backdrop-blur-[20px] rounded-3xl p-6 border border-white/40 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] relative overflow-hidden group transition-all duration-300 hover:shadow-[0_8px_32px_rgba(168,85,247,0.15)]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/20 rounded-full blur-[40px] -mr-20 -mt-20 transition-transform duration-500 group-hover:scale-150 group-hover:bg-purple-400/30"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Active Pipeline</p>
              <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-2 drop-shadow-md">
                {leads.filter((l: any) => l.status === 'Contacted' || l.status === 'New').length || 0}
              </h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
              <Activity size={28} />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-800/50 shadow-xl overflow-hidden p-1">

      <Filters onFilterChange={handleFilterChange} onExport={handleExport} />

      <LeadTable 
        leads={leads} 
        isLoading={loading} 
        onEdit={openEditModal} 
        onDelete={handleDelete}
        canEditDelete={canEditDelete}
      />
      </motion.div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <motion.div variants={itemVariants} className="flex items-center justify-between bg-white/40 dark:bg-gray-800/40 backdrop-blur-md px-4 py-3 border border-gray-100/50 dark:border-gray-700/50 rounded-xl shadow-lg mt-4">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing page <span className="font-medium">{pagination.page}</span> of{' '}
                <span className="font-medium">{pagination.pages}</span> (Total {pagination.total} records)
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">Previous</span>
                  &larr;
                </button>
                {[...Array(pagination.pages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      pagination.page === i + 1 
                        ? 'z-10 bg-primary text-white focus-visible:outline-primary' 
                        : 'text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">Next</span>
                  &rarr;
                </button>
              </nav>
            </div>
          </div>
        </motion.div>
      )}

      <LeadFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingLead}
      />
    </motion.div>
  );
};

export default LeadsList;
