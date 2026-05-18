import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import { motion, AnimatePresence } from 'framer-motion';
import MapStyleSelector from './MapStyleSelector';

const FilterPanel = ({ filters, onFilterChange, clusteringEnabled, onClusteringToggle, mapInstance }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [isExpanded, setIsExpanded] = useState(true);

  const handleFilterChange = (type) => {
    onFilterChange({
      ...filters,
      [type]: !filters[type]
    });
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        width: isExpanded ? '260px' : '60px',
        height: 'auto'
      }}
      transition={{ 
        duration: 0.4, 
        delay: 0.2,
        layout: { duration: 0.3 }
      }}
      layout
      elevation={isDarkMode ? 6 : 2}
      className="filter-panel glass-card animate-transition"
      sx={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        zIndex: 11, // Increased z-index to ensure it's above other elements
        backgroundColor: isDarkMode 
          ? 'rgba(30, 41, 59, 0.9) !important' // Darker and more opaque background for dark mode
          : 'rgba(255, 255, 255, 0.9)', // More opaque in light mode as well
        backdropFilter: 'blur(10px)',
        border: isDarkMode 
          ? '1px solid rgba(255, 255, 255, 0.15)' // More visible border in dark mode
          : '1px solid rgba(0, 0, 0, 0.08)',
        borderRadius: '16px',
        boxShadow: isDarkMode 
          ? '0 8px 32px rgba(0, 0, 0, 0.4)' // Stronger shadow for better visibility in dark mode
          : '0 8px 24px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden' // Ensure content stays within the panel when collapsing
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isExpanded ? 'space-between' : 'center',
          mb: isExpanded ? 2 : 0,
          pt: 2,
          px: 2,
          pb: isExpanded ? 0 : 2
        }}
      >
        {isExpanded && (
          <Typography 
            component={motion.div}
            layout
            variant="subtitle1" 
            sx={{ 
              fontWeight: 600, 
              display: 'flex', 
              alignItems: 'center',
              color: isDarkMode ? '#fff' : theme.palette.text.primary // Explicit white color in dark mode for better visibility
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: theme.palette.primary.main,
                color: '#fff',
                borderRadius: '8px',
                p: 0.8,
                mr: 1.5,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}
            >
              <SvgIcon fontSize="small">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                </svg>
              </SvgIcon>
            </Box>
            Map Filters
          </Typography>
        )}
        
        <Tooltip title={isExpanded ? "Collapse panel" : "Expand panel"} arrow>
          <IconButton 
            onClick={toggleExpanded}
            component={motion.button}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            size="small"
            sx={{
              bgcolor: theme.palette.primary.main,
              color: '#fff',
              p: 1,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              },
              transition: 'background-color 0.3s',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)'
            }}
          >
            <SvgIcon fontSize="small">
              {isExpanded ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 15l-6-6-6 6" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              )}
            </SvgIcon>
          </IconButton>
        </Tooltip>
      </Box>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <Box sx={{ px: 2, pb: 2 }}>
              {/* Map Style Selector - Inline version */}
              <Box sx={{ mb: 2 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 1, 
                    fontWeight: 600, 
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : theme.palette.text.primary
                  }}
                >
                  Map Style:
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                  <StyleButton
                    label="Light"
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="4"/>
                        <path d="M12 2v2"/>
                        <path d="M12 20v2"/>
                        <path d="m4.93 4.93 1.41 1.41"/>
                        <path d="m17.66 17.66 1.41 1.41"/>
                        <path d="M2 12h2"/>
                        <path d="M20 12h2"/>
                        <path d="m6.34 17.66-1.41 1.41"/>
                        <path d="m19.07 4.93-1.41 1.41"/>
                      </svg>
                    }
                    onClick={() => {
                      if (mapInstance && mapInstance.setMapTypeId) {
                        mapInstance.setMapTypeId('roadmap');
                      }
                    }}
                    color="#4f46e5"
                    isDarkMode={isDarkMode}
                  />
                  
                  <StyleButton
                    label="Dark"
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                      </svg>
                    }
                    onClick={() => {
                      if (mapInstance && mapInstance.setMapTypeId) {
                        mapInstance.setMapTypeId('roadmap');
                      }
                    }}
                    color="#6366f1"
                    isDarkMode={isDarkMode}
                  />
                  
                  <StyleButton
                    label="Satellite"
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 8V5c0-1 1-2 2-2h4c1 0 2 1 2 2v3"/>
                        <path d="M18 8H6a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1Z"/>
                        <path d="M12 12v3"/>
                        <path d="M2 19h20"/>
                      </svg>
                    }
                    onClick={() => {
                      if (window.google && window.google.maps && mapInstance) {
                        mapInstance.setMapTypeId('satellite');
                      }
                    }}
                    color="#64748b"
                    isDarkMode={isDarkMode}
                  />
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 1, 
                    fontWeight: 600, 
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : theme.palette.text.primary
                  }}
                >
                  Show on Map:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FilterOption
                    label="Employees"
                    checked={filters.employees}
                    onChange={() => handleFilterChange('employees')}
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    }
                    color="#4f46e5"
                  />
                  <FilterOption
                    label="Customers"
                    checked={filters.customers}
                    onChange={() => handleFilterChange('customers')}
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                      </svg>
                    }
                    color="#0ea5e9"
                  />
                  <FilterOption
                    label="Branches"
                    checked={filters.branches}
                    onChange={() => handleFilterChange('branches')}
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                    }
                    color="#f59e0b"
                  />
                </Box>
              </Box>

              <Box sx={{ mb: 1.5 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 1, 
                    fontWeight: 600, 
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : theme.palette.text.primary
                  }}
                >
                  Display Options:
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={clusteringEnabled}
                      onChange={onClusteringToggle}
                      color="primary"
                      size="small"
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: theme.palette.primary.main
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: `${theme.palette.primary.main}80`
                        }
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SvgIcon fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="18" cy="18" r="3"></circle>
                          <circle cx="6" cy="6" r="3"></circle>
                          <path d="M13 6h3a2 2 0 0 1 2 2v7"></path>
                          <path d="M11 18H8a2 2 0 0 1-2-2V9"></path>
                        </svg>
                      </SvgIcon>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 500,
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : theme.palette.text.primary
                        }}
                      >
                        Enable Clustering
                      </Typography>
                    </Box>
                  }
                  sx={{ ml: 0 }}
                />
              </Box>

              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block', 
                  textAlign: 'center', 
                  mt: 2,
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : theme.palette.text.secondary,
                  fontStyle: 'italic'
                }}
              >
                Adjust filters to customize map view
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Paper>
  );
};

