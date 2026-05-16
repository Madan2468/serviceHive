import { useState } from 'react';
import { useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  role: z.enum(['Admin', 'Sales User']),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useReactHookForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'Sales User'
    }
  });
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setServerError('');
    try {
      const response = await api.post('/auth/register', data);
      login(response.data.token, response.data);
      navigate('/leads');
    } catch (error: any) {
      setServerError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-surface dark:bg-surface-dark transition-colors duration-200">
      
      {/* Right Image Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="hidden lg:block lg:w-1/2 relative bg-gray-900 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 to-purple-600/20 mix-blend-overlay z-10" />
        <img 
          src="/illustration.png" 
          alt="Abstract 3D Illustration" 
          className="absolute inset-0 w-full h-full object-cover transform scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent z-10" />
        
        <div className="absolute bottom-0 right-0 p-12 z-20 text-right">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-4xl font-bold text-white mb-4 leading-tight"
          >
            Join the smart way <br/> to track leads.
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-gray-300 text-lg max-w-md ml-auto"
          >
            Empower your sales team with AI-driven insights and a seamless workflow.
          </motion.p>
        </div>
      </motion.div>

      {/* Right Form Section */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24"
      >
        <div className="max-w-md w-full space-y-8">
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-4xl font-extrabold text-text dark:text-text-dark tracking-tight"
            >
              Create an account
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-2 text-sm text-text-muted dark:text-text-muted-dark"
            >
              Sign up to get started with Smart Leads.
            </motion.p>
          </div>
          
          {serverError && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium border border-red-100 dark:border-red-900/50"
            >
              {serverError}
            </motion.div>
          )}

          <motion.form 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 space-y-5" 
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <label className="block text-sm font-medium text-text dark:text-text-dark mb-1">Full Name</label>
              <input
                {...register('name')}
                className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white transition-all duration-200"
                placeholder="John Doe"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text dark:text-text-dark mb-1">Email address</label>
              <input
                {...register('email')}
                className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white transition-all duration-200"
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text dark:text-text-dark mb-1">Password</label>
              <input
                type="password"
                {...register('password')}
                className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white transition-all duration-200"
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text dark:text-text-dark mb-1">Role</label>
              <select
                {...register('role')}
                className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white transition-all duration-200 appearance-none"
              >
                <option value="Sales User">Sales User</option>
                <option value="Admin">Admin</option>
              </select>
              {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>}
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-primary hover:bg-primary-dark shadow-lg shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </motion.button>
            </div>
            
            <p className="mt-4 text-center text-sm text-text-muted dark:text-text-muted-dark">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary hover:text-primary-dark transition-colors">
                Sign in
              </Link>
            </p>
          </motion.form>
        </div>
      </motion.div>

    </div>
  );
};

export default Register;
