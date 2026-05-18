"use client"

import { useState } from "react"
import { Box, Tabs, Tab, Typography, Paper, styled, IconButton } from "@mui/material"
import FlightIcon from "@mui/icons-material/Flight"
import ReceiptIcon from "@mui/icons-material/Receipt"
import BarChartIcon from "@mui/icons-material/BarChart"
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import LocalOfferIcon from "@mui/icons-material/LocalOffer"
import AccountBalanceIcon from "@mui/icons-material/AccountBalance"
import PeopleIcon from "@mui/icons-material/People"
import GridViewIcon from "@mui/icons-material/GridView"
import StorefrontIcon from "@mui/icons-material/Storefront"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import Trips from "../trips"
import CategorySettings from "../categorySettings/page"

// Define tab colors
const tabColors = [
  "#4299E1", // Blue
  "#F56565", // Red
  "#48BB78", // Green
  "#ED8936", // Orange
  "#9F7AEA", // Purple
  "#38B2AC", // Teal
  "#ED64A6", // Pink
  "#ECC94B", // Yellow
  "#667EEA", // Indigo
  "#FC8181", // Light Red
]

// Custom styled Tab component for horizontal tabs
const StyledTab = styled(Tab)(({ theme, index }) => ({
  minHeight: 48,
  padding: "12px 16px",
  textTransform: "none",
  fontWeight: 500,
  fontSize: 14,
  color: "#4a5568",
  transition: "all 0.3s ease",
  marginRight: 4, // Add equal right margin to each tab
  "& .MuiTab-iconWrapper": {
    marginRight: 8,
    marginBottom: "0 !important",
    color: tabColors[index % tabColors.length],
  },
  "&.Mui-selected": {
    color: tabColors[index % tabColors.length],
    fontWeight: 600,
    backgroundColor: `${tabColors[index % tabColors.length]}10`,
    borderBottom: `3px solid ${tabColors[index % tabColors.length]}`,
  },
  "&:hover": {
    backgroundColor: `${tabColors[index % tabColors.length]}10`,
    color: tabColors[index % tabColors.length],
  },
}))

// TabPanel component to display content for each tab
function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      style={{ width: "100%" }}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  }
}

const Module = () => {
  const [value, setValue] = useState(0)
  const [navigationHistory, setNavigationHistory] = useState([])

  const handleChange = (event, newValue) => {
    setNavigationHistory([...navigationHistory, value])
    setValue(newValue)
  }

  // Tab data with icons and labels
  const tabData = [
    { label: "Trips", icon: <FlightIcon />, component: <Trips color={tabColors[0]} /> },

    {
      label: "Expenses",
      icon: <ReceiptIcon />,
      message: "This is the Expenses tab content. Track and manage your expenses here.",
    },
    {
      label: "Reports",
      icon: <BarChartIcon />,
      message: "This is the Reports tab content. View financial reports and analytics.",
    },
    {
      label: "Advances",
      icon: <AccountBalanceWalletIcon />,
      message: "This is the Advances tab content. Manage cash advances here.",
    },
    {
      label: "Purchase Requests",
      icon: <ShoppingCartIcon />,
      message: "This is the Purchase Requests tab content. Create and track purchase requests.",
    },
    {
      label: "Categories",
      icon: <LocalOfferIcon />,
      component: <CategorySettings color={tabColors[5]} />,
      //   message: "This is the Categories tab content. Manage expense categories.",
    },
    {
      label: "Paid Through Accounts",
      icon: <AccountBalanceIcon />,
      message: "This is the Paid Through Accounts tab content. Manage payment accounts.",
    },
    {
      label: "Customers",
      icon: <PeopleIcon />,
      message: "This is the Customers tab content. Manage customer information.",
    },
    {
      label: "Projects",
      icon: <GridViewIcon />,
      message: "This is the Projects tab content. Track and manage projects.",
    },
    {
      label: "Merchants",
      icon: <StorefrontIcon />,
      message: "This is the Merchants tab content. Manage vendor information.",
    },
  ]

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "#f8fafc",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1,
          bgcolor: "#fff",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <IconButton
          onClick={() => {
            if (navigationHistory.length > 0) {
              const prevTab = navigationHistory.pop()
              setNavigationHistory([...navigationHistory])
              setValue(prevTab)
            }
          }}
          disabled={navigationHistory.length === 0}
          sx={{
            mr: 1,
            color: navigationHistory.length === 0 ? "#CBD5E0" : tabColors[0],
            "&:hover": {
              bgcolor: `${tabColors[0]}10`,
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="subtitle1" fontWeight={500}>
          {navigationHistory.length > 0
            ? "Back to " + tabData[navigationHistory[navigationHistory.length - 1]]?.label
            : ""}
        </Typography>
      </Box>
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          borderRadius: 0,
          background: "linear-gradient(to right, #f8fafc, #edf2f7)",
        }}
      >
        <Tabs
          orientation="horizontal"
          variant="scrollable"
          scrollButtons="auto"
          value={value}
          onChange={handleChange}
          aria-label="Navigation tabs"
          sx={{
            "& .MuiTabs-indicator": {
              display: "none",
            },
            "& .MuiTabs-scrollButtons": {
              color: "#4a5568",
              "&.Mui-disabled": {
                opacity: 0.3,
              },
            },
            "& .MuiTabs-flexContainer": {
              gap: 8, // Add equal gap between tabs
              justifyContent: "flex-start", // Ensure consistent alignment
            },
          }}
        >
          {tabData.map((tab, index) => (
            <StyledTab key={index} icon={tab.icon} label={tab.label} index={index} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Paper>

      {/* Tab content panels */}
      <Box sx={{ flexGrow: 1, overflow: "auto", backgroundColor: "#f8fafc" }}>
        {tabData.map((tab, index) => (
          <TabPanel key={index} value={value} index={index}>
            {tab.component}
          </TabPanel>
        ))}
      </Box>
    </Box>
  )
}

export default Module
