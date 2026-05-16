import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, Users, Target, Zap } from 'lucide-react';
import api from '../utils/api';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e'];

const Analytics = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Since we don't have a dedicated analytics endpoint, we'll derive it from leads
        const response = await api.get('/leads');
        const leads = response.data.leads;
        
        // Derive some stats
        const statusCounts = leads.reduce((acc: any, lead: any) => {
          acc[lead.status] = (acc[lead.status] || 0) + 1;
          return acc;
        }, {});

        const sourceCounts = leads.reduce((acc: any, lead: any) => {
          acc[lead.source] = (acc[lead.source] || 0) + 1;
          return acc;
        }, {});

        // Mock time-series data
        const timeData = [
          { name: 'Mon', count: 4 },
          { name: 'Tue', count: 7 },
          { name: 'Wed', count: 5 },
          { name: 'Thu', count: 12 },
          { name: 'Fri', count: 8 },
          { name: 'Sat', count: 15 },
          { name: 'Sun', count: 10 },
        ];

        setData({
          totalLeads: leads.length,
          statusData: Object.entries(statusCounts).map(([name, value]) => ({ name, value })),
          sourceData: Object.entries(sourceCounts).map(([name, value]) => ({ name, value })),
          timeData
        });
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Performance <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Analytics</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Real-time insights into your lead generation pipeline.</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Leads', value: data?.totalLeads, icon: Users, color: 'from-blue-500 to-blue-600' },
          { label: 'Growth Rate', value: '+12.5%', icon: TrendingUp, color: 'from-emerald-500 to-teal-600' },
          { label: 'Conv. Rate', value: '24%', icon: Target, color: 'from-purple-500 to-indigo-600' },
          { label: 'Avg. Response', value: '2.4h', icon: Zap, color: 'from-orange-500 to-amber-600' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            variants={itemVariants}
            className="relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" />
            <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/40 dark:border-white/10 p-6 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                <stat.icon size={24} />
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lead Activity Chart */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/40 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Lead Activity</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.timeData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb40" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(8px)'
                  }} 
                />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Status Distribution */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/40 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Status Distribution</h3>
          <div className="h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {data?.statusData.map((_entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(8px)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 flex-wrap mt-4">
            {data?.statusData.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-sm text-gray-600 dark:text-gray-400">{entry.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Source Analysis */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/40 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl lg:col-span-2"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Lead Sources</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.sourceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb40" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(8px)'
                  }} 
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Analytics;
