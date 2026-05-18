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
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import GroupIcon from '@mui/icons-material/Group';
import WorkIcon from '@mui/icons-material/Work';
import SourceIcon from '@mui/icons-material/Source';
import AssessmentIcon from '@mui/icons-material/Assessment';

export default function RecruitmentDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const theme = useTheme();

  const getDashboardData = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/job/getDashboardSummary?year=2025`, {
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
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const StatCard = ({ title, value, icon }) => (
    <Card
      sx={{
        p: 1,
        borderRadius: 3,
        background: 'linear-gradient(to top right, #ffffff, #f5f7fa)',
        border: '1px solid #d0d7de',
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
        height: 100,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
        },
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: theme.palette.primary.main, color: '#fff' }}>{icon}</Avatar>
          <Box>
            <Typography fontSize={12} fontWeight={600} color="text.secondary">
              {title.toUpperCase()}
            </Typography>
            <Typography fontSize={14} fontWeight={700} color="text.primary">
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box p={4} sx={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Recruitment Dashboard
      </Typography>

      <Grid container spacing={3} mb={4}>
        {Object.entries(dashboardData.overview).map(([key, value]) => (
          <Grid item xs={12} sm={6} md={3} key={key}>
            <StatCard
              title={key.replace(/([A-Z])/g, ' $1')}
              value={value}
              icon={<LeaderboardIcon fontSize="small" />}
            />
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" mb={2} fontWeight="bold" color="text.primary">
        Month Over Month
      </Typography>
      <Grid container spacing={3} mb={4}>
        {Object.entries(dashboardData.monthOverMonth).map(([key, obj]) => (
          <Grid item xs={12} sm={6} md={4} key={key}>
            <StatCard
              title={key.toUpperCase()}
              value={`Current: ${obj.current} | Prev: ${obj.previous} | Δ: ${obj?.change_percentage ? obj.change_percentage  : obj?.changePercentage}%`}
              icon={<TrendingUpIcon fontSize="small" />}
            />
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" mt={4} mb={2} fontWeight="bold">
        Status Breakdown
      </Typography>
      <Card sx={{ borderRadius: 2, p: 2, backgroundColor: '#ffffff', border: '1px solid #e0e0e0' }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={Object.entries(dashboardData.statusBreakdown).map(([key, value]) => ({ status: key, count: value }))}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill={theme.palette.primary.main} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Grid container spacing={3} mt={4}>
        {Object.entries(dashboardData.aiScreening).map(([key, value]) => (
          <Grid item xs={12} sm={6} md={3} key={key}>
            <StatCard
              title={key.replace(/([A-Z])/g, ' $1')}
              value={value}
              icon={<AssessmentIcon fontSize="small" />}
            />
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" mt={5} mb={2} fontWeight="bold">
        Top Departments
      </Typography>
      <Grid container spacing={3}>
        {dashboardData.topAppliedDepartments.map((dept) => (
          <Grid item xs={12} sm={6} md={3} key={dept.departmentId}>
            <StatCard
              title={dept.departmentName}
              value={dept.count}
              icon={<GroupIcon fontSize="small" />}
            />
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" mt={5} mb={2} fontWeight="bold">
        Top Positions
      </Typography>
      <Grid container spacing={3}>
        {dashboardData.topAppliedPositions.map((pos, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard
              title={pos.position}
              value={pos.count}
              icon={<WorkIcon fontSize="small" />}
            />
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" mt={5} mb={2} fontWeight="bold">
        Application Sources
      </Typography>
      <Grid container spacing={3}>
        {dashboardData.applicationSources.map((src, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard
              title={src.source || 'Unknown'}
              value={src.count}
              icon={<SourceIcon fontSize="small" />}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
