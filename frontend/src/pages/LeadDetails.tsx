import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Calendar, User as UserIcon, Tag, Globe, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import api from '../utils/api';

const LeadDetails = () => {
  const { id } = useParams();
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const res = await api.get(`/leads/${id}`);
        setLead(res.data);
      } catch (error) {
        console.error('Failed to fetch lead', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p className="text-xl font-medium">Lead not found</p>
        <Link to="/leads" className="text-primary mt-2 hover:underline">Back to Leads</Link>
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

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'Website': return <Globe size={18} />;
      case 'Instagram': return <Tag size={18} />;
      default: return <UserIcon size={18} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-4">
        <Link to="/leads" className="p-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lead Details</h1>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary text-3xl font-bold">
              {lead.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{lead.name}</h2>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-1">
                <Mail size={16} />
                <span>{lead.email}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 ${getStatusColor(lead.status)}`}>
              <CheckCircle size={16} />
              {lead.status}
            </span>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
              Information
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400">
                  {getSourceIcon(lead.source)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Source</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white mt-0.5">{lead.source}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white mt-0.5">
                    {format(new Date(lead.createdAt), 'MMMM dd, yyyy h:mm a')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white mt-0.5">
                    {format(new Date(lead.updatedAt), 'MMMM dd, yyyy h:mm a')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">
              Management
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400">
                  <UserIcon size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Created By</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white mt-0.5">
                    {lead.createdBy?.name || 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-500">{lead.createdBy?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
