"use client"

import { useState } from "react"
import { Box, Grid, Container, IconButton, Typography } from "@mui/material"
import { ArrowBack } from "@mui/icons-material"
import SettingsSidebar from "../settingSideBar"
import UserSettings from "../components/userPage"
import PoliciesSettings from "../components/policiesPage"
import ModulesSettings from "../components/policiesPage"
import CategorySettings from "../components/categorySettings/page" 
import Trips from "../components/trips"

const SettingsPage = () => {
  const [activePage, setActivePage] = useState("user")

  // Render the appropriate component based on activePage
  const renderContent = () => {
    switch (activePage) {
      case "user":
        return <UserSettings />
      case "policies":
        return <PoliciesSettings />
      case "modules":
        return <ModulesSettings />
      case "category":
        return <CategorySettings /> 
        case "trips":
        return < Trips/> 
      default:
        return <UserSettings />
    }
  }

  // Function to handle back button click
  const handleBackClick = () => {
    // Navigate back to previous page
    // If using Next.js router:
    // router.back()

    // If using browser history:
    window.history.back()

    // Alternatively, you could navigate to a specific route:
    // router.push('/dashboard')
  }

  // Get the title for the current page
  const getPageTitle = () => {
    switch (activePage) {
      case "user":
        return "User Settings"
      case "policies":
        return "Policies Settings"
      case "modules":
        return "Modules Settings"
      case "category":
        return "Category Settings"
      default:
        return "Settings"
    }
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      {/* Back button and page title */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={handleBackClick} sx={{ mr: 1 }} aria-label="back">
          <ArrowBack />
        </IconButton>
        <Typography variant="h5">{getPageTitle()}</Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <SettingsSidebar activePage={activePage} setActivePage={setActivePage} />
        </Grid>
        <Grid item xs={12} md={9}>
          {renderContent()}
        </Grid>
      </Grid>
    </Container>
  )
}

export default SettingsPage
