// src/app/(dashboard)/maps/hooks/useTracking.js

import { useState, useEffect, useCallback, useRef } from 'react';
import { getEmployeeData } from '../services/api';
import { format } from 'date-fns';
import socket from '../utils/socket';

export const useTracking = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [trackingData, setTrackingData] = useState([]);
  const [liveTrackingActive, setLiveTrackingActive] = useState(false);
  const [liveLocationData, setLiveLocationData] = useState({});
  const intervalRef = useRef(null);
  
  // Connect to socket and set up event listeners
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    
    // Handler for receiving location updates
    const handleLocationUpdate = (data) => {
      // Extract userId from the data (may need to adjust based on your server's data format)
      const userId = data.userId.split('_')[0];
      
      console.log('Received live location update for user:', userId, data);
      
      // Update live location data
      setLiveLocationData(prev => ({
        ...prev,
        [userId]: {
          lat: data.location.coordinates[1],
          lng: data.location.coordinates[0],
          timestamp: data.timestamp || new Date().toISOString()
        }
      }));
      
      // If this is the currently tracked employee, add to tracking data
      if (liveTrackingActive && userId === selectedEmployee) {
        setTrackingData(prevData => [
          ...prevData,
          {
            location: {
              lat: data.location.coordinates[1],
              lng: data.location.coordinates[0]
            },
            timestamp: data.timestamp || new Date().toISOString()
          }
        ]);
      }
    };
    
    // Listen for location updates
    socket.on('receive_location', handleLocationUpdate);
    
    // Cleanup function
    return () => {
      socket.off('receive_location', handleLocationUpdate);
      
      // Only disconnect if we initiated the connection
      if (socket.connected) {
        socket.disconnect();
      }
      
      // Clear any intervals
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [liveTrackingActive, selectedEmployee]);
  
  // Load tracking history when employee or date changes and not in live mode
  useEffect(() => {
    const fetchHistory = async () => {
      if (selectedEmployee && selectedDate && !liveTrackingActive) {
        const historyData = await getEmployeeData(selectedEmployee, selectedDate);
        setTrackingData(historyData || []);
      }
    };
    
    fetchHistory();
  }, [selectedEmployee, selectedDate, liveTrackingActive]);
  
  // Function to initialize live tracking state with existing history
  const fetchInitialHistoryData = async (employeeId) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const historyData = await getEmployeeData(employeeId, today);
    
    // If we have history data, use it as the starting point for tracking
    if (historyData && historyData.length > 0) {
      setTrackingData(historyData);
      return true;
    }
    
    // If we don't have history data but do have live location, create a starting point
    if (liveLocationData[employeeId]) {
      setTrackingData([{
        location: {
          lat: liveLocationData[employeeId].lat,
          lng: liveLocationData[employeeId].lng
        },
        timestamp: liveLocationData[employeeId].timestamp
      }]);
      return true;
    }
    
    return false;
  };
  
  // Handle live tracking toggle
  const toggleLiveTracking = useCallback(async (employeeId) => {
    // If already tracking this employee, stop tracking
    if (liveTrackingActive && selectedEmployee === employeeId) {
      setLiveTrackingActive(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return false;
    }
    
    // Start tracking a new employee
    setSelectedEmployee(employeeId);
    
    // Try to get initial data
    const hasInitialData = await fetchInitialHistoryData(employeeId);
    
    // If no data available, we can't track
    if (!hasInitialData && !liveLocationData[employeeId]) {
      console.log('No tracking data available for this employee');
      return false;
    }
    
    // Set active tracking mode
    setLiveTrackingActive(true);
    
    // In a real-world scenario with socket.io:
    // 1. Emit a message to the server to start tracking this employee
    socket.emit('start_tracking', { employeeId });
    
    // Create cleanup interval to remove stale data every minute
    intervalRef.current = setInterval(() => {
      // Check if the last update is more than 5 minutes old
      const fiveMinutesAgo = new Date();
      fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
      
      if (liveLocationData[employeeId]) {
        const lastUpdateTime = new Date(liveLocationData[employeeId].timestamp);
        if (lastUpdateTime < fiveMinutesAgo) {
          console.log('Live tracking data is stale, stopping tracking');
          setLiveTrackingActive(false);
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, 60000); // Check every minute
    
    return true;
  }, [liveTrackingActive, selectedEmployee, liveLocationData]);
  
  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  // View history for a specific employee and date
  const viewHistory = useCallback(async (employeeId, date) => {
    // If live tracking is active, stop it
    if (liveTrackingActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setLiveTrackingActive(false);
      
      // Tell the server to stop tracking
      socket.emit('stop_tracking', { employeeId: selectedEmployee });
    }
    
    setSelectedEmployee(employeeId);
    setSelectedDate(date);
    
    const historyData = await getEmployeeHistoryByDate(employeeId, date);
    setTrackingData(historyData || []);
    
    return historyData || [];
  }, [liveTrackingActive, selectedEmployee]);
  
  // Function to fetch initial live locations of all employees
  const fetchAllLiveLocations = useCallback(async () => {
    try {
      // In a real implementation, you would fetch this from your server
      // For now, we'll simulate by emitting a request event
      socket.emit('get_all_locations');
      
      // The response will come through the 'receive_location' event
      // which we're already handling in the useEffect hook
    } catch (error) {
      console.error('Error fetching live locations:', error);
    }
  }, []);
  
  // Call this when the component mounts
  useEffect(() => {
    fetchAllLiveLocations();
  }, [fetchAllLiveLocations]);
  
  return {
    selectedEmployee,
    selectedDate,
    trackingData,
    liveTrackingActive,
    liveLocationData,
    toggleLiveTracking,
    viewHistory,
    setSelectedDate,
    fetchAllLiveLocations
  };
};
