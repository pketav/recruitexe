import React from 'react';

import { Button } from '@mui/material';

import { styled } from '@mui/system';

// Using the 'styled' utility from MUI for customization
const CustomButton = styled(Button)(({ theme }) => ({
  padding: '12px 20px',
  fontSize: '14px',
  fontWeight: 'bold',
  borderRadius: '8px',
  textTransform: 'none',
  
  // Default linear-gradient background for the button
  background: 'linear-gradient(279.48deg, #5035FE -2.6%, #910BFF 97.7%)',
  color: theme.palette.common.white, // Text color for the button
  border: 'none', // Remove default border

  // Apply the gradient background for hover state
  '&:hover': {
    background: 'linear-gradient(279.48deg, #2405EE -2.6%, #46027D 97.7%)',
  },
  ':disabled':{
    color: '#fff'
  },
  // Optional: For active state
  '&:active': {
    background: 'linear-gradient(279.48deg, #2405EE -2.6%, #46027D 97.7%)',
  },
}));

// Reusable Button component to wrap the CustomButton
const SubmitButton = ({ children, onClick, ...props }) => {
  return (
    <CustomButton onClick={onClick} {...props}>
      {children}
    </CustomButton>
  );
};

export default SubmitButton;
