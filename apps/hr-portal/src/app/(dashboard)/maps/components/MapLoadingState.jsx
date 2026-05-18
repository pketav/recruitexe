import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import SvgIcon from '@mui/material/SvgIcon';

const MapLoadingState = () => {
  return (
    <Box 
      sx={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: 2,
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: 'background.paper',
          width: 300
        }}
      >
        <Box sx={{ position: 'relative', height: 80, width: 80 }}>
          <CircularProgress 
            size={80}
            thickness={4}
            sx={{ position: 'absolute' }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.main'
            }}
          >
            <SvgIcon sx={{ fontSize: 40 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="10" r="3"></circle>
                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"></path>
              </svg>
            </SvgIcon>
          </Box>
        </Box>
        
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Loading Map
        </Typography>
        
        <Typography variant="body2" color="text.secondary" align="center">
          Preparing your location tracking interface...
        </Typography>
      </Box>
    </Box>
  );
};

export default MapLoadingState;
