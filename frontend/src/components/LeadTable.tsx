import React from 'react';
import { format } from 'date-fns';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface LeadTableProps {
  leads: any[];
  isLoading: boolean;
  onEdit: (lead: any) => void;
  onDelete: (id: string) => void;
  canEditDelete: (lead: any) => boolean;
}

const LeadTable: React.FC<LeadTableProps> = ({ leads, isLoading, onEdit, onDelete, canEditDelete }) => {
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400">
        <p className="text-lg font-medium">No leads found</p>
        <p className="text-sm">Try adjusting your filters or search term.</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Qualified': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Lost': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-transparent overflow-hidden transition-colors w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50">
              <th className="px-6 py-4 font-semibold text-sm text-gray-700 dark:text-gray-200 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 font-semibold text-sm text-gray-700 dark:text-gray-200 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 font-semibold text-sm text-gray-700 dark:text-gray-200 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 font-semibold text-sm text-gray-700 dark:text-gray-200 uppercase tracking-wider">Source</th>
              <th className="px-6 py-4 font-semibold text-sm text-gray-700 dark:text-gray-200 uppercase tracking-wider">Created At</th>
              <th className="px-6 py-4 font-semibold text-sm text-gray-700 dark:text-gray-200 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/50 dark:divide-gray-800/50">
            {leads.map((lead, index) => (
              <motion.tr 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                key={lead._id} 
                className="hover:bg-white/60 dark:hover:bg-gray-800/60 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{lead.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{lead.email}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{lead.source}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {format(new Date(lead.createdAt), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <Link 
                    to={`/leads/${lead._id}`}
                    className="p-1.5 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors rounded-md hover:bg-primary/10"
                    title="View Details"
                  >
                    <Eye size={18} />
                  </Link>
                  {canEditDelete(lead) && (
                    <>
                      <button 
                        onClick={() => onEdit(lead)}
                        className="p-1.5 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors rounded-md hover:bg-blue-500/10"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete(lead._id)}
                        className="p-1.5 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors rounded-md hover:bg-red-500/10"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadTable;
