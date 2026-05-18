"use client"

import { Container, Tabs, Tab, Box, Paper, Typography, IconButton, Breadcrumbs, useTheme, Link } from "@mui/material"
import { useState } from "react"
import { Analytics, Settings, SmartToy, NavigateNext, Dashboard, ArrowForward } from "@mui/icons-material"
import { styled, alpha } from "@mui/material/styles"
import AIConfigPage from "./aiConfig/page"
import ConfigSettings from "./settings/page"
import { useRouter } from "next/navigation"

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: "100vh",
  background: "#f8fafc",
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(6),
}))

const NavigationCard = styled(Paper)(({ theme }) => ({
  borderRadius: "16px",
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  background: "#ffffff",
  border: "none",
  boxShadow: "none",
}))

const StyledTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  padding: theme.spacing(1),
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  "& .MuiTab-root": {
    fontWeight: 600,
    borderRadius: "8px",
    minHeight: 48,
    textTransform: "none",
    fontSize: "16px",
    color: "#64748b",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#f1f5f9",
      color: "#334155",
    },
    "&.Mui-selected": {
      color: "#6366f1",
      backgroundColor: "#eef2ff",
      boxShadow: "0 2px 4px rgba(99, 102, 241, 0.2)",
    },
  },
  "& .MuiTabs-indicator": {
    display: "none",
  },
}))

export default function AiSetup() {
  const [activeTab, setActiveTab] = useState(0)
  const theme = useTheme()
  const router = useRouter()

  const handleChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  return (
    <StyledContainer maxWidth="xl">
      {/* Navigation Breadcrumbs */}
      {/* <NavigationCard elevation={0} sx={{ display: "flex", justifyContent: "space-between" }}>
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          sx={{
            "& .MuiBreadcrumbs-separator": {
              color: alpha(theme.palette.text.secondary, 0.5),
            },
          }}
        >
          <Link
            underline="hover"
            color="inherit"
            href="#"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: theme.palette.text.secondary,
              "&:hover": { color: theme.palette.primary.main },
            }}
          >
            <Dashboard fontSize="small" />
            Dashboard
          </Link>
          <Typography
            color="text.primary"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              fontWeight: 600,
            }}
          >
            <SmartToy fontSize="small" />
            AI Setup
          </Typography>
        </Breadcrumbs>
        <IconButton onClick={() => router.push("/employeeSetup")}>
          <ArrowForward />
        </IconButton>
      </NavigationCard> */}

      {/* Tab Navigation */}
      {/* <Paper elevation={0} sx={{ borderRadius: 3, mb: 4, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)" }}>
        <StyledTabs value={activeTab} onChange={handleChange} centered>
          <Tab icon={<Analytics />} iconPosition="start" label="Analyzer Rules" />
          <Tab icon={<Settings />} iconPosition="start" label="Configuration" />
        </StyledTabs>
      </Paper> */}

      {/* Tab Content */}
      <Box>
        {/* Analyzer Rules Tab */}
        {activeTab === 0 && <ConfigSettings />}

        {/* Configuration Tab */}
        {activeTab === 1 && <AIConfigPage />}
      </Box>
    </StyledContainer>
  )
}
