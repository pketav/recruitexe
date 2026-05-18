// utils/apiUtils.js
/**
 * Utility functions for API interactions
 */

/**
 * Get common headers for API requests including auth token
 * @param {string} token - Auth token
 * @returns {Object} Headers object
 */
export const getHeaders = (token) => {
    return {
      'Content-Type': 'application/json',
      token: token || localStorage.getItem('authToken') || ''
    };
  };
  
  /**
   * Generic fetch function with error handling
   * @param {string} url - API endpoint URL
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} Response data
   */
  export const fetchWithErrorHandling = async (url, options = {}) => {
    try {
      const response = await fetch(url, options);
      
      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        // Check if response has JSON content
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || `API error: ${response.status}`);
        } catch (e) {
          // If response is not JSON or parsing fails
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
      }
      
      // Parse JSON response
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        message: error.message || 'An unknown error occurred',
        data: null
      };
    }
  };
  
  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  export const isAuthenticated = () => {
    if (typeof window === 'undefined') return false; // For SSR
    
    const token = localStorage.getItem('authToken');
    return !!token;
  };
  
  /**
   * Handle API response errors uniformly
   * @param {Object} response - API response object
   * @returns {Object} Error object with message
   */
  export const handleApiError = (response) => {
    let message = 'An unknown error occurred';
    
    if (response && response.message) {
      message = response.message;
    } else if (response && response.error) {
      message = response.error;
    } else if (typeof response === 'string') {
      message = response;
    }
    
    return {
      success: false,
      message,
      data: null
    };
  };
  
  /**
   * Create a full API URL from a path
   * @param {string} path - API endpoint path
   * @returns {string} Full API URL
   */
  export const createApiUrl = (path) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  };
  
  /**
   * Generic API call function
   * @param {string} endpoint - API endpoint
   * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
   * @param {Object} data - Request body data
   * @param {Object} customHeaders - Additional headers
   * @returns {Promise<Object>} Response data
   */
  export const apiCall = async (endpoint, method = 'GET', data = null, customHeaders = {}) => {
    try {
      const token = localStorage.getItem('authToken');
      const url = createApiUrl(endpoint);
      
      const options = {
        method,
        headers: {
          ...getHeaders(token),
          ...customHeaders
        }
      };
      
      if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
        options.body = JSON.stringify(data);
      }
      
      return await fetchWithErrorHandling(url, options);
    } catch (error) {
      return handleApiError(error);
    }
  };
  
  /**
   * Handle token expiration or unauthorized responses
   * @param {Object} response - API response
   * @returns {boolean} True if unauthorized and handled
   */
  export const handleUnauthorized = (response) => {
    // Check for unauthorized response
    if (response && (response.status === 401 || 
        (response.message && response.message.toLowerCase().includes('unauthorized')) ||
        (response.message && response.message.toLowerCase().includes('token')))) {
      
      // Clear localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      
      return true;
    }
    
    return false;
  };
  
  export default {
    getHeaders,
    fetchWithErrorHandling,
    isAuthenticated,
    handleApiError,
    createApiUrl,
    apiCall,
    handleUnauthorized
  };