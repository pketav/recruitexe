"use client"

import { useState } from "react"
import { Box, Tabs, Tab, Typography, Paper, Container } from "@mui/material"
import { Settings, ListAlt, CheckCircle } from "@mui/icons-material"
import Preference from "./preference"
import Fields from "./fields"
// TabPanel component to handle tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`trips-tabpanel-${index}`}
      aria-labelledby={`trips-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

// Function to generate a11y props for tabs
function a11yProps(index) {
  return {
    id: `trips-tab-${index}`,
    "aria-controls": `trips-tabpanel-${index}`,
  }
}

export default function Trips() {
  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Container maxWidth="xxl" sx={{ mt: 1, mb: 4 }}>
      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "#f5f5f5" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="trips tabs"
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab icon={<Settings fontSize="small" />} iconPosition="start" label="Preferences" {...a11yProps(0)} />
            <Tab icon={<ListAlt fontSize="small" />} iconPosition="start" label="Fields" {...a11yProps(1)} />
            <Tab icon={<CheckCircle fontSize="small" />} iconPosition="start" label="Approvals" {...a11yProps(2)} />
          </Tabs>
        </Box>

        {/* Preferences Tab */}
        <TabPanel value={value} index={0}>
          <Typography variant="h6">Preferences Content</Typography>
          <Typography paragraph>
            This is the Preferences tab content. You can add your custom preferences components here.
          </Typography>
          <Preference/>
        </TabPanel>

        {/* Fields Tab */}
        <TabPanel value={value} index={1}>
          <Typography variant="h6">Fields Content</Typography>
          <Typography paragraph>
            This is the Fields tab content. You can add your custom fields components here.
          </Typography>
          <Fields/>
        </TabPanel>

        {/* Approvals Tab */}
        <TabPanel value={value} index={2}>
          <Typography variant="h6">Approvals Content</Typography>
          <Typography paragraph>
            This is the Approvals tab content. You can add your custom approvals components here.
          </Typography>
        </TabPanel>
      </Paper>
    </Container>
  )
}
