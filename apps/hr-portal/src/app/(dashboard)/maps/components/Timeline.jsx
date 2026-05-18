import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { employeesData } from '../data/employeesData';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SvgIcon from '@mui/material/SvgIcon';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';

const Timeline = ({ 
  employee, 
  date, 
  trackingData, 
  onDateChange, 
  onClose,
  isLiveTracking
}) => {
  // Get employee data
  const employeeData = employeesData.find(emp => emp.id === employee);
  
  // Get available dates with history for this employee
  const availableDates = employeeData
    ? Object.keys(employeeData.historyData).sort((a, b) => new Date(b) - new Date(a))
    : [];
  
  return (
    <Card 
      className="timeline-container"
      elevation={4}
      sx={{
        borderRadius: '12px 0 0 12px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardHeader
        avatar={
          employeeData && (
            employeeData.avatar ? (
              <Avatar 
                src={employeeData.avatar} 
                sx={{ 
                  width: 56, 
                  height: 56,
                  border: '2px solid rgba(79, 70, 229, 0.3)'
                }}
              />
            ) : (
              <Avatar 
                sx={{ 
                  bgcolor: '#4f46e5',
                  width: 56, 
                  height: 56,
                  fontSize: '1.5rem'
                }}
              >
                {employeeData.name.split(' ').map(part => part[0]).join('')}
              </Avatar>
            )
          )
        }
        title={
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {employeeData ? employeeData.name : 'Employee'}
          </Typography>
        }
        subheader={
          employeeData && (
            <Typography variant="body2" color="text.secondary">
              {employeeData.designation}
            </Typography>
          )
        }
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isLiveTracking ? (
              <Chip 
                label="Live Tracking" 
                color="success" 
                size="small" 
                icon={
                  <SvgIcon fontSize="small">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 12c0 6-4.39 10-9.806 10C7.792 22 4.24 19.665 3 16"></path>
                      <path d="M2 9c-.303-2.048 0-6 0-6s3.356 0 6 0"></path>
                      <path d="M12 2c6 0 10 4.308 10 10 0 3.419-1.6 6.155-4 8"></path>
                    </svg>
                  </SvgIcon>
                }
                sx={{ mr: 1, animation: 'pulse 1.5s infinite' }}
              />
            ) : (
              <TextField
                select
                size="small"
                value={date}
                onChange={(e) => onDateChange(e.target.value)}
                sx={{ minWidth: 140 }}
              >
                {availableDates.map(date => (
                  <MenuItem key={date} value={date}>
                    {format(parseISO(date), 'MMMM d, yyyy')}
                  </MenuItem>
                ))}
              </TextField>
            )}
            <IconButton onClick={onClose} aria-label="close">
              <SvgIcon>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </SvgIcon>
            </IconButton>
          </Box>
        }
        sx={{ 
          bgcolor: 'background.paper',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          px: 3,
          py: 2
        }}
      />
      
      <CardContent 
        sx={{ 
          flex: 1, 
          overflow: 'auto',
          px: 0,
          py: 0,
          '&:last-child': { pb: 0 }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
            Activity Timeline
          </Typography>
          
          {trackingData.length > 0 ? (
            <Box className="timeline" sx={{ position: 'relative', pl: 4 }}>
              {/* Vertical line */}
              <Box 
                sx={{ 
                  position: 'absolute', 
                  left: '8px', 
                  top: '0', 
                  bottom: '0', 
                  width: '2px', 
                  bgcolor: 'divider'
                }}
              />
              
              {trackingData.map((item, index) => (
                <Box
                  key={`${item.time}-${index}`}
                  sx={{
                    position: 'relative',
                    mb: index === trackingData.length - 1 ? 0 : 4,
                    '&:last-child::after': {
                      display: 'none'
                    }
                  }}
                >
                  {/* Timeline marker */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: '-28px',
                      top: '0',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      bgcolor: index === trackingData.length - 1 ? 'primary.main' : 'background.default',
                      border: theme => `2px solid ${index === trackingData.length - 1 ? theme.palette.primary.main : '#9ca3af'}`,
                      zIndex: 1
                    }}
                  />
                  
                  {/* Timeline content */}
                  <Box
                    sx={{
                      bgcolor: index === trackingData.length - 1 ? 'primary.lighter' : 'background.paper',
                      borderRadius: '8px',
                      p: 2,
                      ...(index === trackingData.length - 1 && {
                        borderLeft: '3px solid',
                        borderColor: 'primary.main'
                      }),
                      boxShadow: index === trackingData.length - 1 ? 1 : 0,
                      border: theme => index === trackingData.length - 1 ? 'none' : `1px solid ${theme.palette.divider}`
                    }}
                  >
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontWeight: 600,
                        color: index === trackingData.length - 1 ? 'primary.main' : 'text.primary',
                        mb: 0.5
                      }}
                    >
                      {item.time}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ mb: 1, color: 'text.primary' }}>
                      {item.activity}
                    </Typography>
                    
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        color: 'text.secondary',
                        fontSize: '0.75rem'
                      }}
                    >
                      <SvgIcon fontSize="inherit" sx={{ mr: 0.5 }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                      </SvgIcon>
                      <span>
                        {item.location.lat.toFixed(4)}, {item.location.lng.toFixed(4)}
                      </span>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Box 
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
                px: 2
              }}
            >
              <SvgIcon sx={{ fontSize: 48, color: 'action.disabled', mb: 2 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                  <line x1="16" x2="16" y1="2" y2="6"></line>
                  <line x1="8" x2="8" y1="2" y2="6"></line>
                  <line x1="3" x2="21" y1="10" y2="10"></line>
                  <path d="M8 14h.01"></path>
                  <path d="M12 14h.01"></path>
                  <path d="M16 14h.01"></path>
                  <path d="M8 18h.01"></path>
                  <path d="M12 18h.01"></path>
                  <path d="M16 18h.01"></path>
                </svg>
              </SvgIcon>
              <Typography variant="body2" color="text.secondary">
                No tracking data available for this date.
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>

      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.8;
          }
        }

        .timeline-container {
          position: absolute;
          bottom: 20px;
          right: 20px;
          width: 400px;
          max-height: 600px;
          z-index: 10;
        }
      `}</style>
    </Card>
  );
};

export default Timeline;
