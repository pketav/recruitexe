"use client"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import PersonPinCircleOutlinedIcon from '@mui/icons-material/PersonPinCircleOutlined';
import Link from "next/link"

// MUI Imports
import { useTheme } from "@mui/material/styles"
import {
  Box,
  CircularProgress,
  Alert,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Divider,
} from "@mui/material"
import {
  ChevronRight,
  HomeOutlined,
  SettingsOutlined,
  WorkOutline,
  PeopleOutline,
  StickyNote2Outlined,
  AdminPanelSettingsOutlined,
  AccountBalanceWalletOutlined,
  DashboardOutlined,
  LinkedIn,
  PostAddOutlined,
  AddOutlined,
  AssignmentOutlined,
  BusinessOutlined,
  MonetizationOnOutlined,
  ReceiptLongOutlined,
  FolderOpenOutlined,
  AnalyticsOutlined,
  TrendingUpOutlined,
  ApprovalOutlined,
  NewReleasesOutlined,
  WorkspacePremium,
  Assignment,
  Description,
  Monitor,
  DialerSipOutlined,
  ViewAgendaTwoTone,
  Chat,
  Storefront,
  InsertChartOutlinedOutlined as BarChartOutlined,
  DescriptionOutlined,
  AddBusinessOutlined,
  BusinessCenterOutlined,
  FileOpenOutlined
} from "@mui/icons-material"

// Third-party Imports
import PerfectScrollbar from "react-perfect-scrollbar"

// Component Imports
import UserDropdown from "../shared/UserDropdown"
import { useAuth } from "@/context/AuthContext"

// Hook Imports
import useVerticalNav from "@menu/hooks/useVerticalNav"

const useApi = () => ({
  callApi: async ({ endpoint, method, disableSnackbar }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
      if (!baseUrl) {
        return {
          success: false,
          message: "API base URL is not configured",
        }
      }
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method,
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      return {
        success: data.status,
        data: data,
        message: data.message,
      }
    } catch (error) {
      return {
        success: false,
        message: "API Error",
        error,
      }
    }
  },
})

const demoPermissions = {
  fileManager: true,
  notes: true,
  chat: true,
  RecruitmentHiring: {
    agencySetup: true,
    jobPostDashboard: {
      canViewSelf: true,
      canViewAll: true,
      newJobPost: true,
    },
    jobApplications: {
      canViewSelf: true,
      canViewAll: true,
      canUpdate: true,
    },
    linkedin: {
      setup: true,
      dashboard: true,
      createPost: true,
      schedule: true,
    },
  },
  InterviewManagement: {
    interviewCanViewAll: true,
    interviewCanViewSelf: true,
    createInterview: true,
  },
  permissions: {
    InterviewManagement: true,
    CommandExe: true,
    verificationSuite: true,
  },
  expenseManagement: {
    expensePoliciesSetup: true,
    expenseConfigSetup: true,
    expenseCategoriesSetup: true,
    expenseTypesSetup: true,
    expenseRolePermissionSetup: true,
  },
  CommandExe: {
    addCase: true,
    backOffice: true,
    invoice: true,
  },
}

const ScrollWrapper = ({ children, ...props }) => {
  if (typeof window === "undefined") {
    return <Box {...props}>{children}</Box>
  } else {
    return <PerfectScrollbar {...props}>{children}</PerfectScrollbar>
  }
}

