import React, { useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import { InfoWindow as GoogleInfoWindow } from '@vis.gl/react-google-maps';
import { format, parseISO } from 'date-fns';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import Avatar from '@mui/material/Avatar';

const InfoWindow = ({ 
  data, 
  position, 
  onClose,
  onTrackLive,
  onViewHistory,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';
  const handleClose = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);
  const handleTrackLive = useCallback(async () => {
    if (onTrackLive && data?.id) {
      await onTrackLive(data.id);
    }
  }, [onTrackLive, data]);
  
  const handleViewHistory = useCallback(async () => {
    if (onViewHistory && data?.id) {
      await onViewHistory(data.id);
    }
  }, [onViewHistory, data]);
  
  if (!data) return null;

  // Render employee info
  if (data.type === 'employee') {
    return (
      <GoogleInfoWindow position={position} onCloseClick={handleClose}>
        <Box sx={{ 
          width: 280, 
          p: 1,
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderRadius: 1
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            pb: 2,
            borderBottom: `1px solid ${borderColor}`
          }}>
            {data.avatar ? (
              <Avatar 
                src={data.avatar} 
                sx={{ 
                  width: 48, 
                  height: 48,
                  mr: 2,
                  border: '2px solid rgba(79, 70, 229, 0.3)'
                }}
              />
            ) : (
              <Avatar 
                sx={{ 
                  bgcolor: '#4f46e5',
                  width: 48, 
                  height: 48,
                  mr: 2,
                  fontSize: '1.2rem'
                }}
              >
                {data.name.split(' ').map(part => part[0]).join('')}
              </Avatar>
            )}
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {data.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {data.designation}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 1.5 
            }}>
              <SvgIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </SvgIcon>
              <Typography variant="body2">
                {data.phone}
              </Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
            }}>
              <SvgIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
              </SvgIcon>
              <Typography variant="body2" sx={{ 
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {data.email}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="small" 
              fullWidth
              startIcon={
                <SvgIcon fontSize="small">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="4"></circle>
                  </svg>
                </SvgIcon>
              }
              onClick={handleTrackLive}
            >
              Track Live
            </Button>
            <Button 
              variant="outlined" 
              color="secondary" 
              size="small" 
              fullWidth
              startIcon={
                <SvgIcon fontSize="small">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </SvgIcon>
              }
              onClick={handleViewHistory}
            >
              View History
            </Button>
          </Box>
        </Box>
      </GoogleInfoWindow>
    );
  }
  
  // Render customer info
  if (data.type === 'customer') {
    return (
      <GoogleInfoWindow position={position} onCloseClick={handleClose}>
        <Box sx={{ 
          width: 280, 
          p: 1,
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderRadius: 1
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            pb: 2,
            borderBottom: `1px solid ${borderColor}`
          }}>
            <Avatar
              sx={{
                bgcolor: getCustomerTypeColor(data.businessType),
                width: 48,
                height: 48,
                mr: 2,
                fontSize: '1.2rem',
                border: `2px solid ${getCustomerTypeColor(data.businessType)}30`
              }}
            >
              {data.name.substring(0, 1)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {data.name}
              </Typography>
              <Chip
                label={data.businessType}
                size="small"
                sx={{
                  bgcolor: `${getCustomerTypeColor(data.businessType)}20`,
                  color: getCustomerTypeColor(data.businessType),
                  fontWeight: 500,
                  height: 20,
                  fontSize: '0.75rem'
                }}
              />
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'flex-start',
              mb: 1.5
            }}>
              <SvgIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1, mt: 0.25 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </SvgIcon>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  Contact Person
                </Typography>
                <Typography variant="body2">
                  {data.contactPerson}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{
              display: 'flex',
              alignItems: 'flex-start',
              mb: 1.5
            }}>
              <SvgIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1, mt: 0.25 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </SvgIcon>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  Phone
                </Typography>
                <Typography variant="body2">
                  {data.phone}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{
              display: 'flex',
              alignItems: 'flex-start',
              mb: 1.5
            }}>
              <SvgIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1, mt: 0.25 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
              </SvgIcon>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  Email
                </Typography>
                <Typography variant="body2" sx={{ 
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {data.email}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{
              display: 'flex',
              alignItems: 'flex-start'
            }}>
              <SvgIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1, mt: 0.25 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </SvgIcon>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  Address
                </Typography>
                <Typography variant="body2">
                  {data.address}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Divider sx={{ my: 1.5 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Last Visit
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {data.lastVisit ? format(parseISO(data.lastVisit), 'MMM d, yyyy') : 'N/A'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Next Visit
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {data.nextScheduledVisit ? format(parseISO(data.nextScheduledVisit), 'MMM d, yyyy') : 'N/A'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </GoogleInfoWindow>
    );
  }
  
  // Render branch info
  if (data.type === 'branch') {
    return (
      <GoogleInfoWindow position={position} onCloseClick={handleClose}>
        <Box sx={{ 
          width: 280, 
          p: 1,
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderRadius: 1
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            pb: 2,
            borderBottom: `1px solid ${borderColor}`
          }}>
            <Avatar
              sx={{
                bgcolor: '#ca8a04',
                width: 48,
                height: 48,
                mr: 2,
                fontSize: '1.2rem',
                border: '2px solid rgba(202, 138, 4, 0.3)'
              }}
            >
              {data.name.substring(0, 1)}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {data.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Established {data.established ? format(parseISO(data.established), 'yyyy') : 'N/A'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'flex-start',
              mb: 1.5
            }}>
              <SvgIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1, mt: 0.25 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </SvgIcon>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  Manager
                </Typography>
                <Typography variant="body2">
                  {data.manager}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{
              display: 'flex',
              alignItems: 'flex-start',
              mb: 1.5
            }}>
              <SvgIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1, mt: 0.25 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </SvgIcon>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  Phone
                </Typography>
                <Typography variant="body2">
                  {data.phone}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{
              display: 'flex',
              alignItems: 'flex-start'
            }}>
              <SvgIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1, mt: 0.25 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </SvgIcon>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  Address
                </Typography>
                <Typography variant="body2">
                  {data.address}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              bgcolor: 'rgba(202, 138, 4, 0.12)',
              borderRadius: 1,
              py: 1.5
            }}
          >
            <SvgIcon sx={{ color: '#ca8a04', mr: 1 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </SvgIcon>
            <Typography variant="subtitle1" sx={{ color: '#ca8a04', fontWeight: 600 }}>
              {data.employeeCount} Employees
            </Typography>
          </Box>
        </Box>
      </GoogleInfoWindow>
    );
  }
  
  // Render cluster info - showing multiple markers in one info window
  if (data.clusterPoints && data.clusterPoints.length > 0) {
    return (
      <GoogleInfoWindow position={position} onCloseClick={handleClose}>
        <Box sx={{ 
          width: 280, 
          p: 1,
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderRadius: 1
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            pb: 1,
            borderBottom: `1px solid ${borderColor}`
          }}>
            <SvgIcon sx={{ color: 'primary.main', mr: 1.5 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" x2="22" y1="12" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </SvgIcon>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Location Group
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {data.clusterPoints.length} locations nearby
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ maxHeight: 250, overflow: 'auto' }}>
            {data.clusterPoints.map((point, index) => (
              <React.Fragment key={point.id}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    py: 1.5,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.02)'
                    }
                  }}
                  onClick={() => {
                    handleClose();
                    onClose(); // Close this info window
                    setTimeout(() => {
                      // Open new info window for individual item
                      const marker = null;
                      onTrackLive(point.id);
                    }, 100);
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 1.5,
                      bgcolor: getIconBackgroundColor(point.type),
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: 600
                    }}
                  >
                    {point.type === 'employee' && (
                      point.name ? point.name.split(' ').map(part => part[0]).join('') : 'E'
                    )}
                    {point.type === 'customer' && (
                      <SvgIcon fontSize="small">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                        </svg>
                      </SvgIcon>
                    )}
                    {point.type === 'branch' && (
                      <SvgIcon fontSize="small">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                          <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                      </SvgIcon>
                    )}
                  </Box>
                  
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {point.name}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {point.type === 'employee' && point.designation}
                      {point.type === 'customer' && point.businessType}
                      {point.type === 'branch' && 'Branch Office'}
                    </Typography>
                  </Box>
                  
                  <IconButton 
                    size="small" 
                    color="primary"
                    sx={{ ml: 1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClose();
                      // Set position and data for the marker
                      if (onTrackLive && point.type === 'employee') {
                        // For employees, offer tracking
                        setTimeout(() => {
                          onTrackLive(point.id);
                        }, 100);
                      } else {
                        // For other types, just show info window
                        setTimeout(() => {
                          const marker = null;
                          onClose(); // Close this info window first
                          // Reopen with individual item
                          if (point && point.position) {
                            // Here we would need to trigger showing info for this specific item
                            // This would be handled by the parent component
                          }
                        }, 100);
                      }
                    }}
                  >
                    <SvgIcon fontSize="small">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </SvgIcon>
                  </IconButton>
                </Box>
                {index < data.clusterPoints.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Box>
        </Box>
      </GoogleInfoWindow>
    );
  }
  
  return null;
};

// Function to get icon background color based on type
const getIconBackgroundColor = (type) => {
  switch (type) {
    case 'employee':
      return '#4f46e5'; // Indigo
    case 'customer':
      return '#0ea5e9'; // Sky blue
    case 'branch':
      return '#ca8a04'; // Yellow
    default:
      return '#6b7280'; // Gray
  }
};

// Function to get color based on customer type
const getCustomerTypeColor = (type) => {
  if (!type) return '#6b7280'; // Default gray for missing type
  
  switch (type.toLowerCase()) {
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

export default InfoWindow;
