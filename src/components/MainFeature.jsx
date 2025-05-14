import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

const MainFeature = ({ onEmployeeAdded }) => {
  // Declare all icon components at the top
  const SaveIcon = getIcon('Save');
  const XIcon = getIcon('X');
  const PlusIcon = getIcon('Plus');
  const UserIcon = getIcon('User');
  const BuildingIcon = getIcon('Building');
  const BriefcaseIcon = getIcon('Briefcase');
  const CalendarIcon = getIcon('Calendar');
  const MailIcon = getIcon('Mail');
  const PhoneIcon = getIcon('Phone');
  const ImageIcon = getIcon('Image');
  const CheckIcon = getIcon('Check');
  const InfoIcon = getIcon('Info');
  
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
  
  // Validation state
  const [errors, setErrors] = useState({});
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [step, setStep] = useState(1);
  
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
  
  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    if (stepNumber === 1) {
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
    } else if (stepNumber === 2) {
      if (!formData.department) newErrors.department = "Department is required";
      if (!formData.position) newErrors.position = "Position is required";
      if (!formData.startDate) newErrors.startDate = "Start date is required";
      if (!formData.employmentType) newErrors.employmentType = "Employment type is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    } else {
      toast.error("Please fix the errors before continuing");
    }
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(step)) {
      toast.error("Please fix the errors before submitting");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, we'd submit to an actual API
      // For now, we'll just call the callback to update UI
      onEmployeeAdded({...formData});
      
      // Reset form
      setFormData({
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
      setPreviewImage(null);
      setStep(1);
      
    } catch (error) {
      toast.error("Failed to add employee. Please try again.");
      console.error("Error adding employee:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card overflow-hidden border border-surface-200 dark:border-surface-700">
      {/* Form Header */}
      <div className="relative h-12 bg-gradient-to-r from-primary to-accent flex items-center justify-center">
        <h3 className="text-white font-medium">New Employee Registration</h3>
        <div className="absolute inset-y-0 right-0 px-4 flex items-center">
          <span className="text-xs font-medium text-white/80">Step {step} of 3</span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="h-1.5 bg-surface-200 dark:bg-surface-700">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: `${(step - 1) * 33.33}%` }}
          animate={{ width: `${step * 33.33}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h4 className="text-lg font-medium text-surface-900 dark:text-white flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-primary" />
                <span>Personal Information</span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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
              </div>
            </motion.div>
          )}
          
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h4 className="text-lg font-medium text-surface-900 dark:text-white flex items-center gap-2">
                <BuildingIcon className="h-5 w-5 text-primary" />
                <span>Employment Details</span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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
              </div>
            </motion.div>
          )}
          
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h4 className="text-lg font-medium text-surface-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                <span>Profile Photo</span>
              </h4>
              
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 w-full">
                  <div className="flex justify-center">
                    <div className="w-32 h-32 rounded-full border-2 border-dashed border-surface-300 dark:border-surface-600 flex flex-col items-center justify-center overflow-hidden bg-surface-100 dark:bg-surface-700">
                      {previewImage ? (
                        <img src={previewImage} alt="Profile preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-4">
                          <ImageIcon className="mx-auto h-8 w-8 text-surface-500" />
                          <p className="mt-1 text-xs text-surface-500">No photo selected</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-center">
                    <label htmlFor="photo" className="btn btn-outline">
                      <PlusIcon className="mr-1 h-4 w-4" />
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
                  </div>
                </div>
                
                <div className="flex-1 w-full">
                  <div className="bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 rounded-lg p-4">
                    <h5 className="flex items-center gap-1.5 text-surface-900 dark:text-white font-medium mb-2">
                      <InfoIcon className="h-4 w-4 text-primary" />
                      Employee Summary
                    </h5>
                    
                    <dl className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center">
                        <dt className="w-1/3 text-surface-500 dark:text-surface-400">Name:</dt>
                        <dd className="w-2/3 font-medium text-surface-900 dark:text-white">
                          {formData.firstName} {formData.lastName}
                        </dd>
                      </div>
                      <div className="flex items-center">
                        <dt className="w-1/3 text-surface-500 dark:text-surface-400">Email:</dt>
                        <dd className="w-2/3 text-surface-900 dark:text-white">{formData.email}</dd>
                      </div>
                      <div className="flex items-center">
                        <dt className="w-1/3 text-surface-500 dark:text-surface-400">Phone:</dt>
                        <dd className="w-2/3 text-surface-900 dark:text-white">{formData.phone}</dd>
                      </div>
                      <div className="flex items-center">
                        <dt className="w-1/3 text-surface-500 dark:text-surface-400">Department:</dt>
                        <dd className="w-2/3 text-surface-900 dark:text-white">{formData.department}</dd>
                      </div>
                      <div className="flex items-center">
                        <dt className="w-1/3 text-surface-500 dark:text-surface-400">Position:</dt>
                        <dd className="w-2/3 text-surface-900 dark:text-white">{formData.position}</dd>
                      </div>
                      <div className="flex items-center">
                        <dt className="w-1/3 text-surface-500 dark:text-surface-400">Start Date:</dt>
                        <dd className="w-2/3 text-surface-900 dark:text-white">{formData.startDate}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-between">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="btn btn-outline"
              >
                Back
              </button>
            )}
          </div>
          <div className="flex mb-4 sm:mb-0">
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="w-full sm:w-auto btn btn-primary"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto btn btn-primary"
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
                    Add Employee
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default MainFeature;