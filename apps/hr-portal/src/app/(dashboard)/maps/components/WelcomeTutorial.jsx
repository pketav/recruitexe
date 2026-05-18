import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import SvgIcon from '@mui/material/SvgIcon';
import Chip from '@mui/material/Chip';
import Fade from '@mui/material/Fade';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const WelcomeTutorial = ({ onClose }) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleComplete = () => {
    onClose();
    // Save to localStorage that tutorial has been viewed
    localStorage.setItem('mapTutorialViewed', 'true');
  };

  const steps = [
    {
      label: 'Welcome to Location Tracker',
      description: (
        <Box>
          <Typography variant="body2" paragraph>
            This interactive map allows you to track employees, customers, and branch offices in real-time. Navigate through this quick tutorial to learn about the key features.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Chip 
              label="Employees" 
              size="small" 
              icon={<CheckCircleIcon fontSize="small" />} 
              color="primary" 
              variant="outlined"
            />
            <Chip 
              label="Customers" 
              size="small" 
              icon={<CheckCircleIcon fontSize="small" />} 
              color="info" 
              variant="outlined"
            />
            <Chip 
              label="Branches" 
              size="small" 
              icon={<CheckCircleIcon fontSize="small" />} 
              color="warning" 
              variant="outlined"
            />
          </Box>
          <Box 
            component="img" 
            src="/images/map-welcome.png" 
            alt="Map Overview" 
            sx={{ 
              width: '100%', 
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              mb: 2,
              display: 'none' // Hidden until you have actual images
            }}
          />
        </Box>
      ),
    },
    {
      label: 'Browsing Locations',
      description: (
        <Box>
          <Typography variant="body2" paragraph>
            Use the sidebar on the left to browse through employees, customers, and branches. Click on any entry to fly to its location on the map.
          </Typography>
          <Typography variant="body2" paragraph>
            The search box at the top of the sidebar allows you to quickly find specific locations by name or other properties.
          </Typography>
          <Box 
            component="img" 
            src="/images/map-sidebar.png" 
            alt="Map Sidebar" 
            sx={{ 
              width: '100%', 
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              mb: 2,
              display: 'none' // Hidden until you have actual images
            }}
          />
        </Box>
      ),
    },
    {
      label: 'Tracking Employees',
      description: (
        <Box>
          <Typography variant="body2" paragraph>
            For employees, you can:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            <li>
              <Typography variant="body2">
                <strong>Track Live:</strong> Follow an employee's current location in real-time
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <strong>View History:</strong> See their movement timeline for a specific date
              </Typography>
            </li>
          </Box>
          <Typography variant="body2" paragraph>
            The timeline panel will appear showing detailed movement history with timestamps.
          </Typography>
          <Box 
            component="img" 
            src="/images/map-tracking.png" 
            alt="Employee Tracking" 
            sx={{ 
              width: '100%', 
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              mb: 2,
              display: 'none' // Hidden until you have actual images
            }}
          />
        </Box>
      ),
    },
    {
      label: 'Map Controls & Filtering',
      description: (
        <Box>
          <Typography variant="body2" paragraph>
            Use the filter panel in the top-right corner to:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            <li>
              <Typography variant="body2">
                Show/hide specific types of locations (employees, customers, branches)
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Toggle marker clustering for better visualization of dense areas
              </Typography>
            </li>
          </Box>
          <Typography variant="body2" paragraph>
            Click on any marker or cluster to view detailed information about the location(s).
          </Typography>
          <Box 
            component="img" 
            src="/images/map-filters.png" 
            alt="Map Filters" 
            sx={{ 
              width: '100%', 
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              mb: 2,
              display: 'none' // Hidden until you have actual images
            }}
          />
        </Box>
      ),
    },
  ];

  return (
    <Fade in={true}>
      <Paper 
        elevation={4}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 500 },
          p: 3,
          zIndex: 1200,
          borderRadius: 2,
          maxHeight: '90vh',
          overflow: 'auto'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <SvgIcon color="primary" sx={{ fontSize: 32, mr: 1.5 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
          </SvgIcon>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            Map Features Guide
          </Typography>
        </Box>
        
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {step.label}
                </Typography>
              </StepLabel>
              <StepContent>
                {step.description}
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      variant="contained"
                      onClick={index === steps.length - 1 ? handleComplete : handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === steps.length - 1 ? 'Finish' : 'Continue'}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        
        {activeStep === steps.length && (
          <Box sx={{ p: 3 }}>
            <Typography>All steps completed - you&apos;re finished</Typography>
            <Button onClick={handleComplete} sx={{ mt: 1, mr: 1 }}>
              Get Started
            </Button>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button 
            size="small" 
            color="inherit" 
            onClick={handleComplete}
            sx={{ textTransform: 'none' }}
          >
            Skip tutorial
          </Button>
        </Box>
      </Paper>
    </Fade>
  );
};

export default WelcomeTutorial;
