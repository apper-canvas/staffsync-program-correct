import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Format a date string to a readable format
 * @param {string|Date} date - The date to format
 * @param {string} formatStr - Optional format string
 * @returns {string} Formatted date
 */
export const formatDate = (date, formatStr = 'MMM d, yyyy') => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Format a phone number to (XXX) XXX-XXXX format
 * @param {string} phone - The phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if we have a 10-digit number
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone; // Return as-is if not a standard 10-digit number
};