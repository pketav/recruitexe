import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SvgIcon from '@mui/material/SvgIcon';
import Divider from '@mui/material/Divider';

const MapStatistics = ({ 
  employeeCount, 
  customerCount, 
  branchCount,
  visibleEmployeeCount,
  visibleCustomerCount,
  visibleBranchCount
}) => {
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        borderRadius: '8px',
        overflow: 'hidden',
        zIndex: 1,
        width: '250px'
      }}
    >
      <Box 
        sx={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 1.5,
          bgcolor: 'primary.main',
          color: 'white'
        }}
      >
        <SvgIcon sx={{ mr: 1 }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18"></path>
            <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
          </svg>
        </SvgIcon>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Map Statistics
        </Typography>
      </Box>
      
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              flex: 1 
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: 'rgba(79, 70, 229, 0.1)',
              mb: 1
            }}>
              <SvgIcon sx={{ color: '#4f46e5' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </SvgIcon>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0 }}>
              {visibleEmployeeCount}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: -0.5 }}>
              /{employeeCount} Employees
            </Typography>
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              flex: 1 
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: 'rgba(14, 165, 233, 0.1)',
              mb: 1
            }}>
              <SvgIcon sx={{ color: '#0ea5e9' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </SvgIcon>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0 }}>
              {visibleCustomerCount}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: -0.5 }}>
              /{customerCount} Customers
            </Typography>
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              flex: 1 
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: 'rgba(202, 138, 4, 0.1)',
              mb: 1
            }}>
              <SvgIcon sx={{ color: '#ca8a04' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </SvgIcon>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0 }}>
              {visibleBranchCount}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: -0.5 }}>
              /{branchCount} Branches
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ my: 1.5 }} />
        
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
            {visibleEmployeeCount + visibleCustomerCount + visibleBranchCount}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            visible locations
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default MapStatistics;
