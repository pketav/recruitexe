import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Typography, 
  Tabs, 
  Tab, 
  Paper,
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SvgIcon
} from '@mui/material';
import { employeesData } from '../data/employeesData';
import { customersData } from '../data/customersData';
import { branchesData } from '../data/branchesData';

// Mock data for analytics visualizations
const employeeActivityData = [
  { name: 'John Doe', activities: 45, distance: 32, visits: 12 },
  { name: 'Jane Smith', activities: 38, distance: 28, visits: 15 },
  { name: 'Robert Johnson', activities: 52, distance: 47, visits: 18 },
  { name: 'Sarah Williams', activities: 33, distance: 26, visits: 10 },
  { name: 'Michael Brown', activities: 41, distance: 30, visits: 14 }
];

// Most visited customers
const topCustomers = [
  { name: 'ABC Corporation', visits: 23, lastVisit: '2 days ago' },
  { name: 'XYZ Enterprises', visits: 18, lastVisit: '5 days ago' },
  { name: 'Global Solutions Ltd', visits: 15, lastVisit: '1 week ago' },
  { name: 'Retail Masters', visits: 12, lastVisit: '2 weeks ago' },
  { name: 'Tech Innovations', visits: 10, lastVisit: '3 days ago' }
];

// Branch performance
const branchPerformance = [
  { name: 'Delhi Headquarters', employees: 120, customersVisited: 87, avgDistance: 28 },
  { name: 'Noida Regional Office', employees: 75, customersVisited: 52, avgDistance: 22 },
  { name: 'Gurugram Corporate Center', employees: 95, customersVisited: 68, avgDistance: 25 },
  { name: 'South Delhi Branch', employees: 45, customersVisited: 31, avgDistance: 18 },
  { name: 'East Delhi Operation Center', employees: 60, customersVisited: 43, avgDistance: 20 }
];

