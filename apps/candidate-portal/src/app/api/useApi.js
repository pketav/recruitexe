// hooks/useApi.js
import { useState } from 'react';
import axios from 'axios';
import { useSnackbarContext } from '../SnackbarContext';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const { showMessage } = useSnackbarContext();

  const callApi = async ({
    endpoint,
    method = 'GET',
    data = null,
    successMessage,
    errorMessage,
    disableSnackbar = false,
  }) => {
    setLoading(true);
    try {
      const response = await axios({
        method,
        url: `${baseUrl}${endpoint}`,
        data,
        headers: {
          Authorization: `${token}`,
        },
      });

      const msg = successMessage ? successMessage : response.data.message 
      if (!disableSnackbar) showMessage(msg, 'success');

      return {
        success: true,
        message: msg,
        data: response.data,
      };
    } catch (error) {
      const msg = errorMessage || error?.response?.data?.message || 'An error occurred';
      if (!disableSnackbar) showMessage(msg, 'error');

      return {
        success: false,
        message: msg,
        error,
      };
    } finally {
      setLoading(false);
    }
  };

  return { callApi, loading };
};
