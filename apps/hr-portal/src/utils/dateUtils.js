// utils/dateUtils.js
/**
 * Utility functions for date manipulation and formatting
 */

import { format, differenceInDays, parseISO, addDays, isAfter, isBefore, isToday, formatDistance } from 'date-fns';

/**
 * Format a date to a readable string format
 * @param {Date|string} date - Date to format
 * @param {string} formatStr - Format string (defaults to 'MMM d, yyyy')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatStr = 'MMM d, yyyy') => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Calculate duration between two dates in days
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {number} Number of days
 */
export const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  
  try {
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
    return differenceInDays(end, start) + 1; // +1 to include both start and end days
  } catch (error) {
    console.error('Error calculating duration:', error);
    return 0;
  }
};

/**
 * Determine if a project is active (current date is between start and end)
 * @param {Date|string} startDate - Project start date
 * @param {Date|string} endDate - Project end date
 * @returns {boolean} Whether the project is active
 */
export const isProjectActive = (startDate, endDate) => {
  if (!startDate || !endDate) return false;
  
  try {
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
    const now = new Date();
    
    return !isBefore(now, start) && !isAfter(now, end);
  } catch (error) {
    console.error('Error checking if project is active:', error);
    return false;
  }
};

/**
 * Determine if a project is upcoming (start date is in the future)
 * @param {Date|string} startDate - Project start date
 * @returns {boolean} Whether the project is upcoming
 */
export const isProjectUpcoming = (startDate) => {
  if (!startDate) return false;
  
  try {
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const now = new Date();
    
    return isBefore(now, start);
  } catch (error) {
    console.error('Error checking if project is upcoming:', error);
    return false;
  }
};

/**
 * Determine if a project is completed (end date is in the past)
 * @param {Date|string} endDate - Project end date
 * @returns {boolean} Whether the project is completed
 */
export const isProjectCompleted = (endDate) => {
  if (!endDate) return false;
  
  try {
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
    const now = new Date();
    
    return isAfter(now, end);
  } catch (error) {
    console.error('Error checking if project is completed:', error);
    return false;
  }
};

/**
 * Calculate percentage of project completion based on dates
 * @param {Date|string} startDate - Project start date
 * @param {Date|string} endDate - Project end date
 * @returns {number} Completion percentage (0-100)
 */
export const calculateProjectProgress = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  
  try {
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
    const now = new Date();
    
    // If project hasn't started yet
    if (isBefore(now, start)) return 0;
    
    // If project is already completed
    if (isAfter(now, end)) return 100;
    
    // Calculate progress percentage
    const totalDuration = differenceInDays(end, start);
    const elapsed = differenceInDays(now, start);
    
    return Math.round((elapsed / totalDuration) * 100);
  } catch (error) {
    console.error('Error calculating project progress:', error);
    return 0;
  }
};

/**
 * Get project status based on dates
 * @param {Date|string} startDate - Project start date
 * @param {Date|string} endDate - Project end date
 * @returns {string} Project status ('upcoming', 'active', 'completed')
 */
export const getProjectStatus = (startDate, endDate) => {
  if (!startDate || !endDate) return 'unknown';
  
  if (isProjectUpcoming(startDate)) return 'upcoming';
  if (isProjectCompleted(endDate)) return 'completed';
  return 'active';
};

/**
 * Format date as relative to now (e.g., "2 days ago", "in 3 months")
 * @param {Date|string} date - Date to format
 * @returns {string} Relative date string
 */
export const formatRelativeDate = (date) => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistance(dateObj, new Date(), { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative date:', error);
    return 'Invalid date';
  }
};

/**
 * Get days remaining until a date
 * @param {Date|string} date - Target date
 * @returns {number} Number of days remaining
 */
export const getDaysRemaining = (date) => {
  if (!date) return 0;
  
  try {
    const targetDate = typeof date === 'string' ? parseISO(date) : date;
    const now = new Date();
    
    // If date is in the past, return 0
    if (isBefore(targetDate, now)) return 0;
    
    return differenceInDays(targetDate, now);
  } catch (error) {
    console.error('Error calculating days remaining:', error);
    return 0;
  }
};

/**
 * Format date range as a string
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {string} Formatted date range
 */
export const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return 'Date range not specified';
  
  try {
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
    
    return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`;
  } catch (error) {
    console.error('Error formatting date range:', error);
    return 'Invalid date range';
  }
};

export default {
  formatDate,
  calculateDuration,
  isProjectActive,
  isProjectUpcoming,
  isProjectCompleted,
  calculateProjectProgress,
  getProjectStatus,
  formatRelativeDate,
  getDaysRemaining,
  formatDateRange
};