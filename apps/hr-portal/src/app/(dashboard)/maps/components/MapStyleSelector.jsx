import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Tooltip from '@mui/material/Tooltip';
import SvgIcon from '@mui/material/SvgIcon';
import { motion } from 'framer-motion';

const MapStyleSelector = ({ onStyleChange }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [mapStyle, setMapStyle] = useState('8f065e2dc73e4456'); // Light mode map ID

  const handleStyleChange = (event, newStyle) => {
    if (newStyle !== null) {
      setMapStyle(newStyle);
      onStyleChange(newStyle);
    }
  };

  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      elevation={isDarkMode ? 6 : 2}
      sx={{
        // position: 'absolute',
        // top: '90px', // Positioned below the filter panel to avoid overlap
        // right: '16px',
        
        zIndex: 10,
        p: 1.2,
        marginTop:2,
        marginBottom:2,
        backgroundColor: isDarkMode 
          ? 'rgba(30, 41, 59, 0.9)'
          : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        border: isDarkMode 
          ? '1px solid rgba(255, 255, 255, 0.15)'
          : '1px solid rgba(0, 0, 0, 0.08)',
        borderRadius: '16px',
        boxShadow: isDarkMode 
          ? '0 8px 32px rgba(0, 0, 0, 0.4)'
          : '0 8px 24px rgba(0, 0, 0, 0.1)'
      }}
    >
      <ToggleButtonGroup
        value={mapStyle}
        exclusive
        onChange={handleStyleChange}
        aria-label="map style"
        size="small"
        sx={{
          display:'flex',
        justifyContent:'space-between',
          '.MuiToggleButtonGroup-grouped': {
            border: 0,
            
            borderRadius: '12px !important', // Ensure all buttons have rounded corners
            mx: 0.5,
            '&.Mui-selected': {
              boxShadow: isDarkMode 
                ? '0 0 10px rgba(255, 255, 255, 0.2)'
                : '0 2px 8px rgba(0, 0, 0, 0.1)'
            }
          }
        }}
      >
        <StyleButton
          value="8f065e2dc73e4456" // Light mode map ID
          tooltip="Light Mode"
          selected={mapStyle === '8f065e2dc73e4456'}
          isDarkMode={isDarkMode}
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
        />
        
        <StyleButton
          value="dark" // Dark mode map ID
          tooltip="Dark Mode"
          selected={mapStyle === 'dark'}
          isDarkMode={isDarkMode}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
            </svg>
          }
        />
        
        <StyleButton
          value="satellite"
          tooltip="Satellite View"
          selected={mapStyle === 'satellite'}
          isDarkMode={isDarkMode}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 8V5c0-1 1-2 2-2h4c1 0 2 1 2 2v3"/>
              <path d="M18 8H6a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1Z"/>
              <path d="M12 12v3"/>
              <path d="M2 19h20"/>
            </svg>
          }
        />
      </ToggleButtonGroup>
    </Paper>
  );
};

// Custom style button component with tooltip
const StyleButton = ({ value, tooltip, selected, isDarkMode, icon }) => {
  return (
    <Tooltip title={tooltip} placement="top" arrow>
      <ToggleButton
        component={motion.button}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        value={value}
        aria-label={tooltip}
        sx={{
          p: 1.2,
          bgcolor: selected 
            ? (isDarkMode ? 'rgba(79, 70, 229, 0.3)' : 'rgba(79, 70, 229, 0.1)')
            : 'transparent',
          color: selected 
            ? (isDarkMode ? '#fff' : theme => theme.palette.primary.main)
            : (isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'),
          borderRadius: '12px',
          '&:hover': {
            bgcolor: selected 
              ? (isDarkMode ? 'rgba(79, 70, 229, 0.4)' : 'rgba(79, 70, 229, 0.15)')
              : (isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)')
          },
          border: selected 
            ? (isDarkMode ? '1px solid rgba(79, 70, 229, 0.6)' : '1px solid rgba(79, 70, 229, 0.3)')
            : (isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent')
        }}
      >
        <SvgIcon fontSize="small">
          {icon}
        </SvgIcon>
      </ToggleButton>
    </Tooltip>
  );
};

export default MapStyleSelector;