const VerticalMenu = ({ scrollMenu }) => {
  // Use the actual useVerticalNav hook
  const { isCollapsed, isHovered } = useVerticalNav()
  const actualCollapsed = isCollapsed // Renamed for clarity, but it's the same as isCollapsed
  const theme = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const { callApi } = useApi()
  const { userData } = useAuth()

  const [permissions, setPermissions] = useState(null)  
  const [permissionsLoaded, setPermissionsLoaded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedMenus, setExpandedMenus] = useState({
    talentAcquisition: false,
    jobPost: false,
    jobApplication: false,
    linkedInPost: false,
    socialmediam: false,
    expenses: false,
    FileManagerNew: false,
    commandExe: false,
    caseList: false,
    InterviewMonitor: false,
    utilities: false,
  })

  const hasAdminRole = userData?.role?.some((role) => role.toLowerCase().includes("admin"))

  // Check if current path is active
  const isActiveRoute = (path) => {
    if (path === "/home" && (pathname === "/" || pathname === "/home")) return true
    return pathname === path || pathname.startsWith(path + "/")
  }

  const hasActiveChild = (paths) => {
    return paths.some((path) => isActiveRoute(path))
  }

  const hasLinkedInActiveChild = () => {
    return isActiveRoute("/LinkedInPost")
  }

  const hasJobPostActiveChild = () => {
    return isActiveRoute("/jobpost") || hasLinkedInActiveChild()
  }

  const hasExpensesActiveChild = () => {
    return hasActiveChild([
      "/components/expensesdetails",
      "/components/dashboard",
      "/components/approverScreen",
      "/components/remiter",
      "/employeeSetup/NewVendorForm",
      "/components/policy",
      "/components/configurationList",
      "/components/categorySettings",
      "/expenseTypeSettings",
      "/components/roleAndPermission",
    ])
  }

  const hasCommandExeActiveChild = () => {
    return hasActiveChild([
      "/commandexe/home",
      "/commandexe/caseList/addCases",
      "/commandexe/caseList/initiateCases",
      "/commandexe/invoice",
    ])
  }

  const location = typeof window !== "undefined" ? window.location : { search: "" }
  const isNewPostActive = location.search.includes("tabvalue=new-post")
  const isDraftActive = location.search.includes("tabvalue=drafts")
  const isScheduledActive = location.search.includes("tabvalue=scheduled")
  const isCalendarActive = location.search.includes("tabvalue=calendar")
  const isApprovalsActive = location.search.includes("tabvalue=approvals")
  const hasActiveSocialMediaChildren =
    isNewPostActive || isDraftActive || isScheduledActive || isCalendarActive || isApprovalsActive

  useEffect(() => {
    // Only collapse all menus if the main nav is truly collapsed AND not being hovered over
    if (isCollapsed && !isHovered) {
      setExpandedMenus({
        talentAcquisition: false,
        jobPost: false,
        jobApplication: false,
        linkedInPost: false,
        socialmediam: false,
        expenses: false,
        FileManagerNew: false,
        commandExe: false,
        caseList: false,
        InterviewMonitor: false,
        utilities: false,
      })
      return
    }

    const currentPath = pathname
    if (currentPath.includes("/jobpost") || currentPath.includes("/LinkedInPost")) {
      setExpandedMenus((prev) => ({
        ...prev,
        talentAcquisition: true,
        jobPost: true,
        linkedInPost: currentPath.includes("/LinkedInPost"),
      }))
    }
    if (currentPath.includes("/JobApplications")) {
      setExpandedMenus((prev) => ({
        ...prev,
        talentAcquisition: true,
        jobApplication: true,
      }))
    }
    if (currentPath.includes("/InterviewMonitor")) {
      setExpandedMenus((prev) => ({
        ...prev,
        talentAcquisition: true,
        InterviewMonitor: true,
      }))
    }
    if (
      currentPath.includes("/notes") ||
      currentPath.includes("/FileManagerNew") ||
      currentPath.includes("/sameNewChat")
    ) {
      setExpandedMenus((prev) => ({
        ...prev,
        utilities: true,
      }))
    }
    // Auto-expand social media menu if on social media page
    if (currentPath.includes("/LinkedinPosting")) {
      setExpandedMenus((prev) => ({
        ...prev,
        socialmediam: true,
      }))
    }
    if (hasExpensesActiveChild()) {
      setExpandedMenus((prev) => ({
        ...prev,
        expenses: true,
      }))
    }
    if (currentPath.includes("/FileManagerNew")) {
      setExpandedMenus((prev) => ({
        ...prev,
        FileManagerNew: true,
      }))
    }
    if (hasCommandExeActiveChild()) {
      setExpandedMenus((prev) => ({
        ...prev,
        commandExe: true,
        caseList: currentPath.includes("/commandexe/caseList"),
      }))
    }
  }, [pathname, isCollapsed, isHovered]) // Updated dependencies

  const getUserRoleId = () => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("userData")
      if (userData) {
        try {
          const parsedData = JSON.parse(userData)
          return parsedData?.roleId || null
        } catch (e) {
          console.error("Error parsing user data:", e)
          return null
        }
      }
    }
    return null
  }

  const fetchRolePermissions = async () => {
    setLoading(true)
    setError(null)
    const roleId = getUserRoleId()
    if (roleId === "demo-admin-role") {
      setPermissions(demoPermissions)
      setLoading(false)
      setPermissionsLoaded(true)
      return
    }
    if (!roleId) {
      setError("No role ID found")
      setLoading(false)
      setPermissionsLoaded(true)
      return
    }
    try {
      const result = await callApi({
        endpoint: `/v1/api/role/detail?roleId=${roleId}`,
        method: "GET",
        disableSnackbar: true,
      })
      if (result.success && result.data?.items) {
        setPermissions(result.data.items)
      } else {
        setError("Failed to fetch permissions: " + (result.message || "Unknown error"))
        console.error("API Error:", result.message)
      }
    } catch (err) {
      setError("Error fetching permissions: " + err.message)
      console.error("Error fetching role permissions:", err)
    } finally {
      setLoading(false)
      setPermissionsLoaded(true)
    }
  }

  useEffect(() => {
    fetchRolePermissions()
  }, [])

  const safeGetPermission = (permissionPath) => {
    if (!permissions) return false
    const keys = permissionPath.split(".")
    let current = permissions
    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key]
      } else {
        return false
      }
    }
    return current === true
  }

  const hasPermission = (permissionKey) => {
    if (!permissions) return false
    if (permissionKey.includes(".")) {
      return safeGetPermission(permissionKey)
    }
    return permissions[permissionKey] === true
  }

  const hasJobPostPermission = () => {
    if (!permissions?.RecruitmentHiring?.jobPostDashboard) return false
    const jobPostPerms = permissions.RecruitmentHiring.jobPostDashboard
    return Object.values(jobPostPerms).some((value) => value === true)
  }

  const canViewJobPosts = () => {
    return (
      safeGetPermission("RecruitmentHiring.jobPostDashboard.canViewSelf") ||
      safeGetPermission("RecruitmentHiring.jobPostDashboard.canViewAll")
    )
  }

  const canCreateJobPosts = () => {
    return safeGetPermission("RecruitmentHiring.jobPostDashboard.newJobPost")
  }

  const hasJobApplicationsPermission = () => {
    if (!permissions?.RecruitmentHiring?.jobApplications) return false
    return Object.values(permissions.RecruitmentHiring.jobApplications).some((value) => value === true)
  }

  const hasLinkedInPermission = () => {
    if (!permissions?.RecruitmentHiring?.linkedin) return false
    const linkedinPerms = permissions.RecruitmentHiring.linkedin
    return Object.values(linkedinPerms).some((value) => value === true)
  }

  const hasInterviewManagementPermission = () => {
    if (!permissions?.permissions?.InterviewManagement) return false
    return Object.values(permissions.InterviewManagement).some((value) => value === true)
  }

  const canSetupLinkedIn = () => {
    return safeGetPermission("RecruitmentHiring.linkedin.setup")
  }

  const canAccessLinkedInDashboard = () => {
    return safeGetPermission("RecruitmentHiring.linkedin.dashboard")
  }

  const canCreateLinkedInPost = () => {
    return safeGetPermission("RecruitmentHiring.linkedin.createPost")
  }

  const hasFileManagerPermission = () => {
    return hasPermission("fileManager")
  }

  const hasNotesPermission = () => {
    return hasPermission("notes")
  }

  const hasChatPermission = () => {
    return hasPermission("chat")
  }

  const hasAgencyPermission = () => {
    return hasPermission("RecruitmentHiring.agencySetup")
  }

  const hasInterviewPermission = () => {
    return hasPermission("permissions.InterviewManagement")
  }

  const hasExpensesPermission = () => {
    return (
      hasPermission("expenseManagement.expensePoliciesSetup") ||
      hasPermission("expenseManagement.expenseConfigSetup") ||
      hasPermission("expenseManagement.expenseCategoriesSetup") ||
      hasPermission("expenseManagement.expenseTypesSetup") ||
      hasPermission("expenseManagement.expenseRolePermissionSetup")
    )
  }

  const canAccessExpenseRolePermissions = () => {
    return safeGetPermission("expenseManagement.expenseRolePermissionSetup")
  }

  const hasCommandExePermission = () => {
    return safeGetPermission("permissions.CommandExe")
  }

  const toggleMenu = (menuKey) => {
    if (isCollapsed && !isHovered) return // Don't allow toggle when collapsed and not hovering on desktop
    setExpandedMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }))
  }

  const getActiveStyles = (isActive, level = 1, hasActiveChildren = false) => {
    const baseStyles = {
      borderRadius: 1.5,
      mb: 0.5,
      pl: 3,
      transition: "all 300ms ease-in-out !important", // Force exact timing match
      minHeight: actualCollapsed ? 28 : "auto",
    }
    // Custom colors
    const iconColor = "#262E3D"
    const activeBackgroundColor = "#F8F9FA" // Light background for active items
    const hoverBackgroundColor = "#F1F3F4" // Slightly darker for hover

    if (actualCollapsed) {
      const collapsedStyles = {
        ...baseStyles,
        // justifyContent: "center",
        // px: 1,
        "& .MuiListItemIcon-root": {
          minWidth: "unset",
          margin: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 300ms ease-in-out !important",
        },
        "& .MuiListItemText-root": {
          display: "none",
          opacity: 0,
          transition: "opacity 300ms ease-in-out !important",
        },
      }
      if (isActive) {
        return {
          ...collapsedStyles,
          backgroundColor: activeBackgroundColor,
          color: iconColor,
          "&:hover": {
            backgroundColor: hoverBackgroundColor,
          },
          "& .MuiListItemIcon-root": {
            ...collapsedStyles["& .MuiListItemIcon-root"],
            color: iconColor,
          },
        }
      } else if (hasActiveChildren) {
        return {
          ...collapsedStyles,
          backgroundColor: "#EAEAEA",
          color: iconColor,
          "&:hover": {
            backgroundColor: hoverBackgroundColor,
          },
          "& .MuiListItemIcon-root": {
            ...collapsedStyles["& .MuiListItemIcon-root"],
            color: iconColor,
          },
        }
      } else {
        return {
          ...collapsedStyles,
          backgroundColor: "transparent",
          color: iconColor,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
          "& .MuiListItemIcon-root": {
            ...collapsedStyles["& .MuiListItemIcon-root"],
            color: iconColor,
          },
        }
      }
    }

    // Expanded state styles
    // Level 1 - Main menu items
    if (level === 1) {
      if (isActive) {
        return {
          ...baseStyles,
          backgroundColor: activeBackgroundColor,
          color: iconColor,
          "&:hover": {
            backgroundColor: hoverBackgroundColor,
          },
          "& .MuiListItemIcon-root": {
            color: iconColor,
            minWidth: 40,
            transition: "all 300ms ease-in-out !important",
          },
          "& .MuiListItemText-primary": {
            fontWeight: 600,
            color: iconColor,
            transition: "all 300ms ease-in-out !important",
          },
          "& .MuiListItemText-root": {
            opacity: 1,
            transition: "opacity 300ms ease-in-out !important",
          },
        }
      } else if (hasActiveChildren) {
        return {
          ...baseStyles,
          backgroundColor: "#EAEAEA",
          color: iconColor,
          "&:hover": {
            backgroundColor: hoverBackgroundColor,
          },
          "& .MuiListItemIcon-root": {
            color: iconColor,
            minWidth: 40,
            transition: "all 300ms ease-in-out !important",
          },
          "& .MuiListItemText-primary": {
            fontWeight: 500,
            color: iconColor,
            transition: "all 300ms ease-in-out !important",
          },
          "& .MuiListItemText-root": {
            opacity: 1,
            transition: "opacity 300ms ease-in-out !important",
          },
        }
      } else {
        return {
          ...baseStyles,
          backgroundColor: "transparent",
          color: iconColor,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
          "& .MuiListItemIcon-root": {
            color: iconColor,
            minWidth: 40,
            transition: "all 300ms ease-in-out !important",
          },
          "& .MuiListItemText-primary": {
            fontWeight: 500,
            color: iconColor,
            transition: "all 300ms ease-in-out !important",
          },
          "& .MuiListItemText-root": {
            opacity: 1,
            transition: "opacity 300ms ease-in-out !important",
          },
        }
      }
    }

    if (level === 2) {
      if (isActive) {
        return {
          ...baseStyles,
          backgroundColor: activeBackgroundColor,
          color: iconColor,
          "&:hover": {
            backgroundColor: hoverBackgroundColor,
          },
          "& .MuiListItemIcon-root": {
            color: iconColor,
            minWidth: 40,
            transition: "all 300ms ease-in-out !important",
          },
          "& .MuiListItemText-primary": {
            fontWeight: 600,
            color: iconColor,
            transition: "all 300ms ease-in-out !important",
          },
          "& .MuiListItemText-root": {
            opacity: 1,
            transition: "opacity 300ms ease-in-out !important",
          },
        }
      } else if (hasActiveChildren) {
        return {
          ...baseStyles,
          backgroundColor: "#EAEAEA",
          color: iconColor,
          "&:hover": {
            backgroundColor: hoverBackgroundColor,
          },
          "& .MuiListItemIcon-root": {
            color: iconColor,
            minWidth: 40,
            transition: "all 300ms ease-in-out !important",
          },
          "& .MuiListItemText-primary": {
            fontWeight: 500,
            color: iconColor,
            transition: "all 300ms ease-in-out !important",
          },
          "& .MuiListItemText-root": {
            opacity: 1,
            transition: "opacity 300ms ease-in-out !important",
          },
        }
      } else {
        return {
          ...baseStyles,
          backgroundColor: "transparent",
          color: iconColor,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
          "& .MuiListItemIcon-root": {
            color: iconColor,
            minWidth: 40,
            transition: "all 300ms ease-in-out !important",
          },
          "& .MuiListItemText-primary": {
            fontWeight: 400,
            color: iconColor,
            transition: "all 300ms ease-in-out !important",
          },
          "& .MuiListItemText-root": {
            opacity: 1,
            transition: "opacity 300ms ease-in-out !important",
          },
        }
      }
    }

    if (level === 3) {
      if (isActive) {
        return {
          ...baseStyles,
          backgroundColor: activeBackgroundColor,
          color: iconColor,
          "&:hover": {
            backgroundColor: hoverBackgroundColor,
          },
          "& .MuiListItemIcon-root": {
            color: iconColor,
            minWidth: 32,
            transition: "all 300ms ease-in-out !important",
          },
          "& .MuiListItemText-primary": {
            fontWeight: 600,
            color: iconColor,
            transition: "all 300ms ease-in-out !important",
          },
          "& .MuiListItemText-root": {
            opacity: 1,
            transition: "opacity 300ms ease-in-out !important",
          },
        }
      } else if (hasActiveChildren) {
        return {
          ...baseStyles,
          backgroundColor: "#EAEAEA",
          color: iconColor,
          "&:hover": {
            backgroundColor: hoverBackgroundColor,
          },
          "& .MuiListItemIcon-root": {
            color: iconColor,
            minWidth: 32,
            transition: "all 300ms ease-in-out !important",
          },
          "& .MuiListItemText-primary": {
            fontWeight: 500,
            color: iconColor,
            transition: "all 300ms ease-in-out !important",
          },
          "& .MuiListItemText-root": {
            opacity: 1,
            transition: "opacity 300ms ease-in-out !important",
          },
        }
      } else {
        return {
          ...baseStyles,
          backgroundColor: "transparent",
          color: iconColor,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
          "& .MuiListItemIcon-root": {
            color: iconColor,
            minWidth: 32,
            transition: "all 300ms ease-in-out !important",
          },
          "& .MuiListItemText-primary": {
            fontWeight: 400,
            color: iconColor,
            transition: "all 300ms ease-in-out !important",
          },
          "& .MuiListItemText-root": {
            opacity: 1,
            transition: "opacity 300ms ease-in-out !important",
          },
        }
      }
    }
    return baseStyles
  }

  if (loading || !permissionsLoaded) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", p: 3 }}>
        <CircularProgress size={30} />
      </Box>
    )
  }

  if (error && !permissions) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={fetchRolePermissions}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        // Removed Paper component and its conflicting styles
        width: actualCollapsed ? 64 : "auto",
        transition: "width 300ms ease-in-out !important", // Force exact timing match
        overflow: "hidden", // Remove all scroll visibility
        overflowX: "hidden",
        overflowY: "hidden",
        "&::-webkit-scrollbar": {
          display: "none", // Hide webkit scrollbar
          width: "0",
          height: "0",
        },
        "&": {
          scrollbarWidth: "none", // Hide Firefox scrollbar
          msOverflowStyle: "none", // Hide IE scrollbar
        },
      }}
    >
      {/* Navigation Menu */}
      <ScrollWrapper
        {...(actualCollapsed
          ? {
            className: "bs-full overflow-y-hidden overflow-x-hidden",
            onScroll: (container) => scrollMenu(container, false),
            style: {
              overflow: "auto", // Changed from hidden auto !important
              overflowX: "hidden",
              overflowY: "hidden",
              maxWidth: "100%",
              width: "100%",
              transition: "all 300ms ease-in-out !important", // Force exact timing match
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE
            },
          }
          : {
            options: {
              wheelPropagation: false,
              suppressScrollX: true,
              useBothWheelAxes: false,
              scrollXMarginOffset: 0,
            },
            onScrollY: (container) => scrollMenu(container, true),
            style: {
              overflow: "auto", // Changed from hidden auto !important
              overflowX: "hidden",
              maxWidth: "100%",
              width: "100%",
              transition: "all 300ms ease-in-out !important", // Force exact timing match
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE
            },
          })}
      >
        <Box
          sx={{
            // flex: 1,
            // py: 2,
            transition: "all 300ms ease-in-out !important",
            overflow: "hidden", // Keep this for the inner box to prevent content overflow
            "&::-webkit-scrollbar": {
              display: "none",
              width: "0",
              height: "0",
            },
          }}
        >
          <List
            sx={{
              px: actualCollapsed ? 2 : 2,
              transition: "padding 300ms ease-in-out !important", // Force exact timing match
              "& .MuiListItem-root": {
                px: 0,
                transition: "all 300ms ease-in-out !important", // Force exact timing match
              },
            }}
          >
            {/* Home */}
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href="/home"
                sx={getActiveStyles(isActiveRoute("/home"), 1)}
                title={actualCollapsed ? "Home" : undefined}
              >
                <ListItemIcon>
                  <HomeOutlined sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Home"
                  primaryTypographyProps={{
                    fontWeight: 500,
                    fontSize: "0.875rem",
                  }}
                  sx={{
                    opacity: actualCollapsed ? 0 : 1,
                    transition: "opacity 300ms ease-in-out !important",
                  }}
                />
              </ListItemButton>
            </ListItem>

            {(hasJobPostPermission() || hasJobApplicationsPermission()) && (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => toggleMenu("talentAcquisition")}
                    sx={getActiveStyles(false, 1, hasActiveChild(["/jobpost", "/JobApplications", "/LinkedInPost"]))}
                    title={actualCollapsed ? "Talent Acquisition" : undefined}
                  >
                    <ListItemIcon>
                      <WorkOutline sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Talent Acquisition"
                      primaryTypographyProps={{
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        noWrap: true, // ✅ prevent text wrapping
                      }}
                      sx={{
                        opacity: actualCollapsed ? 0 : 1,
                        transition: "opacity 300ms ease-in-out !important",
                        whiteSpace: 'nowrap',         // ✅ keep it on one line
                        overflow: 'hidden',           // ✅ hide overflowed text
                        textOverflow: 'ellipsis',     // ✅ add ... if it overflows
                      }}
                    />

                    {!actualCollapsed && (
                      <motion.div
                        animate={{ rotate: expandedMenus.talentAcquisition ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          opacity: actualCollapsed ? 0 : 1,
                          transition: "opacity 300ms ease-in-out",
                        }}
                      >
                        <ChevronRight sx={{ fontSize: 16, color: "#262E3D" }} />
                      </motion.div>
                    )}
                  </ListItemButton>
                </ListItem>
                <Collapse
                  in={!actualCollapsed && expandedMenus.talentAcquisition}
                  timeout={300}
                  unmountOnExit
                  sx={{
                    "& .MuiCollapse-wrapper": {
                      transition: "all 300ms ease-in-out !important",
                    },
                  }}
                >
                  <List sx={{ pl: 4, "& .MuiListItem-root": { px: 0 } }}>
                    {/* Job Post */}
                    {hasJobPostPermission() && (
                      <>
                        <ListItem disablePadding>
                          <ListItemButton
                            onClick={() => toggleMenu("jobPost")}
                            sx={{
                              borderRadius: 1.5,
                              mb: 0.5,
                              transition: "all 300ms ease-in-out !important",
                              "&:hover": {
                                backgroundColor: theme.palette.action.hover,
                              },
                              "& .MuiListItemIcon-root": {
                                color: "#262E3D",
                                transition: "all 300ms ease-in-out !important",
                              },
                              "& .MuiListItemText-primary": {
                                color: "#262E3D",
                                transition: "all 300ms ease-in-out !important",
                              },
                            }}
                          >
                            <ListItemIcon>
                              <PostAddOutlined sx={{ fontSize: 16 }} />
                            </ListItemIcon>
                            <ListItemText
                              primary="Job Post"
                              primaryTypographyProps={{
                                fontSize: "0.8125rem",
                              }}
                              sx={{
                                opacity: actualCollapsed ? 0 : 1,
                                transition: "opacity 300ms ease-in-out !important",
                              }}
                            />
                            <motion.div
                              animate={{ rotate: expandedMenus.jobPost ? 90 : 0 }}
                              transition={{ duration: 0.2 }}
                              style={{
                                opacity: actualCollapsed ? 0 : 1,
                                transition: "opacity 300ms ease-in-out",
                              }}
                            >
                              <ChevronRight sx={{ fontSize: 14, color: "#262E3D" }} />
                            </motion.div>
                          </ListItemButton>
                        </ListItem>
                        <Collapse
                          in={!actualCollapsed && expandedMenus.jobPost}
                          timeout={300}
                          unmountOnExit
                          sx={{
                            "& .MuiCollapse-wrapper": {
                              transition: "all 300ms ease-in-out !important",
                            },
                          }}
                        >
                          <List sx={{ pl: 3, "& .MuiListItem-root": { px: 0 } }}>
                            {canViewJobPosts() && (
                              <ListItem disablePadding>
                                <ListItemButton
                                  component={Link}
                                  href="/jobpost"
                                  sx={{
                                    borderRadius: 1.5,
                                    mb: 0.5,
                                    transition: "all 300ms ease-in-out !important",
                                    "&:hover": {
                                      backgroundColor: theme.palette.action.hover,
                                    },
                                    "& .MuiListItemIcon-root": {
                                      color: "#262E3D",
                                      transition: "all 300ms ease-in-out !important",
                                    },
                                    "& .MuiListItemText-primary": {
                                      color: "#262E3D",
                                      transition: "all 300ms ease-in-out !important",
                                    },
                                  }}
                                >
                                  <ListItemIcon sx={{ minWidth: 32 }}>
                                    <DashboardOutlined sx={{ fontSize: 16 }} />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary="Dashboard"
                                    primaryTypographyProps={{
                                      fontSize: "0.8125rem",
                                    }}
                                    sx={{
                                      opacity: actualCollapsed ? 0 : 1,
                                      transition: "opacity 300ms ease-in-out !important",
                                    }}
                                  />
                                </ListItemButton>
                              </ListItem>
                            )}

                            {canViewJobPosts() && hasAdminRole && (
                              <ListItem disablePadding>
                                <ListItemButton
                                  component={Link}
                                  href="/RecruiterPerformance"
                                  sx={{
                                    borderRadius: 1.5,
                                    mb: 0.5,
                                    transition: "all 300ms ease-in-out !important",
                                    "&:hover": {
                                      backgroundColor: theme.palette.action.hover,
                                    },
                                    "& .MuiListItemIcon-root": {
                                      color: "#262E3D",
                                      transition: "all 300ms ease-in-out !important",
                                    },
                                    "& .MuiListItemText-primary": {
                                      color: "#262E3D",
                                      transition: "all 300ms ease-in-out !important",
                                    },
                                  }}
                                >
                                  <ListItemIcon sx={{ minWidth: 32 }}>
                                    <BarChartOutlined sx={{ fontSize: 18 }} />
                                    {/* Or use <InsightsOutlined sx={{ fontSize: 18 }} /> */}
                                  </ListItemIcon>
                                  <ListItemText
                                    primary="Recruiter Analytics"
                                    primaryTypographyProps={{
                                      fontSize: "0.8125rem",
                                      noWrap: true,
                                    }}
                                    sx={{
                                      opacity: actualCollapsed ? 0 : 1,
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      transition: "opacity 300ms ease-in-out !important",
                                    }}
                                  />
                                </ListItemButton>
                              </ListItem>
                            )}

                            {canCreateJobPosts() && (
                              <ListItem disablePadding>
                                <ListItemButton
                                  component={Link}
                                  href="/jobpost/createNewPost"
                                  sx={{
                                    borderRadius: 1.5,
                                    mb: 0.5,
                                    transition: "all 300ms ease-in-out !important",
                                    "&:hover": {
                                      backgroundColor: theme.palette.action.hover,
                                    },
                                    "& .MuiListItemIcon-root": {
                                      color: "#262E3D",
                                      transition: "all 300ms ease-in-out !important",
                                    },
                                    "& .MuiListItemText-primary": {
                                      color: "#262E3D",
                                      transition: "all 300ms ease-in-out !important",
                                    },
                                  }}
                                >
                                  <ListItemIcon sx={{ minWidth: 32 }}>
                                    <AddOutlined sx={{ fontSize: 16 }} />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary="Create Post"
                                    primaryTypographyProps={{
                                      fontSize: "0.8125rem",
                                    }}
                                    sx={{
                                      opacity: actualCollapsed ? 0 : 1,
                                      transition: "opacity 300ms ease-in-out !important",
                                    }}
                                  />
                                </ListItemButton>
                              </ListItem>
                            )}
                            {/* LinkedIn Post Section - Only show if user has LinkedIn permissions */}
                            {hasLinkedInPermission() && (
                              <>
                                <ListItem disablePadding>
                                  <ListItemButton
                                    onClick={() => toggleMenu("linkedInPost")}
                                    sx={{
                                      borderRadius: 1.5,
                                      mb: 0.5,
                                      transition: "all 300ms ease-in-out !important",
                                      "&:hover": {
                                        backgroundColor: theme.palette.action.hover,
                                      },
                                      "& .MuiListItemIcon-root": {
                                        color: "#262E3D",
                                        transition: "all 300ms ease-in-out !important",
                                      },
                                      "& .MuiListItemText-primary": {
                                        color: "#262E3D",
                                        transition: "all 300ms ease-in-out !important",
                                      },
                                    }}
                                  >
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                      <LinkedIn sx={{ fontSize: 16 }} />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary="LinkedIn Post"
                                      primaryTypographyProps={{
                                        fontSize: "0.8125rem",
                                      }}
                                      sx={{
                                        opacity: actualCollapsed ? 0 : 1,
                                        transition: "opacity 300ms ease-in-out !important",
                                      }}
                                    />
                                    <motion.div
                                      animate={{ rotate: expandedMenus.linkedInPost ? 90 : 0 }}
                                      transition={{ duration: 0.2 }}
                                      style={{
                                        opacity: actualCollapsed ? 0 : 1,
                                        transition: "opacity 300ms ease-in-out",
                                      }}
                                    >
                                      <ChevronRight sx={{ fontSize: 14, color: "#262E3D" }} />
                                    </motion.div>
                                  </ListItemButton>
                                </ListItem>
                                <Collapse
                                  in={!actualCollapsed && expandedMenus.linkedInPost}
                                  timeout={300}
                                  unmountOnExit
                                  sx={{
                                    "& .MuiCollapse-wrapper": {
                                      transition: "all 300ms ease-in-out !important",
                                    },
                                  }}
                                >
                                  <List sx={{ pl: 3, "& .MuiListItem-root": { px: 0 } }}>
                                    {canAccessLinkedInDashboard() && (
                                      <ListItem disablePadding>
                                        <ListItemButton
                                          component={Link}
                                          href="/LinkedinPosting/dashboard"
                                          sx={{
                                            borderRadius: 1.5,
                                            mb: 0.5,
                                            transition: "all 300ms ease-in-out !important",
                                            "&:hover": {
                                              backgroundColor: theme.palette.action.hover,
                                            },
                                            "& .MuiListItemIcon-root": {
                                              color: "#262E3D",
                                              transition: "all 300ms ease-in-out !important",
                                            },
                                            "& .MuiListItemText-primary": {
                                              color: "#262E3D",
                                              transition: "all 300ms ease-in-out !important",
                                            },
                                          }}
                                        >
                                          <ListItemIcon sx={{ minWidth: 32 }}>
                                            <AnalyticsOutlined sx={{ fontSize: 16 }} />
                                          </ListItemIcon>
                                          <ListItemText
                                            primary="Dashboard"
                                            primaryTypographyProps={{
                                              fontSize: "0.8125rem",
                                            }}
                                            sx={{
                                              opacity: actualCollapsed ? 0 : 1,
                                              transition: "opacity 300ms ease-in-out !important",
                                            }}
                                          />
                                        </ListItemButton>
                                      </ListItem>
                                    )}
                                    {canCreateLinkedInPost() && (
                                      <ListItem disablePadding>
                                        <ListItemButton
                                          component={Link}
                                          href="/LinkedinPosting?tabvalue=new-post"
                                          sx={{
                                            borderRadius: 1.5,
                                            mb: 0.5,
                                            transition: "all 300ms ease-in-out !important",
                                            "&:hover": {
                                              backgroundColor: theme.palette.action.hover,
                                            },
                                            "& .MuiListItemIcon-root": {
                                              color: "#262E3D",
                                              transition: "all 300ms ease-in-out !important",
                                            },
                                            "& .MuiListItemText-primary": {
                                              color: "#262E3D",
                                              transition: "all 300ms ease-in-out !important",
                                            },
                                          }}
                                        >
                                          <ListItemIcon sx={{ minWidth: 32 }}>
                                            <NewReleasesOutlined sx={{ fontSize: 16 }} />
                                          </ListItemIcon>
                                          <ListItemText
                                            primary="Create Post"
                                            primaryTypographyProps={{
                                              fontSize: "0.8125rem",
                                            }}
                                            sx={{
                                              opacity: actualCollapsed ? 0 : 1,
                                              transition: "opacity 300ms ease-in-out !important",
                                            }}
                                          />
                                        </ListItemButton>
                                      </ListItem>
                                    )}
                                  </List>
                                </Collapse>
                              </>
                            )}
                          </List>
                        </Collapse>
                      </>
                    )}
                    {hasJobApplicationsPermission() && (
                      <>
                        <ListItem disablePadding>
                          <ListItemButton
                            onClick={() => toggleMenu("jobApplication")}
                            sx={{
                              borderRadius: 1.5,
                              mb: 0.5,
                              transition: "all 300ms ease-in-out !important",
                              "&:hover": {
                                backgroundColor: theme.palette.action.hover,
                              },
                              "& .MuiListItemIcon-root": {
                                color: "#262E3D",
                                transition: "all 300ms ease-in-out !important",
                              },
                              "& .MuiListItemText-primary": {
                                color: "#262E3D",
                                transition: "all 300ms ease-in-out !important",
                              },
                            }}
                          >
                            <ListItemIcon>
                              <AssignmentOutlined sx={{ fontSize: 16 }} />
                            </ListItemIcon>
                            <ListItemText
                              primary="Job Application"
                              primaryTypographyProps={{
                                fontSize: "0.8125rem",
                              }}
                              sx={{
                                opacity: actualCollapsed ? 0 : 1,
                                transition: "opacity 300ms ease-in-out !important",
                              }}
                            />
                            <motion.div
                              animate={{ rotate: expandedMenus.jobApplication ? 90 : 0 }}
                              transition={{ duration: 0.2 }}
                              style={{
                                opacity: actualCollapsed ? 0 : 1,
                                transition: "opacity 300ms ease-in-out",
                              }}
                            >
                              <ChevronRight sx={{ fontSize: 14, color: "#262E3D" }} />
                            </motion.div>
                          </ListItemButton>
                        </ListItem>
                        <Collapse
                          in={!actualCollapsed && expandedMenus.jobApplication}
                          timeout={300}
                          unmountOnExit
                          sx={{
                            "& .MuiCollapse-wrapper": {
                              transition: "all 300ms ease-in-out !important",
                            },
                          }}
                        >
                          <List sx={{ pl: 3, "& .MuiListItem-root": { px: 0 } }}>
                            <ListItem disablePadding>
                              <ListItemButton
                                component={Link}
                                href="/JobApplications"
                                sx={{
                                  borderRadius: 1.5,
                                  mb: 0.5,
                                  transition: "all 300ms ease-in-out !important",
                                  "&:hover": {
                                    backgroundColor: theme.palette.action.hover,
                                  },
                                  "& .MuiListItemIcon-root": {
                                    color: "#262E3D",
                                    transition: "all 300ms ease-in-out !important",
                                  },
                                  "& .MuiListItemText-primary": {
                                    color: "#262E3D",
                                    transition: "all 300ms ease-in-out !important",
                                  },
                                }}
                              >
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <DashboardOutlined sx={{ fontSize: 16 }} />
                                </ListItemIcon>
                                <ListItemText
                                  primary="Dashboard"
                                  primaryTypographyProps={{
                                    fontSize: "0.8125rem",
                                  }}
                                  sx={{
                                    opacity: actualCollapsed ? 0 : 1,
                                    transition: "opacity 300ms ease-in-out !important",
                                  }}
                                />
                              </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                              <ListItemButton
                                component={Link}
                                href="/JobApplications/?stage=2"
                                sx={{
                                  borderRadius: 1.5,
                                  mb: 0.5,
                                  transition: "all 300ms ease-in-out !important",
                                  "&:hover": {
                                    backgroundColor: theme.palette.action.hover,
                                  },
                                  "& .MuiListItemIcon-root": {
                                    color: "#262E3D",
                                    transition: "all 300ms ease-in-out !important",
                                  },
                                  "& .MuiListItemText-primary": {
                                    color: "#262E3D",
                                    transition: "all 300ms ease-in-out !important",
                                  },
                                }}
                              >
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <PeopleOutline sx={{ fontSize: 16 }} />
                                </ListItemIcon>
                                <ListItemText
                                  primary="Candidates"
                                  primaryTypographyProps={{
                                    fontSize: "0.8125rem",
                                  }}
                                  sx={{
                                    opacity: actualCollapsed ? 0 : 1,
                                    transition: "opacity 300ms ease-in-out !important",
                                  }}
                                />
                              </ListItemButton>
                            </ListItem>
                                <ListItem disablePadding>
                              <ListItemButton
                                component={Link}
                                href="/JobApplications/?stage=3"
                                sx={{
                                  borderRadius: 1.5,
                                  mb: 0.5,
                                  transition: "all 300ms ease-in-out !important",
                                  "&:hover": {
                                    backgroundColor: theme.palette.action.hover,
                                  },
                                  "& .MuiListItemIcon-root": {
                                    color: "#262E3D",
                                    transition: "all 300ms ease-in-out !important",
                                  },
                                  "& .MuiListItemText-primary": {
                                    color: "#262E3D",
                                    transition: "all 300ms ease-in-out !important",
                                  },
                                }}
                              >
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <PersonPinCircleOutlinedIcon sx={{ fontSize: 18 }} />
                                </ListItemIcon>
                                <ListItemText
                                  primary="Map"
                                  primaryTypographyProps={{
                                    fontSize: "0.8125rem",
                                  }}
                                  sx={{
                                    opacity: actualCollapsed ? 0 : 1,
                                    transition: "opacity 300ms ease-in-out !important",
                                  }}
                                />
                              </ListItemButton>
                            </ListItem>
                          </List>
                        </Collapse>
                      </>
                    )}
                    {hasInterviewManagementPermission() && (
                      <>
                        <ListItem disablePadding>
                          <ListItemButton
                            onClick={() => toggleMenu("InterviewMonitor")}
                            sx={{
                              borderRadius: 1.5,
                              transition: "all 300ms ease-in-out !important",
                              "&:hover": {
                                backgroundColor: theme.palette.action.hover,
                              },
                              "& .MuiListItemIcon-root": {
                                color: "#262E3D",
                                transition: "all 300ms ease-in-out !important",
                              },
                              "& .MuiListItemText-primary": {
                                color: "#262E3D",
                                transition: "all 300ms ease-in-out !important",
                              },
                            }}
                          >
                            <ListItemIcon>
                              <WorkspacePremium sx={{ fontSize: 16 }} />
                            </ListItemIcon>
                            <ListItemText
                              primary="Interview Monitor"
                              primaryTypographyProps={{
                                fontSize: "0.8125rem",
                              }}
                              sx={{
                                opacity: actualCollapsed ? 0 : 1,
                                transition: "opacity 300ms ease-in-out !important",
                              }}
                            />
                            <motion.div
                              animate={{ rotate: expandedMenus.InterviewMonitor ? 90 : 0 }}
                              transition={{ duration: 0.2 }}
                              style={{
                                opacity: actualCollapsed ? 0 : 1,
                                transition: "opacity 300ms ease-in-out",
                              }}
                            >
                              <ChevronRight sx={{ fontSize: 14, color: "#262E3D" }} />
                            </motion.div>
                          </ListItemButton>
                        </ListItem>
                        <Collapse
                          in={!actualCollapsed && expandedMenus.InterviewMonitor}
                          timeout={300}
                          unmountOnExit
                          sx={{
                            "& .MuiCollapse-wrapper": {
                              transition: "all 300ms ease-in-out !important",
                            },
                          }}
                        >
                          <List sx={{ pl: 3, "& .MuiListItem-root": { px: 0 } }}>
                            {(hasPermission("InterviewManagement.interviewCanViewSelf") ||
                              hasPermission("InterviewManagement.interviewCanViewAll")) && (
                                <ListItem disablePadding>
                                  <ListItemButton
                                    component={Link}
                                    href="/InterviewMonitor"
                                    sx={{
                                      borderRadius: 1.5,
                                      mb: 0.5,
                                      transition: "all 300ms ease-in-out !important",
                                      "&:hover": {
                                        backgroundColor: theme.palette.action.hover,
                                      },
                                      "& .MuiListItemIcon-root": {
                                        color: "#262E3D",
                                        transition: "all 300ms ease-in-out !important",
                                      },
                                      "& .MuiListItemText-primary": {
                                        color: "#262E3D",
                                        transition: "all 300ms ease-in-out !important",
                                      },
                                    }}
                                  >
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                      <Monitor sx={{ fontSize: 16 }} />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary="Interviews"
                                      primaryTypographyProps={{
                                        fontSize: "0.8125rem",
                                      }}
                                      sx={{
                                        opacity: actualCollapsed ? 0 : 1,
                                        transition: "opacity 300ms ease-in-out !important",
                                      }}
                                    />
                                  </ListItemButton>
                                </ListItem>
                              )}
                            {hasPermission("InterviewManagement.callingLogDashboard") && (
                              <ListItem disablePadding>
                                <ListItemButton
                                  component={Link}
                                  href="/InterviewMonitor/TelePhonic"
                                  sx={{
                                    borderRadius: 1.5,
                                    mb: 0.5,
                                    transition: "all 300ms ease-in-out !important",
                                    "&:hover": {
                                      backgroundColor: theme.palette.action.hover,
                                    },
                                    "& .MuiListItemIcon-root": {
                                      color: "#262E3D",
                                      transition: "all 300ms ease-in-out !important",
                                    },
                                    "& .MuiListItemText-primary": {
                                      color: "#262E3D",
                                      transition: "all 300ms ease-in-out !important",
                                    },
                                  }}
                                >
                                  <ListItemIcon sx={{ minWidth: 32 }}>
                                    <DialerSipOutlined sx={{ fontSize: 16 }} />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary="Call Logs"
                                    primaryTypographyProps={{
                                      fontSize: "0.8125rem",
                                    }}
                                    sx={{
                                      opacity: actualCollapsed ? 0 : 1,
                                      transition: "opacity 300ms ease-in-out !important",
                                    }}
                                  />
                                </ListItemButton>
                              </ListItem>
                            )}
                          </List>
                        </Collapse>
                      </>
                    )}
                  </List>
                </Collapse>
              </>
            )}

            {/* Expenses Section */}
            {hasExpensesPermission() && (
              // <>
              //   <ListItem disablePadding>
              //     <ListItemButton
              //       onClick={() => toggleMenu("expenses")}
              //       sx={getActiveStyles(false, 1, hasExpensesActiveChild())}
              //       title={actualCollapsed ? "Expenses" : undefined}
              //     >
              //       <ListItemIcon>
              //         <AccountBalanceWalletOutlined sx={{ fontSize: 20 }} />
              //       </ListItemIcon>
              //       <ListItemText
              //         primary="Expenses"
              //         primaryTypographyProps={{
              //           fontSize: "0.875rem",
              //         }}
              //         sx={{
              //           opacity: actualCollapsed ? 0 : 1,
              //           transition: "opacity 300ms ease-in-out !important",
              //         }}
              //       />
              //       {!actualCollapsed && (
              //         <motion.div
              //           animate={{ rotate: expandedMenus.expenses ? 90 : 0 }}
              //           transition={{ duration: 0.2 }}
              //           style={{
              //             opacity: actualCollapsed ? 0 : 1,
              //             transition: "opacity 300ms ease-in-out",
              //           }}
              //         >
              //           <ChevronRight sx={{ fontSize: 16, color: "#262E3D" }} />
              //         </motion.div>
              //       )}
              //     </ListItemButton>
              //   </ListItem>
              //   <Collapse
              //     in={!actualCollapsed && expandedMenus.expenses}
              //     timeout={300}
              //     unmountOnExit
              //     sx={{
              //       "& .MuiCollapse-wrapper": {
              //         transition: "all 300ms ease-in-out !important",
              //       },
              //     }}
              //   >
              //     <List sx={{ pl: 4, "& .MuiListItem-root": { px: 0 } }}>
              //       {/* Basic Expense Operations */}
              //       {/* <ListItem disablePadding>
              //         <ListItemButton
              //           component={Link}
              //           href="/components/expensesdetails"
              //           sx={getActiveStyles(isActiveRoute("/components/expensesdetails"), 2)}
              //         >
              //           <ListItemIcon>
              //             <ReceiptLongOutlined sx={{ fontSize: 16 }} />
              //           </ListItemIcon>
              //           <ListItemText
              //             primary="Expenses Details"
              //             primaryTypographyProps={{ fontSize: "0.8125rem" }}
              //             sx={{
              //               opacity: actualCollapsed ? 0 : 1,
              //               transition: "opacity 300ms ease-in-out !important",
              //             }}
              //           />
              //         </ListItemButton>
              //       </ListItem> */}
              //       <ListItem disablePadding>
              //         <ListItemButton
              //           component={Link}
              //           href="/components/dashboard"
              //           sx={getActiveStyles(isActiveRoute("/components/dashboard"), 2)}
              //         >
              //           <ListItemIcon>
              //             <DashboardOutlined sx={{ fontSize: 16 }} />
              //           </ListItemIcon>
              //           <ListItemText
              //             primary="Dashboard"
              //             primaryTypographyProps={{ fontSize: "0.8125rem" }}
              //             sx={{
              //               opacity: actualCollapsed ? 0 : 1,
              //               transition: "opacity 300ms ease-in-out !important",
              //             }}
              //           />
              //         </ListItemButton>
              //       </ListItem>
              //       <ListItem disablePadding>
              //         <ListItemButton
              //           component={Link}
              //           href="/employeeSetup/NewExpensesDetails/Submitter"
              //           sx={getActiveStyles(isActiveRoute("/employeeSetup/NewExpensesDetails/Submitter"), 2)}
              //         >
              //           <ListItemIcon>
              //             <MonetizationOnOutlined sx={{ fontSize: 16 }} />
              //           </ListItemIcon>
              //           <ListItemText
              //             primary="Submitter"
              //             primaryTypographyProps={{ fontSize: "0.8125rem" }}
              //             sx={{
              //               opacity: actualCollapsed ? 0 : 1,
              //               transition: "opacity 300ms ease-in-out !important",
              //             }}
              //           />
              //         </ListItemButton>
              //       </ListItem>
              //       <ListItem disablePadding>
              //         <ListItemButton
              //           component={Link}
              //           href="/components/approverScreen"
              //           sx={getActiveStyles(isActiveRoute("/components/approverScreen"), 2)}
              //         >
              //           <ListItemIcon>
              //             <ApprovalOutlined sx={{ fontSize: 16 }} />
              //           </ListItemIcon>
              //           <ListItemText
              //             primary="Approver"
              //             primaryTypographyProps={{ fontSize: "0.8125rem" }}
              //             sx={{
              //               opacity: actualCollapsed ? 0 : 1,
              //               transition: "opacity 300ms ease-in-out !important",
              //             }}
              //           />
              //         </ListItemButton>
              //       </ListItem>
              //       {/* <ListItem disablePadding>
              //         <ListItemButton
              //           component={Link}
              //           href="/employeeSetup/NewVendorForm"
              //           sx={getActiveStyles(isActiveRoute("/employeeSetup/NewVendorForm"), 2)}
              //         >
              //           <ListItemIcon>
              //             <BusinessOutlined sx={{ fontSize: 16 }} />
              //           </ListItemIcon>
              //           <ListItemText
              //             primary="Vendor"
              //             primaryTypographyProps={{ fontSize: "0.8125rem" }}
              //             sx={{
              //               opacity: actualCollapsed ? 0 : 1,
              //               transition: "opacity 300ms ease-in-out !important",
              //             }}
              //           />
              //         </ListItemButton>
              //       </ListItem> */}
              //     </List>
              //   </Collapse>
              // </>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/components/dashboard"
                  sx={getActiveStyles(isActiveRoute("/components/dashboard"), 1)}
                  title={actualCollapsed ? "Expenses" : undefined}
                >
                  <ListItemIcon>
                    <AccountBalanceWalletOutlined sx={{ fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Expenses"
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: "0.875rem",
                    }}
                    sx={{
                      opacity: actualCollapsed ? 0 : 1,
                      transition: "opacity 300ms ease-in-out !important",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )}

            {(hasNotesPermission() || hasFileManagerPermission() || hasChatPermission()) && (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => toggleMenu("utilities")}
                    sx={getActiveStyles(false, 1, hasActiveChild(["/notes", "/sameNewChat", "/FileManagerNew"]))}
                    title={actualCollapsed ? "Utilities" : undefined}
                  >
                    <ListItemIcon>
                      <Storefront sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Utilities"
                      primaryTypographyProps={{
                        fontWeight: 500,
                        fontSize: "0.875rem",
                      }}
                      sx={{
                        opacity: actualCollapsed ? 0 : 1,
                        transition: "opacity 300ms ease-in-out !important",
                      }}
                    />
                    {!actualCollapsed && (
                      <motion.div
                        animate={{ rotate: expandedMenus.utilities ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          opacity: actualCollapsed ? 0 : 1,
                          transition: "opacity 300ms ease-in-out",
                        }}
                      >
                        <ChevronRight sx={{ fontSize: 16, color: "#262E3D" }} />
                      </motion.div>
                    )}
                  </ListItemButton>
                </ListItem>
                <Collapse
                  in={!actualCollapsed && expandedMenus.utilities}
                  timeout={300}
                  unmountOnExit
                  sx={{
                    "& .MuiCollapse-wrapper": {
                      transition: "all 300ms ease-in-out !important",
                    },
                  }}
                >
                  <List sx={{ pl: 4, "& .MuiListItem-root": { px: 0 } }}>
                    {/* Job Post */}
                    {hasNotesPermission() && (
                      <ListItem disablePadding>
                        <ListItemButton
                          component={Link}
                          href="/notes"
                          title={actualCollapsed ? "Chats" : undefined}
                          sx={{
                            borderRadius: 1.5,
                            transition: "all 300ms ease-in-out !important",
                            "&:hover": {
                              backgroundColor: theme.palette.action.hover,
                            },
                            "& .MuiListItemIcon-root": {
                              color: "#262E3D",
                              transition: "all 300ms ease-in-out !important",
                            },
                            "& .MuiListItemText-primary": {
                              color: "#262E3D",
                              transition: "all 300ms ease-in-out !important",
                            },
                          }}
                        >
                          <ListItemIcon>
                            <StickyNote2Outlined sx={{ fontSize: 16 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary="Notes"
                            primaryTypographyProps={{
                              fontSize: "0.8125rem",
                            }}
                            sx={{
                              opacity: actualCollapsed ? 0 : 1,
                              transition: "opacity 300ms ease-in-out !important",
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    )}
                    {hasChatPermission() && (
                      <ListItem disablePadding>
                        <ListItemButton
                          component={Link}
                          href="/sameNewChat"
                          sx={{
                            borderRadius: 1.5,
                            transition: "all 300ms ease-in-out !important",
                            "&:hover": {
                              backgroundColor: theme.palette.action.hover,
                            },
                            "& .MuiListItemIcon-root": {
                              color: "#262E3D",
                              transition: "all 300ms ease-in-out !important",
                            },
                            "& .MuiListItemText-primary": {
                              color: "#262E3D",
                              transition: "all 300ms ease-in-out !important",
                            },
                          }}
                          title={actualCollapsed ? "Chats" : undefined}
                        >
                          <ListItemIcon>
                            <Chat sx={{ fontSize: 20 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary="Chats"
                            primaryTypographyProps={{
                              fontSize: "0.8125rem",
                            }}
                            sx={{
                              opacity: actualCollapsed ? 0 : 1,
                              transition: "opacity 300ms ease-in-out !important",
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    )}
                    {hasFileManagerPermission() && (
                      <ListItem disablePadding>
                        <ListItemButton
                          component={Link}
                          href="/FileManagerNew"
                          sx={{
                            borderRadius: 1.5,
                            transition: "all 300ms ease-in-out !important",
                            "&:hover": {
                              backgroundColor: theme.palette.action.hover,
                            },
                            "& .MuiListItemIcon-root": {
                              color: "#262E3D",
                              transition: "all 300ms ease-in-out !important",
                            },
                            "& .MuiListItemText-primary": {
                              color: "#262E3D",
                              transition: "all 300ms ease-in-out !important",
                            },
                          }}
                          title={actualCollapsed ? "File Manager" : undefined}
                        >
                          <ListItemIcon>
                            <FolderOpenOutlined sx={{ fontSize: 20 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary="File Manager"
                            primaryTypographyProps={{
                              fontSize: "0.8125rem",
                            }}
                            sx={{
                              opacity: actualCollapsed ? 0 : 1,
                              transition: "opacity 300ms ease-in-out !important",
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    )}
                  </List>
                </Collapse>
              </>
            )}

            {hasAgencyPermission() && userData?.Hirefor === "Others" && (
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/AgencySetup"
                  sx={getActiveStyles(isActiveRoute("/AgencySetup"), 1)}
                  title={actualCollapsed ? "Agency" : undefined}
                >
                  <ListItemIcon>
                    <ViewAgendaTwoTone sx={{ fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Agency"
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: "0.875rem",
                    }}
                    sx={{
                      opacity: actualCollapsed ? 0 : 1,
                      transition: "opacity 300ms ease-in-out !important",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )}

            {/* commandexe  */}
            {hasCommandExePermission() && (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => toggleMenu("commandExe")}
                    sx={getActiveStyles(false, 1, hasCommandExeActiveChild())}
                    title={actualCollapsed ? "Commandexe" : undefined}
                  >
                    <ListItemIcon>
                      <AssignmentOutlined sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Commandexe"
                      primaryTypographyProps={{
                        fontWeight: 500,
                        fontSize: "0.875rem",
                      }}
                      sx={{
                        opacity: actualCollapsed ? 0 : 1,
                        transition: "opacity 300ms ease-in-out !important",
                      }}
                    />
                    {!actualCollapsed && (
                      <motion.div
                        animate={{ rotate: expandedMenus.commandExe ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          opacity: actualCollapsed ? 0 : 1,
                          transition: "opacity 300ms ease-in-out",
                        }}
                      >
                        <ChevronRight sx={{ fontSize: 16, color: "#262E3D" }} />
                      </motion.div>
                    )}
                  </ListItemButton>
                </ListItem>
                <Collapse
                  in={!actualCollapsed && expandedMenus.commandExe}
                  timeout={300}
                  unmountOnExit
                  sx={{
                    "& .MuiCollapse-wrapper": {
                      transition: "all 300ms ease-in-out !important",
                    },
                  }}
                >
                  <List sx={{ pl: 4, "& .MuiListItem-root": { px: 0 } }}>
                    <ListItem disablePadding>
                      <ListItemButton
                        component={Link}
                        href="/commandexe/home"
                        sx={getActiveStyles(isActiveRoute("/commandexe/home"), 2)}
                      >
                        <ListItemIcon>
                          <DashboardOutlined sx={{ fontSize: 16 }} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Dashboard"
                          primaryTypographyProps={{
                            fontSize: "0.8125rem",
                          }}
                          sx={{
                            opacity: actualCollapsed ? 0 : 1,
                            transition: "opacity 300ms ease-in-out !important",
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                    {(permissions?.CommandExe?.addCase || permissions?.CommandExe?.backOffice) && (
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => toggleMenu("caseList")}
                          sx={getActiveStyles(
                            false,
                            2,
                            hasActiveChild(["/commandexe/caseList/addCases", "/commandexe/caseList/initiateCases"]),
                          )}
                        >
                          <ListItemIcon>
                            <DescriptionOutlined sx={{ fontSize: 16 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary="Case List"
                            primaryTypographyProps={{
                              fontSize: "0.8125rem",
                            }}
                            sx={{
                              opacity: actualCollapsed ? 0 : 1,
                              transition: "opacity 300ms ease-in-out !important",
                            }}
                          />
                          <motion.div
                            animate={{ rotate: expandedMenus.caseList ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                            style={{
                              opacity: actualCollapsed ? 0 : 1,
                              transition: "opacity 300ms ease-in-out",
                            }}
                          >
                            <ChevronRight sx={{ fontSize: 14, color: "#262E3D" }} />
                          </motion.div>
                        </ListItemButton>
                      </ListItem>
                    )}
                    {(permissions?.CommandExe?.addCase || permissions?.CommandExe?.backOffice) && (
                      <Collapse
                        in={!actualCollapsed && expandedMenus.caseList}
                        timeout={300}
                        unmountOnExit
                        sx={{
                          "& .MuiCollapse-wrapper": {
                            transition: "all 300ms ease-in-out !important",
                          },
                        }}
                      >
                        <List sx={{ pl: 3, "& .MuiListItem-root": { px: 0 } }}>
                          {permissions?.CommandExe?.addCase && (
                            <ListItem disablePadding>
                              <ListItemButton
                                component={Link}
                                href="/commandexe/caseList/addCases"
                                sx={getActiveStyles(isActiveRoute("/commandexe/caseList/addCases"), 3)}
                              >
                                <ListItemIcon>
                                  <AddBusinessOutlined sx={{ minWidth: 32 }} />
                                </ListItemIcon>
                                <ListItemText
                                  primary="Add Case"
                                  primaryTypographyProps={{
                                    fontSize: "0.8125rem",
                                  }}
                                  sx={{
                                    opacity: actualCollapsed ? 0 : 1,
                                    transition: "opacity 300ms ease-in-out !important",
                                  }}
                                />
                              </ListItemButton>
                            </ListItem>
                          )}
                          {permissions?.CommandExe?.backOffice && (
                            <ListItem disablePadding>
                              <ListItemButton
                                component={Link}
                                href="/commandexe/caseList/initiateCases"
                                sx={getActiveStyles(isActiveRoute("/commandexe/caseList/initiateCases"), 3)}
                              >
                                <ListItemIcon>
                                  <BusinessCenterOutlined sx={{ fontSize: 16 }} />
                                </ListItemIcon>
                                <ListItemText
                                  primary="Backoffice"
                                  primaryTypographyProps={{
                                    fontSize: "0.8125rem",
                                  }}
                                  sx={{
                                    opacity: actualCollapsed ? 0 : 1,
                                    transition: "opacity 300ms ease-in-out !important",
                                  }}
                                />
                              </ListItemButton>
                            </ListItem>
                          )}
                        </List>
                      </Collapse>
                    )}
                    {permissions?.CommandExe?.invoice && (
                      <ListItem disablePadding>
                        <ListItemButton
                          component={Link}
                          href="/commandexe/invoice"
                          sx={getActiveStyles(isActiveRoute("/commandexe/invoice"), 2)}
                        >
                          <ListItemIcon>
                            <FileOpenOutlined sx={{ fontSize: 16 }} />
                          </ListItemIcon>
                          <ListItemText
                            primary="Invoice"
                            primaryTypographyProps={{
                              fontSize: "0.8125rem",
                            }}
                            sx={{
                              opacity: actualCollapsed ? 0 : 1,
                              transition: "opacity 300ms ease-in-out !important",
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    )}
                  </List>
                </Collapse>
              </>
            )}
          </List>
        </Box>
      </ScrollWrapper>

      {/* Bottom Section */}
      <Box
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          p: 0

        }}
      >
        <List sx={{ "& .MuiListItem-root": { pl: 2 } }}>
          {/* Settings */}
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              href="/employeeSetup"
              sx={getActiveStyles(isActiveRoute("/employeeSetup"), 1)}
              title={actualCollapsed ? "Settings" : undefined}
            >
              <ListItemIcon>
                <SettingsOutlined sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary="Settings"
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                }}
                sx={{
                  opacity: actualCollapsed ? 0 : 1,
                  // transition: "opacity 300ms ease-in-out !important",
                }}
              />
              {!actualCollapsed && (
                <ChevronRight
                  sx={{
                    fontSize: 16,
                    color: "#262E3D",
                    opacity: actualCollapsed ? 0 : 1,
                    // transition: "opacity 300ms ease-in-out !important",
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>

          {userData?.role?.includes("productOwner") ? (
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href="/adminManagement"
                sx={getActiveStyles(isActiveRoute("/adminManagement"), 1)}
                title={actualCollapsed ? "Admin Dashboard" : undefined}
              >
                <ListItemIcon>
                  <AdminPanelSettingsOutlined sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Admin Dashboard"
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                  }}
                  sx={{
                    opacity: actualCollapsed ? 0 : 1,
                    // transition: "opacity 300ms ease-in-out !important",
                  }}
                />
                {!actualCollapsed && (
                  <ChevronRight
                    sx={{
                      fontSize: 16,
                      color: "#262E3D",
                      opacity: actualCollapsed ? 0 : 1,
                      transition: "opacity 300ms ease-in-out !important",
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ) : null}

          {hasAdminRole ? (
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href="/planUsage"
                sx={getActiveStyles(isActiveRoute("/planUsage"), 1)}
                title={actualCollapsed ? "Plan" : undefined}
              >
                <ListItemIcon>
                  <TrendingUpOutlined sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Plan & Usage"
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                  }}
                  sx={{
                    opacity: actualCollapsed ? 0 : 1,
                    transition: "opacity 300ms ease-in-out !important",
                    whiteSpace: 'nowrap',         // ✅ keep it on one line
                    overflow: 'hidden',           // ✅ hide overflowed text
                    textOverflow: 'ellipsis',     // ✅ add ... if it overflows
                  }}
                />
              </ListItemButton>
            </ListItem>
          ) : null}

          {/* User Profile with Dropdown */}
          <ListItem disablePadding>
            <UserDropdown collapsed={actualCollapsed} />
          </ListItem>
        </List>


      </Box>
    </Box>
  )
}

export default VerticalMenu
