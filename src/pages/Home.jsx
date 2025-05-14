import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

const Home = () => {
  // Declare icons
  const UserPlusIcon = getIcon('UserPlus');
  const UsersIcon = getIcon('Users');
  const CalendarIcon = getIcon('Calendar');
  const BarChartIcon = getIcon('BarChart');
  
  const [stats, setStats] = useState({
    employees: 124,
    departments: 8,
    leave: 5,
    attendance: 95
  });

  const [featuredEmployee, setFeaturedEmployee] = useState(null);

  const handleEmployeeAdded = (employee) => {
    // Update stats to reflect new employee
    setStats(prev => ({
      ...prev,
      employees: prev.employees + 1
    }));
    
    // Set as featured employee
    setFeaturedEmployee(employee);
    
    // Show success toast
    toast.success(`${employee.firstName} ${employee.lastName} has been added successfully!`);
  };

  return (
    <div className="space-y-8">
      <section>
        <motion.h1 
          className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to StaffSync
        </motion.h1>
        <p className="text-surface-600 dark:text-surface-300">
          Your centralized employee management system
        </p>
      </section>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <motion.div 
            className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">Employees</h3>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">{stats.employees}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-800/40 rounded-lg">
                <UsersIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 border border-green-200 dark:border-green-800"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">Departments</h3>
                <p className="text-2xl font-bold text-green-900 dark:text-green-200">{stats.departments}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-800/40 rounded-lg">
                <BarChartIcon className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300">Pending Leave</h3>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">{stats.leave}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-800/40 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="card bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20 border border-amber-200 dark:border-amber-800"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300">Attendance</h3>
                <p className="text-2xl font-bold text-amber-900 dark:text-amber-200">{stats.attendance}%</p>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-800/40 rounded-lg">
                <UserPlusIcon className="h-6 w-6 text-amber-600 dark:text-amber-300" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section>
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-surface-900 dark:text-white mb-2">
            Add New Employee
          </h2>
          <p className="text-surface-600 dark:text-surface-400">
            Create a new employee record in the system
          </p>
        </div>
        
        <MainFeature onEmployeeAdded={handleEmployeeAdded} />
      </section>

      {featuredEmployee && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-4">
            Recently Added Employee
          </h2>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-surface-100 dark:bg-surface-700/40 rounded-lg">
            <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 bg-surface-200 dark:bg-surface-700 rounded-full flex items-center justify-center overflow-hidden">
              {featuredEmployee.photo ? (
                <img 
                  src={featuredEmployee.photo} 
                  alt={`${featuredEmployee.firstName} ${featuredEmployee.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl text-surface-600 dark:text-surface-400">
                  {featuredEmployee.firstName.charAt(0)}{featuredEmployee.lastName.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-surface-900 dark:text-white">
                {featuredEmployee.firstName} {featuredEmployee.lastName}
              </h3>
              <p className="text-surface-600 dark:text-surface-300 mb-1">
                {featuredEmployee.position} • {featuredEmployee.department}
              </p>
              <div className="flex flex-wrap gap-y-1 gap-x-4 text-sm text-surface-700 dark:text-surface-400">
                <span><strong>Email:</strong> {featuredEmployee.email}</span>
                <span><strong>Phone:</strong> {featuredEmployee.phone}</span>
                <span><strong>Start Date:</strong> {featuredEmployee.startDate}</span>
              </div>
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default Home;