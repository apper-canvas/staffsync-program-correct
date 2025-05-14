import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { addEmployee, modifyEmployee } from '../store/employeeSlice';
import getIcon from '../utils/iconUtils';

const EmployeeForm = ({ employee, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const isEditing = !!employee;
  
  // Icons
  const SaveIcon = getIcon('Save');
  const XIcon = getIcon('X');
  const UserIcon = getIcon('User');
  const BuildingIcon = getIcon('Building');
  const BriefcaseIcon = getIcon('Briefcase');
  const CalendarIcon = getIcon('Calendar');
  const MailIcon = getIcon('Mail');
  const PhoneIcon = getIcon('Phone');
  const ImageIcon = getIcon('Image');
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    startDate: '',
    employmentType: 'Full-time',
    photo: ''
  });
  
  // If editing, populate form with employee data
  useEffect(() => {
    if (employee) {
      setFormData({
        Id: employee.Id, // Important for update operations
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        email: employee.email || '',
        phone: employee.phone || '',
        department: employee.department || '',
        position: employee.position || '',
        startDate: employee.startDate || '',
        employmentType: employee.employmentType || 'Full-time',
        photo: employee.photo || ''
      });
      
      if (employee.photo) {
        setPreviewImage(employee.photo);
      }
    }
  }, [employee]);
  
  // Validation state
  const [errors, setErrors] = useState({});
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
  const departments = [
    'Engineering', 'Marketing', 'Finance', 'Human Resources',
    'Operations', 'Product', 'Sales', 'Customer Support'
  ];
  
  const positions = {
    'Engineering': ['Software Engineer', 'QA Engineer', 'DevOps Engineer', 'Engineering Manager'],
    'Marketing': ['Marketing Specialist', 'Content Writer', 'SEO Specialist', 'Marketing Manager'],
    'Finance': ['Accountant', 'Financial Analyst', 'Payroll Specialist', 'Finance Manager'],
    'Human Resources': ['HR Coordinator', 'Recruiter', 'HR Specialist', 'HR Manager'],
    'Operations': ['Operations Coordinator', 'Logistics Specialist', 'Operations Analyst', 'Operations Manager'],
    'Product': ['Product Manager', 'UX Designer', 'Product Analyst', 'Product Director'],
    'Sales': ['Sales Representative', 'Account Executive', 'Sales Coordinator', 'Sales Manager'],
    'Customer Support': ['Support Agent', 'Technical Support', 'Support Coordinator', 'Support Manager']
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Special handling for department to update position options
    if (name === 'department' && value) {
      setFormData((prev) => ({
        ...prev,
        position: ''  // Reset position when department changes
      }));
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For a real app, we'd upload this to a server
      // For this demo, we'll just create a data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData((prev) => ({
          ...prev,
          photo: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Phone number should be 10 digits";
    }
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.position) newErrors.position = "Position is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.employmentType) newErrors.employmentType = "Employment type is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let result;
      
      if (isEditing) {
        // Update existing employee
        result = await dispatch(modifyEmployee(formData)).unwrap();
        toast.success(`${formData.firstName} ${formData.lastName} has been updated successfully`);
      } else {
        // Create new employee
        result = await dispatch(addEmployee(formData)).unwrap();
        toast.success(`${formData.firstName} ${formData.lastName} has been added successfully`);
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
    } catch (error) {
      toast.error(`Failed to ${isEditing ? 'update' : 'add'} employee: ${error.message || 'An error occurred'}`);
      console.error(`Error ${isEditing ? 'updating' : 'adding'} employee:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-surface-900/75" onClick={onClose}></div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block w-full max-w-2xl p-6 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-surface-800 shadow-xl rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-surface-900 dark:text-white">
              {isEditing ? 'Edit Employee' : 'Add New Employee'}
            </h3>
            <button
              onClick={onClose}
              className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-white"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Personal Information */}
              <div className="md:col-span-2">
                <h4 className="text-lg font-medium text-surface-900 dark:text-white flex items-center gap-2 mb-3">
                  <UserIcon className="h-5 w-5 text-primary" />
                  <span>Personal Information</span>
                </h4>
              </div>
              
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  First Name*
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`input-field ${errors.firstName ? 'border-red-500 dark:border-red-700' : ''}`}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.firstName}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Last Name*
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`input-field ${errors.lastName ? 'border-red-500 dark:border-red-700' : ''}`}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.lastName}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Email Address*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon className="h-4 w-4 text-surface-500" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.email ? 'border-red-500 dark:border-red-700' : ''}`}
                    placeholder="name@company.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Phone Number*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhoneIcon className="h-4 w-4 text-surface-500" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.phone ? 'border-red-500 dark:border-red-700' : ''}`}
                    placeholder="(555) 123-4567"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
                )}
              </div>
              
              {/* Employment Details */}
              <div className="md:col-span-2 mt-4">
                <h4 className="text-lg font-medium text-surface-900 dark:text-white flex items-center gap-2 mb-3">
                  <BuildingIcon className="h-5 w-5 text-primary" />
                  <span>Employment Details</span>
                </h4>
              </div>
              
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Department*
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={`input-field ${errors.department ? 'border-red-500 dark:border-red-700' : ''}`}
                >
                  <option value="">Select department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.department && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.department}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Position*
                </label>
                <select
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className={`input-field ${errors.position ? 'border-red-500 dark:border-red-700' : ''}`}
                  disabled={!formData.department}
                >
                  <option value="">Select position</option>
                  {formData.department && 
                    positions[formData.department]?.map((pos) => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))
                  }
                </select>
                {errors.position && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.position}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Start Date*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-4 w-4 text-surface-500" />
                  </div>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.startDate ? 'border-red-500 dark:border-red-700' : ''}`}
                  />
                </div>
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.startDate}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="employmentType" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Employment Type*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BriefcaseIcon className="h-4 w-4 text-surface-500" />
                  </div>
                  <select
                    id="employmentType"
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.employmentType ? 'border-red-500 dark:border-red-700' : ''}`}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                {errors.employmentType && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.employmentType}</p>
                )}
              </div>
              
              {/* Profile Photo */}
              <div className="md:col-span-2 mt-4">
                <h4 className="text-lg font-medium text-surface-900 dark:text-white flex items-center gap-2 mb-3">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  <span>Profile Photo</span>
                </h4>
                
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-surface-300 dark:border-surface-600 flex flex-col items-center justify-center overflow-hidden bg-surface-100 dark:bg-surface-700">
                      {previewImage ? (
                        <img src={previewImage} alt="Profile preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-4">
                          <ImageIcon className="mx-auto h-6 w-6 text-surface-500" />
                          <p className="mt-1 text-xs text-surface-500">No photo</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="photo" className="btn btn-outline">
                      {previewImage ? 'Change Photo' : 'Add Photo'}
                    </label>
                    <input
                      type="file"
                      id="photo"
                      name="photo"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
                      Recommended: Square image, 300x300 pixels or larger
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-surface-200 dark:border-surface-700 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </motion.span>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <SaveIcon className="mr-1.5 h-4 w-4" />
                    {isEditing ? 'Save Changes' : 'Add Employee'}
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;