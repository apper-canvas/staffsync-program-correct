import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchEmployeeById, clearCurrentEmployee, removeEmployee } from '../store/employeeSlice';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';
import { format } from 'date-fns';
import EmployeeForm from '../components/EmployeeForm';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentEmployee, loading, error } = useSelector(state => state.employees);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const UserIcon = getIcon('User');
  const MailIcon = getIcon('Mail');
  const PhoneIcon = getIcon('Phone');
  const BriefcaseIcon = getIcon('Briefcase');
  const CalendarIcon = getIcon('Calendar');
  const BuildingIcon = getIcon('Building');
  const ClockIcon = getIcon('Clock');
  const EditIcon = getIcon('Edit2');
  const TrashIcon = getIcon('Trash2');
  const ChevronLeftIcon = getIcon('ChevronLeft');
  
  useEffect(() => {
    dispatch(fetchEmployeeById(id));
    
    return () => {
      dispatch(clearCurrentEmployee());
    };
  }, [dispatch, id]);
  
  const handleDelete = async () => {
    try {
      await dispatch(removeEmployee(id)).unwrap();
      toast.success('Employee deleted successfully');
      navigate('/employees');
    } catch (error) {
      toast.error(`Failed to delete employee: ${error}`);
      setShowDeleteModal(false);
    }
  };
  
  if (loading && !currentEmployee) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="inline-block mr-3"
        >
          <svg className="w-8 h-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </motion.div>
        <p className="text-lg">Loading employee details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <Link to="/employees" className="btn btn-primary">
          Return to Employee List
        </Link>
      </div>
    );
  }
  
  if (!currentEmployee) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Employee Not Found</h2>
        <p className="mb-4">The employee you're looking for doesn't exist or has been removed.</p>
        <Link to="/employees" className="btn btn-primary">
          Return to Employee List
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <Link to="/employees" className="inline-flex items-center text-primary hover:underline">
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          Back to Employee List
        </Link>
      </div>
      
      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 overflow-hidden">
        {/* Header */}
        <div className="relative h-32 bg-gradient-to-r from-primary to-primary-light">
          <div className="absolute bottom-0 left-0 w-full px-6 transform translate-y-1/2 flex justify-between">
            <div className="flex items-end">
              <div className="h-24 w-24 rounded-full border-4 border-white dark:border-surface-800 bg-white dark:bg-surface-700 flex items-center justify-center overflow-hidden">
                {currentEmployee.photo ? (
                  <img src={currentEmployee.photo} alt={`${currentEmployee.firstName} ${currentEmployee.lastName}`} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-3xl font-medium text-surface-500">{currentEmployee.firstName?.charAt(0)}{currentEmployee.lastName?.charAt(0)}</span>
                )}
              </div>
              <div className="ml-4 mb-4">
                <h1 className="text-xl font-bold text-white drop-shadow-sm">{currentEmployee.firstName} {currentEmployee.lastName}</h1>
                <p className="text-white/90">{currentEmployee.position}</p>
              </div>
            </div>
            <div className="mb-4 flex space-x-2">
              <button 
                onClick={() => setShowEditModal(true)}
                className="btn bg-white text-primary hover:bg-surface-100 border-white shadow-sm"
              >
                <EditIcon className="h-4 w-4 mr-1.5" />
                Edit
              </button>
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="btn bg-white text-red-600 hover:bg-red-50 border-white shadow-sm"
              >
                <TrashIcon className="h-4 w-4 mr-1.5" />
                Delete
              </button>
            </div>
          </div>
        </div>
        
        {/* Details Content */}
        <div className="mt-16 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Personal Information</h2>
              
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-10 flex-shrink-0 flex items-center justify-center">
                    <MailIcon className="h-5 w-5 text-surface-500" />
                  </div>
                  <div>
                    <div className="text-sm text-surface-500 dark:text-surface-400">Email</div>
                    <div className="text-surface-900 dark:text-white">{currentEmployee.email}</div>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-10 flex-shrink-0 flex items-center justify-center">
                    <PhoneIcon className="h-5 w-5 text-surface-500" />
                  </div>
                  <div>
                    <div className="text-sm text-surface-500 dark:text-surface-400">Phone</div>
                    <div className="text-surface-900 dark:text-white">{currentEmployee.phone}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Employment Details</h2>
              
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-10 flex-shrink-0 flex items-center justify-center">
                    <BuildingIcon className="h-5 w-5 text-surface-500" />
                  </div>
                  <div>
                    <div className="text-sm text-surface-500 dark:text-surface-400">Department</div>
                    <div className="text-surface-900 dark:text-white">{currentEmployee.department}</div>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-10 flex-shrink-0 flex items-center justify-center">
                    <BriefcaseIcon className="h-5 w-5 text-surface-500" />
                  </div>
                  <div>
                    <div className="text-sm text-surface-500 dark:text-surface-400">Position</div>
                    <div className="text-surface-900 dark:text-white">{currentEmployee.position}</div>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-10 flex-shrink-0 flex items-center justify-center">
                    <CalendarIcon className="h-5 w-5 text-surface-500" />
                  </div>
                  <div>
                    <div className="text-sm text-surface-500 dark:text-surface-400">Start Date</div>
                    <div className="text-surface-900 dark:text-white">
                      {currentEmployee.startDate ? format(new Date(currentEmployee.startDate), 'MMMM d, yyyy') : 'N/A'}
                    </div>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="w-10 flex-shrink-0 flex items-center justify-center">
                    <ClockIcon className="h-5 w-5 text-surface-500" />
                  </div>
                  <div>
                    <div className="text-sm text-surface-500 dark:text-surface-400">Employment Type</div>
                    <div className="text-surface-900 dark:text-white">{currentEmployee.employmentType}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit Modal */}
      {showEditModal && (
        <EmployeeForm 
          employee={currentEmployee}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            dispatch(fetchEmployeeById(id));
          }}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-surface-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-4">Confirm Deletion</h3>
            <p className="text-surface-700 dark:text-surface-300 mb-6">
              Are you sure you want to delete {currentEmployee.firstName} {currentEmployee.lastName}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
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

export default EmployeeDetails;