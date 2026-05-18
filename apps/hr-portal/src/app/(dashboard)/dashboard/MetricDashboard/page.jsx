'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
  Avatar,
  Divider
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import GroupIcon from '@mui/icons-material/Group';
import AssessmentIcon from '@mui/icons-material/Assessment';
import WorkIcon from '@mui/icons-material/Work';

export default function MetricDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const theme = useTheme();

  const getDashboardData = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/job/getDashboardMetrics`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      });
      setDashboardData(res.data.items || {});
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  if (!dashboardData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const StatCard = ({ title, value, icon }) => (
    <Box
      sx={{
        p: 4,
        borderRadius: 2,
        background: '#f9f9fb',
        boxShadow: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        height: '100%',
      }}
    >
      <Avatar sx={{ bgcolor: theme.palette.primary.main, color: '#fff' }}>{icon}</Avatar>
      <Box>
        <Typography variant="caption" color="text.secondary">
          {title.toUpperCase()}
        </Typography>
        <Typography variant="h6" fontWeight={600}>
          {value}
        </Typography>
      </Box>
    </Box>
  );


  return (
    <Box padding={4} sx={{ backgroundColor: '#f9fafc', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Recruitment Metrics Dashboard
      </Typography>

      <Grid container spacing={4}>

  {/* Workflow Stats */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📈 Workflow Stats (May)
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}><StatCard title="Applications" value={dashboardData.workflowStats[4].applications} icon={<TrendingUpIcon fontSize="small" />} /></Grid>
                <Grid item xs={6}><StatCard title="Shortlisted" value={dashboardData.workflowStats[4].shortlisted} icon={<LeaderboardIcon fontSize="small" />} /></Grid>
                <Grid item xs={6}><StatCard title="Interview" value={dashboardData.workflowStats[4].interviewSchedule} icon={<GroupIcon fontSize="small" />} /></Grid>
                <Grid item xs={6}><StatCard title="Offered" value={dashboardData.workflowStats[4].offered} icon={<AssessmentIcon fontSize="small" />} /></Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Positions */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🏆 Top Positions
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={1}>
                {dashboardData.topPositions.map((position, index) => (
                  <Grid item xs={12} key={index}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1.5,
                        borderRadius: 2,
                        background: '#fdfdfd',
                        border: '1px solid #e0e0e0',
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <WorkIcon fontSize="small" color="disabled" />
                        <Typography variant="body2" fontWeight={500}>{position.position.toUpperCase()}</Typography>
                      </Box>
                      <Typography variant="body2" fontWeight={600}>{position.count}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 Applications by Month
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.applicationsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#42a5f5" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ✅ Shortlisted List Rate
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.ShortlistedlistRate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="successRate" fill="#66bb6a" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🏢 Applications by Department
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.applicationsByDepartment}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="departmentName" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#ffa726" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📌 Applications by Status
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.applicationsByStatus}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#26c6da" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
