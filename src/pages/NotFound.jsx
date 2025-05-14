import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const NotFound = () => {
  const navigate = useNavigate();
  const HomeIcon = getIcon('Home');
  const AlertTriangleIcon = getIcon('AlertTriangle');
  const ArrowLeftIcon = getIcon('ArrowLeft');

  // Auto redirect after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 10000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="p-6 md:p-8 bg-white dark:bg-surface-800 rounded-2xl shadow-soft max-w-lg w-full border border-surface-200 dark:border-surface-700"
      >
        <div className="mb-6 w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
          <AlertTriangleIcon className="h-10 w-10 text-red-600 dark:text-red-400" />
        </div>
        
        <h1 className="text-4xl font-bold text-surface-900 dark:text-white mb-2">404</h1>
        <h2 className="text-xl font-semibold text-surface-800 dark:text-surface-100 mb-4">Page Not Found</h2>
        
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
          You'll be redirected to the home page in a few seconds.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/" className="w-full sm:w-auto btn btn-primary">
            <HomeIcon className="mr-2 h-4 w-4" />
            Go Home
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto btn btn-outline"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;