const Analytics = () => {
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('week');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  // Mock functions that would fetch data based on time range in a real application
  const getEmployeeData = () => employeeActivityData;
  const getCustomerData = () => topCustomers;
  const getBranchData = () => branchPerformance;

  const summaryCards = [
    { 
      title: 'Total Distance Covered', 
      value: '163 km', 
      change: '+12%',
      icon: (
        <SvgIcon sx={{ fontSize: 36, color: '#4f46e5' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h13l4-3.5L18 6Z"></path>
            <path d="M12 13v8"></path>
            <path d="M12 3v3"></path>
          </svg>
        </SvgIcon>
      )
    },
    { 
      title: 'Customer Visits', 
      value: '69', 
      change: '+5%',
      icon: (
        <SvgIcon sx={{ fontSize: 36, color: '#0ea5e9' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
        </SvgIcon>
      )
    },
    {
      title: 'Active Employees', 
      value: employeesData.length.toString(),
      change: '0%',
      icon: (
        <SvgIcon sx={{ fontSize: 36, color: '#16a34a' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </SvgIcon>
      )
    },
    {
      title: 'Average Activity Time', 
      value: '5.2 hrs',
      change: '+8%',
      icon: (
        <SvgIcon sx={{ fontSize: 36, color: '#ca8a04' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </SvgIcon>
      )
    }
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Tracking Analytics Dashboard
        </Typography>
        <FormControl sx={{ width: 150 }} size="small">
          <InputLabel id="time-range-label">Time Range</InputLabel>
          <Select
            labelId="time-range-label"
            id="time-range"
            value={timeRange}
            label="Time Range"
            onChange={handleTimeRangeChange}
          >
            <MenuItem value="day">Today</MenuItem>
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="quarter">This Quarter</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {card.value}
                  </Typography>
                </Box>
                {card.icon}
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  mt: 2, 
                  color: card.change.startsWith('+') ? 'success.main' : 
                         card.change.startsWith('-') ? 'error.main' : 'text.secondary',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {card.change.startsWith('+') ? (
                  <SvgIcon fontSize="small" sx={{ mr: 0.5 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6-6 6 6"></path>
                      <path d="M6 12h12"></path>
                      <path d="m6 15 6 6 6-6"></path>
                    </svg>
                  </SvgIcon>
                ) : card.change.startsWith('-') ? (
                  <SvgIcon fontSize="small" sx={{ mr: 0.5 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6"></path>
                    </svg>
                  </SvgIcon>
                ) : null}
                {card.change} from last {timeRange}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Main Content */}
      <Card>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Employee Performance" />
          <Tab label="Customer Insights" />
          <Tab label="Branch Statistics" />
        </Tabs>

        <CardContent>
          {/* Employee Performance Tab */}
          {tabValue === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Top Performing Employees
              </Typography>
              <Box sx={{ mt: 2 }}>
                {getEmployeeData().map((employee, index) => (
                  <React.Fragment key={index}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      py: 2
                    }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: '#4f46e5',
                          width: 40,
                          height: 40,
                          mr: 2
                        }}
                      >
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2">{employee.name}</Typography>
                        <Box sx={{ display: 'flex', mt: 0.5 }}>
                          <Typography variant="caption" sx={{ mr: 2 }}>
                            <strong>{employee.activities}</strong> Activities
                          </Typography>
                          <Typography variant="caption" sx={{ mr: 2 }}>
                            <strong>{employee.distance}km</strong> Covered
                          </Typography>
                          <Typography variant="caption">
                            <strong>{employee.visits}</strong> Customer Visits
                          </Typography>
                        </Box>
                      </Box>
                      <Box 
                        sx={{ 
                          width: 80, 
                          height: 10, 
                          bgcolor: '#f3f4f6',
                          borderRadius: 5,
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        <Box 
                          sx={{ 
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            height: '100%',
                            width: `${(employee.activities / 60) * 100}%`,
                            bgcolor: '#4f46e5',
                            borderRadius: 5
                          }}
                        />
                      </Box>
                    </Box>
                    {index < getEmployeeData().length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </Box>
            </Box>
          )}

          {/* Customer Insights Tab */}
          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Most Visited Customers
              </Typography>
              <Box sx={{ mt: 2 }}>
                {getCustomerData().map((customer, index) => (
                  <React.Fragment key={index}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      py: 2
                    }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: '#0ea5e9',
                          width: 40,
                          height: 40,
                          mr: 2
                        }}
                      >
                        {customer.name.substring(0, 1)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2">{customer.name}</Typography>
                        <Box sx={{ display: 'flex', mt: 0.5 }}>
                          <Typography variant="caption" sx={{ mr: 2 }}>
                            <strong>{customer.visits}</strong> Total Visits
                          </Typography>
                          <Typography variant="caption">
                            Last visit: <strong>{customer.lastVisit}</strong>
                          </Typography>
                        </Box>
                      </Box>
                      <Box 
                        sx={{ 
                          width: 80, 
                          height: 10, 
                          bgcolor: '#f3f4f6',
                          borderRadius: 5,
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        <Box 
                          sx={{ 
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            height: '100%',
                            width: `${(customer.visits / 25) * 100}%`,
                            bgcolor: '#0ea5e9',
                            borderRadius: 5
                          }}
                        />
                      </Box>
                    </Box>
                    {index < getCustomerData().length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </Box>
            </Box>
          )}

          {/* Branch Statistics Tab */}
          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Branch Performance
              </Typography>
              <Box sx={{ mt: 2 }}>
                {getBranchData().map((branch, index) => (
                  <React.Fragment key={index}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      py: 2
                    }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: '#ca8a04',
                          width: 40,
                          height: 40,
                          mr: 2
                        }}
                      >
                        {branch.name.substring(0, 1)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2">{branch.name}</Typography>
                        <Box sx={{ display: 'flex', mt: 0.5 }}>
                          <Typography variant="caption" sx={{ mr: 2 }}>
                            <strong>{branch.employees}</strong> Employees
                          </Typography>
                          <Typography variant="caption" sx={{ mr: 2 }}>
                            <strong>{branch.customersVisited}</strong> Customers Visited
                          </Typography>
                          <Typography variant="caption">
                            <strong>{branch.avgDistance}km</strong> Avg. Distance
                          </Typography>
                        </Box>
                      </Box>
                      <Box 
                        sx={{ 
                          width: 80, 
                          height: 10, 
                          bgcolor: '#f3f4f6',
                          borderRadius: 5,
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        <Box 
                          sx={{ 
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            height: '100%',
                            width: `${(branch.customersVisited / 100) * 100}%`,
                            bgcolor: '#ca8a04',
                            borderRadius: 5
                          }}
                        />
                      </Box>
                    </Box>
                    {index < getBranchData().length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Analytics;