// Custom styled filter option
const FilterOption = ({ label, checked, onChange, icon, color }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Tooltip 
      title={checked ? `Hide ${label}` : `Show ${label}`} 
      placement="left"
      TransitionComponent={Fade}
      arrow
    >
      <Box
        component={motion.div}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: checked 
            ? isDarkMode ? `${color}30` : `${color}20`
            : isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
          borderRadius: '12px',
          p: 1,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          border: `1px solid ${checked ? `${color}${isDarkMode ? '70' : '50'}` : isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}`,
          '&:hover': {
            backgroundColor: checked 
              ? isDarkMode ? `${color}40` : `${color}30`
              : isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.07)'
          },
          boxShadow: checked ? (isDarkMode ? `0 0 8px ${color}40` : 'none') : 'none'
        }}
        onClick={onChange}
      >
        <Checkbox
          checked={checked}
          onChange={onChange}
          size="small"
          sx={{
            color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)',
            p: 0.5,
            mr: 1,
            '&.Mui-checked': {
              color: color
            },
            '& .MuiSvgIcon-root': {
              fontSize: '1.25rem',
              filter: isDarkMode && checked ? 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.5))' : 'none'
            }
          }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SvgIcon 
            fontSize="small" 
            sx={{ 
              mr: 1, 
              color: checked ? color : isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary',
              fontSize: '1.1rem'
            }}
          >
            {icon}
          </SvgIcon>
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: checked ? 600 : 500,
              color: isDarkMode 
                ? (checked ? '#fff' : 'rgba(255, 255, 255, 0.7)') 
                : (checked ? theme.palette.text.primary : theme.palette.text.secondary)
            }}
          >
            {label}
          </Typography>
        </Box>
      </Box>
    </Tooltip>
  );
};

// Map style button component
const StyleButton = ({ label, icon, onClick, color, isDarkMode }) => {
  return (
    <Tooltip title={label} placement="top" arrow>
      <Box
        component={motion.div}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: isDarkMode ? `${color}20` : `${color}10`,
          borderRadius: '10px',
          py: 1,
          px: 1,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          border: `1px solid ${isDarkMode ? `${color}40` : `${color}30`}`,
          '&:hover': {
            backgroundColor: isDarkMode ? `${color}30` : `${color}20`,
            boxShadow: `0 4px 12px ${color}30`
          }
        }}
        onClick={onClick}
      >
        <SvgIcon
          fontSize="small"
          sx={{ 
            color: isDarkMode ? color : color,
            mb: 0.5
          }}
        >
          {icon}
        </SvgIcon>
        <Typography 
          variant="caption"
          sx={{ 
            fontWeight: 500, 
            color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)'
          }}
        >
          {label}
        </Typography>
      </Box>
    </Tooltip>
  );
};

export default FilterPanel;
