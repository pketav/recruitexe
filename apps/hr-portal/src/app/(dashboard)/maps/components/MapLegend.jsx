import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';

const LegendItem = ({ color, label, icon }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
    <Box 
      sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 24, 
        height: 24, 
        borderRadius: icon ? '50%' : '4px',
        bgcolor: color,
        mr: 1.5,
        color: 'white'
      }}
    >
      {icon && (
        <SvgIcon fontSize="small">
          {icon}
        </SvgIcon>
      )}
    </Box>
    <Typography variant="body2">{label}</Typography>
  </Box>
);

const MapLegend = () => {
  const [expanded, setExpanded] = useState(true);
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        position: 'absolute',
        bottom: '20px',
        right: '10px',
        borderRadius: '8px',
        overflow: 'hidden',
        zIndex: 1,
        width: '220px'
      }}
    >
      <Box 
        sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 1.5,
          cursor: 'pointer',
          bgcolor: 'background.paper'
        }}
        onClick={toggleExpanded}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SvgIcon sx={{ color: 'info.main', mr: 1 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="8" height="8" x="3" y="3" rx="2" />
              <rect width="8" height="8" x="13" y="3" rx="2" />
              <rect width="8" height="8" x="3" y="13" rx="2" />
              <rect width="8" height="8" x="13" y="13" rx="2" />
            </svg>
          </SvgIcon>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Map Legend
          </Typography>
        </Box>
        <IconButton 
          size="small" 
          sx={{ p: 0.5 }}
          onClick={(e) => {
            e.stopPropagation();
            toggleExpanded();
          }}
        >
          <SvgIcon fontSize="small">
            {expanded ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m18 15-6-6-6 6"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            )}
          </SvgIcon>
        </IconButton>
      </Box>
      
      <Collapse in={expanded}>
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 500, color: 'text.secondary' }}>
            Marker Types
          </Typography>
          
          <LegendItem 
            color="#4f46e5" 
            label="Employee" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            }
          />
          
          <LegendItem 
            color="#0ea5e9" 
            label="Customer" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            }
          />
          
          <LegendItem 
            color="#ca8a04" 
            label="Branch" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            }
          />
          
          <Divider sx={{ my: 1.5 }} />
          
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 500, color: 'text.secondary' }}>
            Cluster Colors
          </Typography>
          
          <LegendItem color="#4f46e5" label="Employee Cluster" />
          <LegendItem color="#0ea5e9" label="Customer Cluster" />
          <LegendItem color="#ca8a04" label="Branch Cluster" />
          <LegendItem color="#1e40af" label="Mixed Cluster" />
        </Box>
      </Collapse>
    </Paper>
  );
};

export default MapLegend;
