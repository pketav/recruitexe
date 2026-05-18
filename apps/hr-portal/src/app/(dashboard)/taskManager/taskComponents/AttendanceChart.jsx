'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AttendanceChart = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchAttendanceData();
    }
  }, []);

  const fetchAttendanceData = async () => {
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
        
        if (jsonData.data && jsonData.data.attendanceDetails) {
          // Process data for chart
          const chartData = processDataForChart(jsonData.data.attendanceDetails);
          setData(chartData);
        }
      }
    } catch (err) {
      console.error('Error fetching attendance data:', err);
    } finally {
      setLoading(false);
    }
  };

  const processDataForChart = (attendanceDetails) => {
    const last7Days = [];
    const today = new Date();
    
    // Create data for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dateString = date.toISOString().split('T')[0];
      const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
      
      const attendanceRecord = attendanceDetails.find(record => 
        record.date.split('T')[0] === dateString
      );
      
      last7Days.push({
        name: dayName,
        present: attendanceRecord?.status === 'present' ? 1 : 0,
        absent: attendanceRecord?.status === 'absent' ? 1 : 0,
        halfDay: attendanceRecord?.status === 'half day' ? 1 : 0,
        late: attendanceRecord?.lateStatus === 'yes' ? 1 : 0,
      });
    }
    
    return last7Days;
  };

  if (loading) {
    return (
      <Card sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Attendance Overview - Last 7 Days
        </Typography>
        
        {data.length === 0 ? (
          <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography color="text.secondary">No attendance data available</Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} domain={[0, 1]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#4CAF50" name="Present" />
              <Bar dataKey="halfDay" fill="#FF9800" name="Half Day" />
              <Bar dataKey="absent" fill="#F44336" name="Absent" />
              <Bar dataKey="late" fill="#2196F3" name="Late" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceChart;
