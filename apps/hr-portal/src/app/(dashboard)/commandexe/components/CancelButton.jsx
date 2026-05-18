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
  background: '#413F4F33',
  color: '#475467', // Text color for the button
  border: 'none', // Remove default border

  // Apply the gradient background for hover state
  '&:hover': {
    background: '#98A2B326  ',
  },

  // Optional: For active state
  '&:active': {
    background: '#98A2B326',
  },
}));

// Reusable Button component to wrap the CustomButton
const CancelButton = ({ children, onClick, ...props }) => {
  return (
    <CustomButton onClick={onClick} {...props}>
      {children}
    </CustomButton>
  );
};

export default CancelButton;
