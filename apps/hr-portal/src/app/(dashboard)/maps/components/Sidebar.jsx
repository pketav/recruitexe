"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "@mui/material/styles"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import Avatar from "@mui/material/Avatar"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import InputAdornment from "@mui/material/InputAdornment"
import SvgIcon from "@mui/material/SvgIcon"
import Tooltip from "@mui/material/Tooltip"
import Chip from "@mui/material/Chip"
import Badge from "@mui/material/Badge"
import ListItemText from "@mui/material/ListItemText"
import { motion } from "framer-motion" // You'll need to install this package

// Animated Typography component that always renders as a div
const SafeTypography = (props) => <Typography component="div" {...props} />

const Sidebar = ({ onItemClick, onTrackEmployee, onViewEmployeeHistory, employeesData = [], branchesData = [] }) => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === "dark"

  const [activeTab, setActiveTab] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [animateItems, setAnimateItems] = useState(false)
  const tabsContainerRef = useRef(null)

  // Effect to animate items after tab change
  useEffect(() => {
    setAnimateItems(false)
    const timer = setTimeout(() => {
      setAnimateItems(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [activeTab])

  // Effect to center the active tab every time it's clicked
  useEffect(() => {
    const centerActiveTab = () => {
      const container = document.getElementById("tabs-container")
      const activeTabElement = document.querySelector(`#tabs-container [data-tab-id="${activeTab}"]`)

      if (container && activeTabElement) {
        // Calculate the center position
        const containerWidth = container.offsetWidth
        const tabWidth = activeTabElement.offsetWidth
        const tabLeftPosition = activeTabElement.offsetLeft

        // Calculate scroll position to center the tab
        const scrollPosition = tabLeftPosition - containerWidth / 2 + tabWidth / 2

        // Scroll to center the tab
        container.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        })
      }
    }

    // Center the active tab with a slight delay to ensure DOM is updated
    const timerId = setTimeout(centerActiveTab, 150)
    return () => clearTimeout(timerId)
  }, [activeTab])

  const handleTabChange = (newValue) => {
    setActiveTab(newValue)
    setSearchTerm("")
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  // Filter data based on search term
  const filteredEmployees =
    employeesData && Array.isArray(employeesData)
      ? employeesData.filter(
          (employee) =>
            employee &&
            ((employee.employeName &&
              employee.employeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (employee.name && employee.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (employee.currentDesignation &&
                employee.currentDesignation.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (employee.designation && employee.designation.toLowerCase().includes(searchTerm.toLowerCase())))
        )
      : []

  const filteredCustomers = []

  // Add validation to ensure branch data has required fields before filtering
  const filteredBranches =
    branchesData && Array.isArray(branchesData)
      ? branchesData
          .filter((branch) => branch && typeof branch === "object") // Ensure branch is a valid object
          .filter(
            (branch) =>
              (branch.name && branch.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (branch.manager && branch.manager.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (branch.address && branch.address.toLowerCase().includes(searchTerm.toLowerCase()))
          )
      : []

  // Tabs data for easier rendering
  const tabsData = [
    {
      id: 0,
      label: "Employees",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
      count: employeesData ? employeesData.length : 0,
      color: "primary",
    },
    {
      id: 1,
      label: "Customers",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
      ),
      count: 0,
      color: "info",
    },
    {
      id: 2,
      label: "Branches",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),
      count: branchesData ? branchesData.length : 0,
      color: "warning",
    },
  ]

  // Safe function to get initials from a name
  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "?"
    return name
      .split(" ")
      .map((part) => (part && part[0]) || "")
      .join("")
  }

  return (
    <Paper
      elevation={isDarkMode ? 4 : 1}
      className="sidebar-container"
      component={motion.div}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: "320px",
        borderRadius: "0 16px 16px 0",
        borderRight: "none",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        zIndex: 100,
        boxShadow: isDarkMode ? "4px 0 20px rgba(0, 0, 0, 0.3)" : "4px 0 16px rgba(0, 0, 0, 0.06)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2.5,
          pb: 2,
          bgcolor: "background.paper",
          borderBottom: isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.06)",
        }}
      >
        <Typography
          component={motion.div}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          variant="h6"
          sx={{
            mb: 2.5,
            fontWeight: 600,
            color: theme.palette.text.primary,
            fontSize: "1.125rem",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <SvgIcon sx={{ color: theme.palette.primary.main }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="10" r="3" />
              <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
            </svg>
          </SvgIcon>
          Location Explorer
        </Typography>

        <TextField
          fullWidth
          placeholder="Search..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          component={motion.div}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
              color: theme.palette.text.primary,
              borderRadius: "12px",
              height: "42px",
              "& fieldset": {
                borderColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
              },
              "&:hover fieldset": {
                borderColor: theme.palette.primary.main,
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
              },
            },
            "& .MuiInputBase-input::placeholder": {
              color: isDarkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.4)",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SvgIcon
                  fontSize="small"
                  sx={{ color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.5)" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </svg>
                </SvgIcon>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Tabs */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          bgcolor: "background.paper",
          borderBottom: isDarkMode ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid rgba(0, 0, 0, 0.03)",
          position: "relative",
          overflow: "hidden", // Ensure no overflow outside this container
        }}
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {/* Subtle gradient indicators */}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: "20px",
            height: "100%",
            background: `linear-gradient(to right, ${
              isDarkMode ? "rgba(18, 24, 40, 0.8)" : "rgba(255, 255, 255, 0.8)"
            }, transparent)`,
            zIndex: 2,
            pointerEvents: "none",
            opacity: 0.7,
          }}
        />

        <Box
          sx={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: "20px",
            height: "100%",
            background: `linear-gradient(to left, ${
              isDarkMode ? "rgba(18, 24, 40, 0.8)" : "rgba(255, 255, 255, 0.8)"
            }, transparent)`,
            zIndex: 2,
            pointerEvents: "none",
            opacity: 0.7,
          }}
        />

        <Box
          id="tabs-container"
          ref={tabsContainerRef}
          sx={{
            display: "flex",
            bgcolor: isDarkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
            borderRadius: "12px",
            padding: "4px",
            overflowX: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            WebkitOverflowScrolling: "touch",
            scrollBehavior: "smooth",
            cursor: "grab",
            "&:active": {
              cursor: "grabbing",
            },
            // Improve scrolling behavior
            justifyContent: "flex-start",
            mx: 0,
            width: "100%",
          }}
          component={motion.div}
          drag="x"
          dragConstraints={{ left: -500, right: 0 }} // Increased to ensure all tabs can be reached
          dragElastic={0.1} // Reduced elasticity for more precise control
          dragTransition={{
            bounceStiffness: 500,
            bounceDamping: 25,
          }}
        >
          {tabsData.map((tab) => (
            <Box
              key={tab.id}
              data-tab-id={tab.id} // Add attribute for easy DOM selection
              onClick={() => handleTabChange(tab.id)}
              component={motion.div}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              ref={(node) => {
                // Improved scrollIntoView behavior
                if (node && activeTab === tab.id) {
                  // Use a more robust approach to ensure the tab is visible
                  try {
                    const container = document.getElementById("tabs-container")
                    if (container) {
                      // Calculate if the tab is fully visible
                      const containerRect = container.getBoundingClientRect()
                      const tabRect = node.getBoundingClientRect()

                      // If tab is not fully visible (either partially off-screen left or right)
                      if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
                        // Center the tab in the view with smooth behavior
                        container.scrollTo({
                          left: node.offsetLeft + node.offsetWidth / 2 - container.offsetWidth / 2,
                          behavior: "smooth",
                        })
                      }
                    }
                  } catch (e) {
                    // Fallback to simpler method if the above fails
                    setTimeout(() => {
                      node.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                        inline: "center",
                      })
                    }, 150)
                  }
                }
              }}
              sx={{
                minWidth: "100px",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: 1.2,
                px: 1.8,
                mx: 0.3,
                borderRadius: "10px",
                cursor: "pointer",
                backgroundColor: activeTab === tab.id ? `${tab.color}.main` : "transparent",
                color: activeTab === tab.id ? "#fff" : theme.palette.text.primary,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor:
                    activeTab === tab.id
                      ? `${tab.color}.main`
                      : isDarkMode
                      ? "rgba(255, 255, 255, 0.08)"
                      : "rgba(0, 0, 0, 0.05)",
                },
              }}
            >
              <SvgIcon fontSize="small" sx={{ mr: 0.8, opacity: 0.9 }}>
                {tab.icon}
              </SvgIcon>
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 500, whiteSpace: "nowrap" }}>{tab.label}</Typography>
              <Box
                sx={{
                  ml: 0.8,
                  bgcolor: activeTab === tab.id ? "rgba(255, 255, 255, 0.2)" : `${tab.color}.main`,
                  color: "#fff",
                  borderRadius: "20px",
                  px: 1,
                  minWidth: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                }}
              >
                {tab.count}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* List Content */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          bgcolor: "background.paper",
          pt: 1.5,
          scrollbarWidth: "thin",
          scrollbarColor: isDarkMode
            ? "rgba(255, 255, 255, 0.2) rgba(0, 0, 0, 0.2)"
            : "rgba(0, 0, 0, 0.2) rgba(255, 255, 255, 0.1)",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.15)" : "rgba(0, 0, 0, 0.05)",
            borderRadius: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
          },
        }}
      >
        {/* Employees List */}
        {activeTab === 0 && (
          <List sx={{ p: 0 }}>

            {filteredEmployees.length === 0 ? (
              <ListItem>
                <Box sx={{ textAlign: "center", width: "100%", py: 8 }}>
                  <SvgIcon
                    component={motion.svg}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.5 }}
                    transition={{ duration: 0.5 }}
                    sx={{
                      fontSize: 48,
                      color: isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.15)",
                      mb: 1,
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="8" y1="15" x2="16" y2="15"></line>
                      <line x1="9" y1="9" x2="9.01" y2="9"></line>
                      <line x1="15" y1="9" x2="15.01" y2="9"></line>
                    </svg>
                  </SvgIcon>
                  <Typography
                    component={motion.div}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    variant="body2"
                    color={isDarkMode ? "rgba(255, 255, 255, 0.5)" : "text.secondary"}
                  >
                    No employees found
                  </Typography>
                </Box>
              </ListItem>
            ) : (
              filteredEmployees.map((employee, index) => (
                <motion.div
                  key={employee._id || employee.id || `emp-${index}`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={animateItems ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ListItem
                    sx={{
                      py: 2,
                      px: 2.5,
                      transition: "all 0.2s",
                      "&:hover": {
                        backgroundColor: isDarkMode ? "rgba(79, 70, 229, 0.15)" : "rgba(79, 70, 229, 0.08)",
                        transform: "translateY(-2px)",
                      },
                      cursor: "pointer",
                      borderRadius: "12px",
                      mx: 1.5,
                      mb: 0.5,
                    }}
                    onClick={() => onItemClick("employee", employee)}
                  >
                    <ListItemAvatar>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        badgeContent={
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              bgcolor: employee.status === "active" ? "#22c55e" : "#f97316",
                              border: "2px solid",
                              borderColor: isDarkMode ? "#1e1e2d" : "white",
                            }}
                          />
                        }
                      >
                        {employee.employeePhoto || employee.avatar ? (
                          <Avatar
                            src={employee.employeePhoto || employee.avatar}
                            sx={{
                              width: 46,
                              height: 46,
                              border: "2px solid rgba(79, 70, 229, 0.5)",
                              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            }}
                          />
                        ) : (
                          <Avatar
                            sx={{
                              background: "linear-gradient(135deg, #4f46e5, #8b5cf6)",
                              width: 46,
                              height: 46,
                              fontSize: "1.25rem",
                              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
                            }}
                          >
                            {getInitials(employee.employeName || employee.name || "")}
                          </Avatar>
                        )}
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          component="div"
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            mb: 0.5,
                            color: theme.palette.text.primary,
                          }}
                        >
                          {employee.employeName || employee.name || "Unknown Employee"}
                        </Typography>
                      }
                      secondary={
                        <Box component="div">
                          <Box
                            component="span"
                            sx={{
                              display: "block",
                              mb: 1.5,
                              color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "text.secondary",
                              fontSize: "0.875rem",
                            }}
                          >
                            {employee.currentDesignation || employee.designation || employee.role || ""}
                          </Box>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Tooltip title="Track in real-time" arrow>
                              <Box
                                component={motion.div}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: "rgba(79, 70, 229, 0.1)",
                                  borderRadius: "20px",
                                  py: 0.5,
                                  px: 1.5,
                                  cursor: "pointer",
                                  "&:hover": {
                                    backgroundColor: "rgba(79, 70, 229, 0.2)",
                                  },
                                }}
                                onClick={async (e) => {
                                  e.stopPropagation()
                                  await onTrackEmployee(employee._id || employee.id)
                                }}
                              >
                                <SvgIcon fontSize="small" sx={{ fontSize: "0.875rem", color: "#6366f1", mr: 0.5 }}>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <circle cx="12" cy="12" r="4"></circle>
                                  </svg>
                                </SvgIcon>
                                <Typography sx={{ fontSize: "0.75rem", fontWeight: 500, color: "#6366f1" }}>
                                  Track
                                </Typography>
                              </Box>
                            </Tooltip>

                            <Tooltip title="View movement history" arrow>
                              <Box
                                component={motion.div}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: "rgba(168, 85, 247, 0.1)",
                                  borderRadius: "20px",
                                  py: 0.5,
                                  px: 1.5,
                                  cursor: "pointer",
                                  "&:hover": {
                                    backgroundColor: "rgba(168, 85, 247, 0.2)",
                                  },
                                }}
                                onClick={async (e) => {
                                  e.stopPropagation()
                                  await onViewEmployeeHistory(employee._id || employee.id)
                                }}
                              >
                                <SvgIcon fontSize="small" sx={{ fontSize: "0.875rem", color: "#a855f7", mr: 0.5 }}>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                  </svg>
                                </SvgIcon>
                                <Typography sx={{ fontSize: "0.75rem", fontWeight: 500, color: "#a855f7" }}>
                                  History
                                </Typography>
                              </Box>
                            </Tooltip>
                          </Box>
                        </Box>
                      }
                      sx={{ ml: 1 }}
                    />
                  </ListItem>
                </motion.div>
              ))
            )}
          </List>
        )}

        {/* Customers List */}
        {activeTab === 1 && (
          <List sx={{ p: 0 }}>
            {(filteredCustomers || []).length === 0 ? (
              <ListItem>
                <Box sx={{ textAlign: "center", width: "100%", py: 8 }}>
                  <SvgIcon
                    component={motion.svg}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.5 }}
                    transition={{ duration: 0.5 }}
                    sx={{
                      fontSize: 48,
                      color: isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.15)",
                      mb: 1,
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                  </SvgIcon>
                  <Typography
                    component={motion.div}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    variant="body2"
                    color={isDarkMode ? "rgba(255, 255, 255, 0.5)" : "text.secondary"}
                  >
                    No customers found
                  </Typography>
                </Box>
              </ListItem>
            ) : (
              filteredCustomers.map((customer, index) => (
                <motion.div
                  key={customer.id || `customer-${index}`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={animateItems ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ListItem
                    sx={{
                      py: 2,
                      px: 2.5,
                      transition: "all 0.2s",
                      "&:hover": {
                        backgroundColor: isDarkMode ? "rgba(14, 165, 233, 0.15)" : "rgba(14, 165, 233, 0.08)",
                        transform: "translateY(-2px)",
                      },
                      cursor: "pointer",
                      borderRadius: "12px",
                      mx: 1.5,
                      mb: 0.5,
                    }}
                    onClick={() => onItemClick("customer", customer)}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          background: `linear-gradient(135deg, ${getCustomerTypeColor(
                            customer.type
                          )}, ${lightenColor(getCustomerTypeColor(customer.type), 20)})`,
                          width: 46,
                          height: 46,
                          fontSize: "1.25rem",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
                          border: `2px solid ${getCustomerTypeColor(customer.type)}50`,
                        }}
                      >
                        {customer.name && typeof customer.name === "string" ? customer.name.substring(0, 1) : "C"}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          component="div"
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            mb: 0.5,
                            color: theme.palette.text.primary,
                          }}
                        >
                          {customer.name || "Unknown Customer"}
                        </Typography>
                      }
                      secondary={
                        <Box component="div">
                          <Box
                            component="span"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1.5,
                              color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "text.secondary",
                              fontSize: "0.875rem",
                            }}
                          >
                            <SvgIcon fontSize="small" sx={{ mr: 0.5, fontSize: "0.9rem", opacity: 0.7 }}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                              </svg>
                            </SvgIcon>
                            {customer.contactPerson || ""}
                          </Box>
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {customer.type && (
                              <Chip
                                label={customer.type}
                                size="small"
                                component={motion.div}
                                whileHover={{ scale: 1.05 }}
                                sx={{
                                  bgcolor: "rgba(14, 165, 233, 0.15)",
                                  color: "#0ea5e9",
                                  fontWeight: 500,
                                  borderRadius: "8px",
                                  height: "24px",
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      }
                      sx={{ ml: 1 }}
                    />
                  </ListItem>
                </motion.div>
              ))
            )}
          </List>
        )}

        {/* Branches List */}
        {activeTab === 2 && (
          <List sx={{ p: 0 }}>
            {filteredBranches.length === 0 ? (
              <ListItem>
                <Box sx={{ textAlign: "center", width: "100%", py: 8 }}>
                  <SvgIcon
                    component={motion.svg}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.5 }}
                    transition={{ duration: 0.5 }}
                    sx={{
                      fontSize: 48,
                      color: isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.15)",
                      mb: 1,
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                  </SvgIcon>
                  <Typography
                    component={motion.div}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    variant="body2"
                    color={isDarkMode ? "rgba(255, 255, 255, 0.5)" : "text.secondary"}
                  >
                    No branches found
                  </Typography>
                </Box>
              </ListItem>
            ) : (
              filteredBranches.map((branch, index) => (
                <motion.div
                  key={branch._id || branch.id || `branch-${index}`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={animateItems ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ListItem
                    sx={{
                      py: 2,
                      px: 2.5,
                      transition: "all 0.2s",
                      "&:hover": {
                        backgroundColor: isDarkMode ? "rgba(202, 138, 4, 0.15)" : "rgba(202, 138, 4, 0.08)",
                        transform: "translateY(-2px)",
                      },
                      cursor: "pointer",
                      borderRadius: "12px",
                      mx: 1.5,
                      mb: 0.5,
                    }}
                    onClick={() => onItemClick("branch", branch)}
                  >
                    <ListItemAvatar>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        badgeContent={
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              bgcolor:
                                branch.status === "active"
                                  ? "#22c55e"
                                  : branch.status === "inactive"
                                  ? "#94a3b8"
                                  : "#f97316",
                              border: "2px solid",
                              borderColor: isDarkMode ? "#1e1e2d" : "white",
                            }}
                          />
                        }
                      >
                        <Avatar
                          sx={{
                            background: "linear-gradient(135deg, #ca8a04, #eab308)",
                            width: 46,
                            height: 46,
                            fontSize: "1.25rem",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
                            border: "2px solid rgba(202, 138, 4, 0.5)",
                          }}
                        >
                          {branch.name && typeof branch.name === "string" ? branch.name.substring(0, 1) : "B"}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography
                            component="div"
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              mb: 0.5,
                              color: theme.palette.text.primary,
                            }}
                          >
                            {branch.name || "Unknown Branch"}
                          </Typography>

                          {branch.employeeCount && (
                            <Chip
                              label={`${branch.employeeCount} Employees`}
                              size="small"
                              component={motion.div}
                              whileHover={{ scale: 1.05 }}
                              sx={{
                                bgcolor: "rgba(202, 138, 4, 0.12)",
                                color: "#ca8a04",
                                fontWeight: 500,
                                height: "20px",
                                fontSize: "0.7rem",
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box component="div">
                          {branch.manager && (
                            <Box
                              component="span"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 1,
                                color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "text.secondary",
                                fontSize: "0.875rem",
                              }}
                            >
                              <SvgIcon fontSize="small" sx={{ mr: 0.5, fontSize: "0.9rem", opacity: 0.7 }}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                  <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                              </SvgIcon>
                              {branch.manager}
                            </Box>
                          )}

                          {branch.address && (
                            <Box
                              component="span"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 1.5,
                                color: isDarkMode ? "rgba(255, 255, 255, 0.5)" : "text.secondary",
                                fontSize: "0.8rem",
                              }}
                            >
                              <SvgIcon fontSize="small" sx={{ mr: 0.5, fontSize: "0.9rem", opacity: 0.7 }}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                  <circle cx="12" cy="10" r="3" />
                                </svg>
                              </SvgIcon>
                              {branch.address}
                            </Box>
                          )}

                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {branch.type && (
                              <Chip
                                label={branch.type}
                                size="small"
                                component={motion.div}
                                whileHover={{ scale: 1.05 }}
                                sx={{
                                  bgcolor: "rgba(234, 179, 8, 0.15)",
                                  color: "#ca8a04",
                                  fontWeight: 500,
                                  borderRadius: "8px",
                                  height: "24px",
                                }}
                              />
                            )}

                            {branch.openingHours && (
                              <Chip
                                label={branch.openingHours}
                                size="small"
                                component={motion.div}
                                whileHover={{ scale: 1.05 }}
                                sx={{
                                  bgcolor: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
                                  color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "text.secondary",
                                  fontWeight: 400,
                                  borderRadius: "8px",
                                  height: "24px",
                                  fontSize: "0.7rem",
                                }}
                                icon={
                                  <SvgIcon fontSize="small" sx={{ fontSize: "0.7rem" }}>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <circle cx="12" cy="12" r="10" />
                                      <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                  </SvgIcon>
                                }
                              />
                            )}
                          </Box>
                        </Box>
                      }
                      sx={{ ml: 1 }}
                    />
                  </ListItem>
                </motion.div>
              ))
            )}
          </List>
        )}
      </Box>
    </Paper>
  )
}

// Function to get color based on customer type (enhanced with more vibrant colors)
const getCustomerTypeColor = (type) => {
  if (!type) return "#6b7280" // Default gray for undefined type

  switch (type.toLowerCase()) {
    case "corporate":
      return "#0ea5e9" // Sky blue
    case "sme":
      return "#8b5cf6" // Purple
    case "retail":
      return "#f97316" // Orange
    case "startup":
      return "#10b981" // Emerald
    case "healthcare":
      return "#ef4444" // Red
    case "education":
      return "#f59e0b" // Amber
    case "food & beverage":
      return "#ec4899" // Pink
    default:
      return "#6b7280" // Gray
  }
}

// Helper function to lighten a color by a percentage
const lightenColor = (color, percent) => {
  // Remove the # if it exists
  const hex = color.replace("#", "")

  // Convert to RGB
  let r = Number.parseInt(hex.substring(0, 2), 16)
  let g = Number.parseInt(hex.substring(2, 4), 16)
  let b = Number.parseInt(hex.substring(4, 6), 16)

  // Lighten
  r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)))
  g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)))
  b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)))

  // Convert back to hex
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
}

export default Sidebar
