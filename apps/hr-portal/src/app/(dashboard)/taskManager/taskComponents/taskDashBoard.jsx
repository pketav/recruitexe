'use client';

import { Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { GiProgression } from 'react-icons/gi';
import { GrCompliance } from 'react-icons/gr';
import React, { useEffect, useState } from 'react';
import { RiTeamLine } from 'react-icons/ri';
import { MdDoNotDisturbAlt, MdOutlineDateRange, MdOutlinePendingActions, MdTask } from 'react-icons/md';
import { FaCircleHalfStroke } from 'react-icons/fa6';
import { FaRegThumbsUp } from 'react-icons/fa';
import { Clock, CheckCircle } from 'lucide-react';
import UserInformation from './userInformation';
import AttendanceChart from './AttendanceChart';
import TaskManagementCalender from '../taskManagementCalender';

const TaskDashBoard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [userRole, setUserRole] = useState('');
  const [taskCounts, setTaskCounts] = useState({
    pending: 0,
    complete: 0,
    total: 0
  });

  useEffect(() => {
    // Get user data from localStorage
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('userData');
      if (userData) {
        try {
          const parsedData = JSON.parse(userData);
          if (parsedData && parsedData.role) {
            setUserRole(Array.isArray(parsedData.role) 
              ? parsedData.role 
              : [parsedData.role]);
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
      fetchTaskCounts();
    }
  }, []);

  const fetchTaskCounts = async () => {
    try {
      const response = await fetch(`${baseUrl}/v1/api/task/countTaskStatusApi`, {
        headers: {
          token: localStorage.getItem('authToken')
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch task counts');
      }

      const data = await response.json();
      if (data.status && data.items.taskCounts) {
        setTaskCounts(data.items.taskCounts);
      }
    } catch (error) {
      console.error('Error fetching task counts:', error);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fetchInitialData = async () => {
        try {
          const token = localStorage?.getItem('authToken');
          if (!token) return;
          
          const tokenDecodablePart = token?.split('.')[1];
          const decoded = JSON.parse(atob(tokenDecodablePart));
          const employeeIdFromToken = decoded?.Id;

          if (employeeIdFromToken) {
            const response = await fetch(
              `${baseUrl}/v1/api/adminMaster/employe/newMonthlyAttendance?employeeId=${employeeIdFromToken}`,
              {
                headers: {
                  token: token
                }
              }
            );

            if (!response.ok) {
              throw new Error('Failed to fetch attendance data');
            }

            const jsonData = await response.json();
            setData(jsonData.data);
          }
        } catch (err) {
          console.error('Error fetching data:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchInitialData();
    }
  }, [baseUrl]);

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} sx={{ 
          backgroundColor: '#e3e3e3', 
          pb: '10px', 
          pr: '10px', 
          borderRadius: '22px',
          p: 2
        }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                border: '0px solid #e3e3e3', 
                borderRadius: '22px',
                p: '18px 10px', 
                boxShadow: 'none' 
              }}>
                <Typography sx={{ mt: '-6px', mb: '6px' }}>
                  Task Overview
                </Typography>
                <Box sx={{ display: 'flex', gap: '16px' }}>
                  {/* Complete Task Box */}
                  <Box sx={{
                    width: '50%',
                    borderRadius: '8px',
                    backgroundColor: '#e6f7f4',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2
                  }}>
                    <Box sx={{
                      borderRadius: '50%',
                      backgroundColor: '#3cb4a0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1,
                      p: '15px'
                    }}>
                      <CheckCircle color='white' size={24} />
                    </Box>
                    <Typography sx={{ 
                      fontSize: '2rem', 
                      fontWeight: 'bold',
                      color: '#3cb4a0'
                    }}>
                      {taskCounts.complete}
                    </Typography>
                    <Typography sx={{ 
                      fontSize: '9px',
                      color: 'rgb(60 180 160)'
                    }}>
                      Complete Task
                    </Typography>
                  </Box>

                  {/* Pending Task Box */}
                  <Box sx={{
                    width: '50%',
                    borderRadius: '8px',
                    backgroundColor: '#ffede9',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2
                  }}>
                    <Box sx={{
                      borderRadius: '50%',
                      backgroundColor: '#ff6b45',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1,
                      p: '15px'
                    }}>
                      <Clock color='white' size={24} />
                    </Box>
                    <Typography sx={{ 
                      fontSize: '2rem', 
                      fontWeight: 'bold',
                      color: '#ff6b45'
                    }}>
                      {taskCounts.pending}
                    </Typography>
                    <Typography sx={{ 
                      fontSize: '9px',
                      color: '#ff6b45'
                    }}>
                      Pending Task
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={8}>
              {/* AttendanceChart component would go here */}
              <Card sx={{ height: '100%', p: 2 }}>
                <Typography variant="h6">Attendance Overview</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="primary">{data?.finalPresent || 0}</Typography>
                    <Typography variant="body2">Present</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="error">{data?.absentDays || 0}</Typography>
                    <Typography variant="body2">Absent</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="warning.main">{data?.halfDayTotalCount || 0}</Typography>
                    <Typography variant="body2">Half Day</Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ 
            backgroundColor: '#e3e3e3',
            p: '13px', 
            borderRadius: '23px',
            mt: '-10px'
          }}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>User Information</Typography>
              {!loading && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Present Days:</Typography>
                    <Typography variant="body2" fontWeight="bold">{data?.finalPresent || 0}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Absent Days:</Typography>
                    <Typography variant="body2" fontWeight="bold">{data?.absentDays || 0}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Half Days:</Typography>
                    <Typography variant="body2" fontWeight="bold">{data?.halfDayTotalCount || 0}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Late Coming:</Typography>
                    <Typography variant="body2" fontWeight="bold">{data?.lateComingCount || 0}</Typography>
                  </Box>
                </Box>
              )}
            </Card>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Task Calendar</Typography>
            <Box sx={{ height: '400px', overflow: 'hidden' }}>
              {/* TaskManagementCalender component would go here */}
              <TaskManagementCalender />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TaskDashBoard;
