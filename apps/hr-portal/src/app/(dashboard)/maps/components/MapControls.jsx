import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Tooltip from '@mui/material/Tooltip';
import SvgIcon from '@mui/material/SvgIcon';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { useMap } from '@vis.gl/react-google-maps';

const MapControls = ({ onMapTypeChange, onMapFeatureToggle }) => {
  const [mapType, setMapType] = useState('roadmap');
  const [open, setOpen] = useState(false);
  const map = useMap();
  
  const handleMapTypeChange = (event, newMapType) => {
    if (newMapType !== null) {
      setMapType(newMapType);
      if (map) {
        map.setMapTypeId(newMapType);
      }
      if (onMapTypeChange) {
        onMapTypeChange(newMapType);
      }
    }
  };
  
  const handleToggleTraffic = () => {
    if (map) {
      const trafficLayer = new google.maps.TrafficLayer();
      trafficLayer.setMap(map);
      
      if (onMapFeatureToggle) {
        onMapFeatureToggle('traffic');
      }
    }
    setOpen(false);
  };
  
  const handleToggleTransit = () => {
    if (map) {
      const transitLayer = new google.maps.TransitLayer();
      transitLayer.setMap(map);
      
      if (onMapFeatureToggle) {
        onMapFeatureToggle('transit');
      }
    }
    setOpen(false);
  };
  
  const handleRecenter = () => {
    if (map) {
      // Default center - Delhi
      map.setCenter({ lat: 28.6139, lng: 77.2090 });
      map.setZoom(12);
      
      if (onMapFeatureToggle) {
        onMapFeatureToggle('recenter');
      }
    }
    setOpen(false);
  };
  
  const actions = [
    { 
      icon: (
        <SvgIcon>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
          </svg>
        </SvgIcon>
      ), 
      name: 'Recenter Map', 
      action: handleRecenter 
    },
    { 
      icon: (
        <SvgIcon>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="16" height="16" x="4" y="4" rx="2"></rect>
            <path d="M4 12h16"></path>
            <path d="M12 4v16"></path>
          </svg>
        </SvgIcon>
      ), 
      name: 'Show Traffic', 
      action: handleToggleTraffic 
    },
    { 
      icon: (
        <SvgIcon>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 11a9 9 0 0 1 9 9"></path>
            <path d="M4 4a16 16 0 0 1 16 16"></path>
            <circle cx="5" cy="19" r="2"></circle>
          </svg>
        </SvgIcon>
      ), 
      name: 'Show Transit', 
      action: handleToggleTransit 
    },
  ];
  
  return (
    <Box>
      {/* Map Type Controls */}
      <Paper 
        elevation={3}
        sx={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          p: 0.5,
          borderRadius: '8px'
        }}
      >
        <ToggleButtonGroup
          value={mapType}
          exclusive
          onChange={handleMapTypeChange}
          aria-label="map type"
          size="small"
        >
          <ToggleButton value="roadmap" aria-label="roadmap">
            <Tooltip title="Road Map">
              <SvgIcon fontSize="small">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h4"></path>
                  <path d="M7 18H3"></path>
                  <path d="M5 12h14"></path>
                  <path d="M17 6h4"></path>
                  <path d="M21 18h-4"></path>
                </svg>
              </SvgIcon>
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="satellite" aria-label="satellite">
            <Tooltip title="Satellite">
              <SvgIcon fontSize="small">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" x2="22" y1="12" y2="12"></line>
                  <line x1="12" x2="12" y1="2" y2="22"></line>
                </svg>
              </SvgIcon>
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="hybrid" aria-label="hybrid">
            <Tooltip title="Hybrid">
              <SvgIcon fontSize="small">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                  <path d="M2 12h20"></path>
                </svg>
              </SvgIcon>
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="terrain" aria-label="terrain">
            <Tooltip title="Terrain">
              <SvgIcon fontSize="small">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 22l10-10 2 2 7-7"></path>
                  <path d="m16 8 2 2 4-4"></path>
                  <path d="M7 16 L22 16"></path>
                </svg>
              </SvgIcon>
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </Paper>
      
      {/* Additional map controls */}
      <SpeedDial
        ariaLabel="Map controls"
        sx={{
          position: 'absolute',
          bottom: 20,
          right: 20
        }}
        icon={<SpeedDialIcon />}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        direction="up"
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={action.action}
          />
        ))}
      </SpeedDial>
    </Box>
  );
};

export default MapControls;
