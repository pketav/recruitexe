import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import SvgIcon from '@mui/material/SvgIcon';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LinearProgress from '@mui/material/LinearProgress';
import Fade from '@mui/material/Fade';

import { employeesData } from '../data/employeesData';
import { customersData } from '../data/customersData';
import { branchesData } from '../data/branchesData';

const StatsPanel = ({ onClose, isVisible }) => {
  // Calculate stats
  const totalEmployees = employeesData.length;
  const totalCustomers = customersData.length;
  const totalBranches = branchesData.length;
  
  // Calculate employees per branch
  const avgEmployeesPerBranch = Math.round(totalEmployees / totalBranches);
  
  // Calculate total branch employees (from branch data)
  const totalBranchEmployees = branchesData.reduce((acc, branch) => acc + branch.employeeCount, 0);
  
  // Calculate customer types
  const customerTypes = customersData.reduce((acc, customer) => {
    const type = customer.type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  
  // Calculate total by finding the type with most customers
  const maxCustomerTypeCount = Math.max(...Object.values(customerTypes));
  
  // Get most recent employee activity dates
  const employeeActivityDates = employeesData.flatMap(employee => 
    Object.keys(employee.historyData)
  );
  
  const uniqueDates = [...new Set(employeeActivityDates)];
  const latestDate = uniqueDates.sort().reverse()[0];
  
  return (
    <Fade in={isVisible}>
      <Card
        elevation={4}
        sx={{
          position: 'absolute',
          bottom: 20,
          left: 340, // Position next to sidebar
          width: 420,
          borderRadius: 2,
          zIndex: 1000,
          overflow: 'visible'
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SvgIcon color="primary" sx={{ mr: 1 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18"></path>
                  <path d="M18 17V9"></path>
                  <path d="M13 17V5"></path>
                  <path d="M8 17v-3"></path>
                </svg>
              </SvgIcon>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Map Statistics
              </Typography>
            </Box>
            <IconButton size="small" onClick={onClose}>
              <SvgIcon fontSize="small">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </SvgIcon>
            </IconButton>
          </Box>
          
          <Grid container spacing={0}>
            <Grid item xs={4}>
              <StatsCard 
                title="Employees"
                value={totalEmployees}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                }
                color="#4f46e5"
              />
            </Grid>
            <Grid item xs={4}>
              <StatsCard 
                title="Customers"
                value={totalCustomers}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                }
                color="#0ea5e9"
              />
            </Grid>
            <Grid item xs={4}>
              <StatsCard 
                title="Branches"
                value={totalBranches}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                }
                color="#ca8a04"
              />
            </Grid>
          </Grid>
          
          <Divider />
          
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Customer Breakdown
            </Typography>
            
            {Object.entries(customerTypes).map(([type, count]) => (
              <Tooltip key={type} title={`${count} ${type} customers`} arrow>
                <Box sx={{ mb: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {type}
                    </Typography>
                    <Typography variant="caption" fontWeight={500}>
                      {count} ({Math.round(count / totalCustomers * 100)}%)
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(count / maxCustomerTypeCount) * 100}
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      bgcolor: 'rgba(0,0,0,0.05)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: getCustomerTypeColor(type),
                        borderRadius: 3
                      }
                    }}
                  />
                </Box>
              </Tooltip>
            ))}
          </Box>
          
          <Divider />
          
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Quick Facts
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FactItem 
                  label="Avg Employees per Branch"
                  value={avgEmployeesPerBranch}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                      <path d="M20 3v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V3"></path>
                      <path d="M6 8h.01"></path>
                      <path d="M18 8h.01"></path>
                    </svg>
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <FactItem 
                  label="Total Branch Employees"
                  value={totalBranchEmployees}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <FactItem 
                  label="Latest Activity Date"
                  value={latestDate ? latestDate.split('-').reverse().join('/') : 'N/A'}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                      <line x1="16" x2="16" y1="2" y2="6"></line>
                      <line x1="8" x2="8" y1="2" y2="6"></line>
                      <line x1="3" x2="21" y1="10" y2="10"></line>
                    </svg>
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <FactItem 
                  label="Total Locations"
                  value={totalEmployees + totalCustomers + totalBranches}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" x2="22" y1="12" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                  }
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};

// Stat Card Component
const StatsCard = ({ title, value, icon, color }) => {
  return (
    <Box sx={{ textAlign: 'center', p: 2 }}>
      <Box 
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 48,
          height: 48,
          borderRadius: '50%',
          bgcolor: `${color}10`,
          color: color,
          mx: 'auto',
          mb: 1
        }}
      >
        <SvgIcon>{icon}</SvgIcon>
      </Box>
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {title}
      </Typography>
    </Box>
  );
};

// Fact Item Component
const FactItem = ({ label, value, icon }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box 
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          borderRadius: '50%',
          bgcolor: 'rgba(0,0,0,0.04)',
          color: 'text.secondary',
          mr: 1.5
        }}
      >
        <SvgIcon fontSize="small">{icon}</SvgIcon>
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

// Function to get color based on customer type
const getCustomerTypeColor = (type) => {
  switch (type?.toLowerCase()) {
    case 'corporate':
      return '#0ea5e9'; // Sky blue
    case 'sme':
      return '#8b5cf6'; // Purple
    case 'retail':
      return '#f97316'; // Orange
    case 'startup':
      return '#10b981'; // Emerald
    case 'healthcare':
      return '#ef4444'; // Red
    case 'education':
      return '#f59e0b'; // Amber
    case 'food & beverage':
      return '#ec4899'; // Pink
    default:
      return '#6b7280'; // Gray
  }
};

export default StatsPanel;
