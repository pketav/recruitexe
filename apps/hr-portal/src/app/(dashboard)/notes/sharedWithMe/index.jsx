import React, { useState } from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import  CombinedNotesAndBoard from './combinedNotesAndBoard'


const tabs = ["All", "Notes", "Noteboards"];

export const SharedWithMe = () => {
  const [activeTab, setActiveTab] = useState("Notes");

  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Shared
      </Typography>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 6, flexWrap: 'wrap' }}>
        {tabs.map((tab) => (
          <Button
            size='small'
            key={tab}
            variant={activeTab === tab ? "contained" : "outlined"}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </Button>
        ))}
      </Stack>

      {/* Conditionally render components based on activeTab */}
      {activeTab === "Notes" && <CombinedNotesAndBoard type={'notes'} />}
      {activeTab === "Noteboards" && <CombinedNotesAndBoard type={'board'} />}
      {activeTab === "All" && <CombinedNotesAndBoard type={'all'} />}
    </Box>
  );
};

export default SharedWithMe;
