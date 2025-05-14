import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { fetchEmployees, removeEmployee } from '../store/employeeSlice';
import getIcon from '../utils/iconUtils';
import EmployeeForm from '../components/EmployeeForm';
import { format } from 'date-fns';

const EmployeeList = () => {
  const dispatch = useDispatch();
  const { employees, loading, error, totalCount } = useSelector(state => state.employees);
  
  // UI state
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [sortField, setSortField] = useState('lastName');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(10);
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  // Icons
  const PlusIcon = getIcon('Plus');
  const SearchIcon = getIcon('Search');
  const FilterIcon = getIcon('Filter');
  const SortAscIcon = getIcon('ArrowUp');
  const SortDescIcon = getIcon('ArrowDown');
  const EditIcon = getIcon('Edit2');
  const TrashIcon = getIcon('Trash2');
  const ExternalLinkIcon = getIcon('ExternalLink');
  
  // Fetch employees with current filters
  useEffect(() => {
    const fetchData = () => {
      const offset = (currentPage - 1) * employeesPerPage;
      dispatch(fetchEmployees({
        limit: employeesPerPage,
        offset,
        search: searchTerm,
        department: selectedDepartment,
        sortField,
        sortOrder
      }));
    };
    
    // Debounce search
    const handler = setTimeout(fetchData, 300);
    return () => clearTimeout(handler);
  }, [dispatch, currentPage, employeesPerPage, searchTerm, selectedDepartment, sortField, sortOrder]);
  
  // Get unique departments for filter
  const departments = Array.from(new Set(employees.map(emp => emp.department))).filter(Boolean);
  
  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortField(field);
      setSortOrder('ASC');
    }
  };
  
  // Handle delete employee
  const handleDelete = async (id) => {
    try {
      await dispatch(removeEmployee(id)).unwrap();
      toast.success('Employee deleted successfully');
      setConfirmDelete(null);
    } catch (error) {
      toast.error(`Failed to delete employee: ${error}`);
    }
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(totalCount / employeesPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Employee Directory</h1>
          <p className="text-surface-600 dark:text-surface-400">Manage your team members</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary inline-flex"
        >
          <PlusIcon className="mr-1.5 h-4 w-4" /> 
          Add Employee
        </button>
      </div>
      
      {/* Search and Filter */}
      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-4 w-4 text-surface-500" />
              </div>
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="w-full md:w-64">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FilterIcon className="h-4 w-4 text-surface-500" />
              </div>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="input-field pl-10"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Employee Table */}
      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 overflow-hidden">
        {loading && !employees.length ? (
          <div className="p-8 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-3"
            >
              <svg className="w-8 h-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </motion.div>
            <p className="text-surface-600 dark:text-surface-400">Loading employees...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 dark:text-red-400">
            Error loading employees: {error}
          </div>
        ) : employees.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-surface-600 dark:text-surface-400 mb-4">No employees found with the current filters.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedDepartment('');
              }}
              className="btn btn-outline"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-surface-200 dark:divide-surface-700">
              <thead className="bg-surface-50 dark:bg-surface-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700" onClick={() => handleSort('lastName')}>
                    <div className="flex items-center">
                      Name
                      {sortField === 'lastName' && (
                        <span className="ml-1">
                          {sortOrder === 'ASC' ? <SortAscIcon className="h-4 w-4" /> : <SortDescIcon className="h-4 w-4" />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Position</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700" onClick={() => handleSort('department')}>
                    <div className="flex items-center">
                      Department
                      {sortField === 'department' && (
                        <span className="ml-1">
                          {sortOrder === 'ASC' ? <SortAscIcon className="h-4 w-4" /> : <SortDescIcon className="h-4 w-4" />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700" onClick={() => handleSort('startDate')}>
                    <div className="flex items-center">
                      Start Date
                      {sortField === 'startDate' && (
                        <span className="ml-1">
                          {sortOrder === 'ASC' ? <SortAscIcon className="h-4 w-4" /> : <SortDescIcon className="h-4 w-4" />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
                {employees.map(employee => (
                  <tr key={employee.Id} className="hover:bg-surface-50 dark:hover:bg-surface-700/50">
                    <td className="px-4 py-3 text-sm font-medium text-surface-900 dark:text-white">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center overflow-hidden mr-3">
                          {employee.photo ? (
                            <img src={employee.photo} alt={`${employee.firstName} ${employee.lastName}`} className="h-8 w-8 object-cover" />
                          ) : (
                            <span className="text-xs font-medium">{employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}</span>
                          )}
                        </div>
                        {employee.firstName} {employee.lastName}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-surface-700 dark:text-surface-300">{employee.position}</td>
                    <td className="px-4 py-3 text-sm text-surface-700 dark:text-surface-300">{employee.department}</td>
                    <td className="px-4 py-3 text-sm text-surface-700 dark:text-surface-300">
                      {employee.startDate ? format(new Date(employee.startDate), 'MMM d, yyyy') : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-right space-x-2 whitespace-nowrap">
                      <Link to={`/employees/${employee.Id}`} className="inline-flex items-center px-2.5 py-1.5 border border-surface-300 dark:border-surface-600 text-xs font-medium rounded text-surface-700 dark:text-surface-300 bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700">
                        <ExternalLinkIcon className="mr-1 h-3.5 w-3.5" />
                        View
                      </Link>
                      <button 
                        onClick={() => setConfirmDelete(employee.Id)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-red-300 dark:border-red-800 text-xs font-medium rounded text-red-700 dark:text-red-400 bg-white dark:bg-surface-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <TrashIcon className="mr-1 h-3.5 w-3.5" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-surface-200 dark:border-surface-700">
            <div className="text-sm text-surface-700 dark:text-surface-300">
              Showing {(currentPage - 1) * employeesPerPage + 1} to {Math.min(currentPage * employeesPerPage, totalCount)} of {totalCount} employees
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="btn btn-outline py-1 px-2 text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="btn btn-outline py-1 px-2 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Add Employee Modal */}
      {showAddModal && (
        <EmployeeForm 
          onClose={() => setShowAddModal(false)} 
          onSuccess={() => {
            setShowAddModal(false);
            dispatch(fetchEmployees({
              limit: employeesPerPage,
              offset: (currentPage - 1) * employeesPerPage,
              search: searchTerm,
              department: selectedDepartment,
              sortField,
              sortOrder
            }));
          }}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-surface-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-4">Confirm Deletion</h3>
            <p className="text-surface-700 dark:text-surface-300 mb-6">
              Are you sure you want to delete this employee? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setConfirmDelete(null)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(confirmDelete)}
                className="btn bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;