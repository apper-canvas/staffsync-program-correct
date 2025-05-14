import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchEmployees } from '../store/employeeSlice';
import getIcon from '../utils/iconUtils';
import { format } from 'date-fns';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const { employees, totalCount, departmentStats, loading } = useSelector(state => state.employees);
  
  // Declare icons
  const UserPlusIcon = getIcon('UserPlus');
  const UsersIcon = getIcon('Users');
  const CalendarIcon = getIcon('Calendar');
  const BarChartIcon = getIcon('BarChart');

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  // Calculate department count
  const departmentCount = Object.keys(departmentStats).length;
  
  // Get recent employees (last 5 added)
  const recentEmployees = [...employees]
    .sort((a, b) => new Date(b.CreatedOn) - new Date(a.CreatedOn))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header and Welcome Section */}
      <section>
        <motion.h1 
          className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome, {user?.firstName || 'User'}
        </motion.h1>
        <p className="text-surface-600 dark:text-surface-300">
          Here's an overview of your employee management system
        </p>
      </section>

      {/* Statistics Cards */}
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
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">{totalCount}</p>
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
                <p className="text-2xl font-bold text-green-900 dark:text-green-200">{departmentCount}</p>
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
                <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300">New This Month</h3>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">
                  {employees.filter(e => {
                    const today = new Date();
                    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                    return new Date(e.CreatedOn) >= startOfMonth;
                  }).length}
                </p>
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
              <Link to="/employees" className="group">
                <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300 group-hover:underline">View All</h3>
                <p className="text-sm text-amber-700 dark:text-amber-400">Manage employees</p>
              </Link>
              <div className="p-3 bg-amber-100 dark:bg-amber-800/40 rounded-lg">
                <UserPlusIcon className="h-6 w-6 text-amber-600 dark:text-amber-300" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Department Breakdown */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-4">
              Department Breakdown
            </h2>
            {loading ? (
              <div className="text-center py-10">Loading department data...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Department</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Employees</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Percentage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                    {Object.entries(departmentStats).map(([dept, count]) => (
                      <tr key={dept} className="hover:bg-surface-50 dark:hover:bg-surface-800/50">
                        <td className="px-4 py-3 text-sm font-medium text-surface-900 dark:text-white">{dept}</td>
                        <td className="px-4 py-3 text-sm text-surface-700 dark:text-surface-300">{count}</td>
                        <td className="px-4 py-3 text-sm text-surface-700 dark:text-surface-300">
                          {((count / totalCount) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        
        {/* Recent Employees */}
        <div className="lg:col-span-1">
          <div className="card h-full">
            <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-4">
              Recent Employees
            </h2>
            {loading ? (
              <div className="text-center py-10">Loading recent employees...</div>
            ) : recentEmployees.length === 0 ? (
              <div className="text-center py-10 text-surface-600 dark:text-surface-400">
                No employees found. Add your first employee.
              </div>
            ) : (
              <ul className="space-y-3">
                {recentEmployees.map(employee => (
                  <li key={employee.Id} className="border-b border-surface-200 dark:border-surface-700 pb-3 last:border-b-0">
                    <Link to={`/employees/${employee.Id}`} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 p-2 -mx-2 rounded block">
                      <div className="font-medium text-surface-900 dark:text-white">{employee.firstName} {employee.lastName}</div>
                      <div className="text-sm text-surface-600 dark:text-surface-400">{employee.position} • {employee.department}</div>
                      <div className="text-xs text-surface-500 dark:text-surface-500 mt-1">
                        Added: {employee.CreatedOn ? format(new Date(employee.CreatedOn), 'MMM d, yyyy') : 'Unknown'}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;