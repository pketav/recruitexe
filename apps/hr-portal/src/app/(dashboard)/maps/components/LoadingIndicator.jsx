import React from 'react';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

const LoadingIndicator = ({ loading }) => {
  return (
    <Fade in={loading}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.85)',
          zIndex: 10,
          backdropFilter: 'blur(3px)'
        }}
      >
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 2,
            p: 4,
            boxShadow: 3,
            textAlign: 'center',
            maxWidth: 300
          }}
        >
          <CircularProgress size={48} sx={{ mb: 2, color: 'primary.main' }} />
          <Typography variant="h6" component="div" sx={{ mb: 1 }}>
            Loading Map Data
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please wait while we initialize the mapping application...
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
};

export default LoadingIndicator;
