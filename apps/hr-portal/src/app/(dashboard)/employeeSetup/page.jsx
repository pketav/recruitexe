

"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
  InputBase,
  IconButton,
  Paper,
  Chip,
  Tooltip,
  CircularProgress,
  alpha,
} from "@mui/material"

// Enhanced icon imports
import SearchIcon from "@mui/icons-material/Search"
import ViewModuleIcon from "@mui/icons-material/ViewModule"
import ViewListIcon from "@mui/icons-material/ViewList"
import BusinessIcon from "@mui/icons-material/Business"
import AccountTreeIcon from "@mui/icons-material/AccountTree"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import CorporateFareIcon from "@mui/icons-material/CorporateFare"
import WorkIcon from "@mui/icons-material/Work"
import GroupsIcon from "@mui/icons-material/Groups"
import WorkHistoryIcon from "@mui/icons-material/WorkHistory"
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import SchoolIcon from "@mui/icons-material/School"
import TagIcon from "@mui/icons-material/Tag"
import SecurityIcon from "@mui/icons-material/Security"
import SmartToyIcon from "@mui/icons-material/SmartToy"
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark"
import DashboardIcon from "@mui/icons-material/Dashboard"
import LockIcon from "@mui/icons-material/Lock"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import PolicyIcon from "@mui/icons-material/Policy"
import TuneIcon from "@mui/icons-material/Tune"
import CategoryIcon from "@mui/icons-material/Category"
import ReceiptIcon from "@mui/icons-material/Receipt"
import { Add, AdsClick, FormatAlignCenter, HandshakeOutlined, LinkedIn, MailOutline, Person, PersonAdd, PictureAsPdf, PictureAsPdfOutlined, ViewAgendaTwoTone } from "@mui/icons-material"
import { useApi } from "@core/hooks/useApi"
import InventoryIcon from "@mui/icons-material/Inventory"
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';

const SettingsDashboard = () => {
  const [view, setView] = useState("card")
  const [searchTerm, setSearchTerm] = useState("")
  const [mounted, setMounted] = useState(false)
  const [permissions, setPermissions] = useState(null)
  const [loading, setLoading] = useState(true)
  const { callApi } = useApi()

  // Get user role ID from localStorage
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

  // Fetch role permissions
  useEffect(() => {
    const fetchRolePermissions = async () => {
      setLoading(true)
      const roleId = getUserRoleId()
      if (!roleId) {
        setLoading(false)
        return
      }

      try {
        const result = await callApi({
          endpoint: `/v1/api/role/detail?roleId=${roleId}`,
          method: "GET",
          disableSnackbar: true,
        })

        if (result.success && result.data.items) {
          setPermissions(result.data.items)
        }
      } catch (err) {
        console.error("Error fetching role permissions:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchRolePermissions()
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Helper function to safely access nested permissions
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

  // Check if user has permission (supports both flat and nested permissions)
  const hasPermission = (permissionKey) => {
    if (!permissions) return false

    // Check if it's a nested permission (contains dot)
    if (permissionKey.includes(".")) {
      return safeGetPermission(permissionKey)
    }

    // Check flat permission
    return permissions[permissionKey] === true
  }

  // Check if entire section should be visible
  const hasSectionPermission = (sectionKey) => {
    if (!permissions) return false
    return (
      permissions[sectionKey] === true ||
      (typeof permissions[sectionKey] === "object" && permissions[sectionKey] !== null)
    )
  }

  // Define sections with updated permission mappings based on backend structure
  const sections = [
    {
      title: "Organization Setup",
      description: "Configure your organizational structure and hierarchy",
      color: "#3b82f6",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      backendKey: "organizationSetup",
      items: [
        {
          label: "Organization Detail",
          href: "/employeeSetup/Organization",
          icon: <BusinessIcon />,
          description: "Define your organizational structure and hierarchy",
          permission: "organizationSetup.organizationSetup",
        },
        {
          label: "Branches",
          href: "/employeeSetup/Branch",
          icon: <AccountTreeIcon />,
          description: "Set up and manage company branches",
          permission: "organizationSetup.branchSetup",
        },
        {
          label: "Work Location",
          href: "/employeeSetup/WorkLocation",
          icon: <LocationOnIcon />,
          description: "Define physical or remote work locations",
          permission: "organizationSetup.workLocationSetup",
        },
        {
          label: "Department",
          href: "/employeeSetup/Department",
          icon: <CorporateFareIcon />,
          description: "Create departmental structure",
          permission: "organizationSetup.departmentTypeSetup",
        },
        {
          label: "Designation",
          href: "/employeeSetup/Designation",
          icon: <WorkIcon />,
          description: "Configure job titles and designations",
          permission: "organizationSetup.designationSetup",
        },
        {
          label: "Type of Employees",
          href: "/employeeSetup/EmployeeType",
          icon: <GroupsIcon />,
          description: "Define employee categories and types",
          permission: "organizationSetup.employeeTypeSetup",
        },
        {
          label: "Employment Type",
          href: "/employeeSetup/EmploymentType",
          icon: <WorkHistoryIcon />,
          description: "Configure employment types and contracts",
          permission: "organizationSetup.workModeSetup",
        },
        {
          label: "Employee and Role Management",
          href: "/employeeSetup/EmployeeAndRole",
          icon: <SecurityIcon />,
          description: "Configure Employee Role Assignment",
          permission: "organizationSetup.employeeAndRoleManagement",
        },
      ],
    },
    {
      title: "Recruitment & Hiring Setup",
      description: "Manage your hiring process and candidate journey",
      color: "#10b981",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      backendKey: "RecruitmentHiring",
      items: [
        {
          label: "Budget",
          href: "/employeeSetup/Budget",
          icon: <AccountBalanceWalletIcon />,
          description: "Manage recruitment budgets and allocations",
          permission: "RecruitmentHiring.budgetSetup",
        },
        {
          label: "AI",
          href: "/employeeSetup/AISetup",
          icon: <SmartToyIcon />,
          description: "Configure AI-driven screening tools",
          permission: "RecruitmentHiring.aiSetup",
        },
        {
          label: "Career Page",
          href: "/employeeSetup/PortalSetup",
          icon: <BrandingWatermarkIcon />,
          description: "Customize candidate portal branding",
          permission: "RecruitmentHiring.careerPageSetting",
        },
        {
          label: "Unique ID",
          href: "/employeeSetup/IdSetup",
          icon: <TagIcon />,
          description: "Set up identification system",
          permission: "RecruitmentHiring.idSetup",
        },
        {
          label: "Qualification",
          href: "/employeeSetup/Qualification",
          icon: <SchoolIcon />,
          description: "Set required qualifications for roles",
          permission: "RecruitmentHiring.qualificationSetup",
        },
        {
          label: "Social Media Accounts",
          href: "/employeeSetup/Linkedin",
          icon: <LinkedIn />,
          description: "Craft a concise, engaging post to highlight key insights or opportunities.",
          permission: "RecruitmentHiring.linkedin.setup",
        },
        {
          label: "Target",
          href: "/employeeSetup/Target",
          icon: <AdsClick />,
          description:
            "A target company is classified as high or low priority based on its importance for candidate hiring.",
          permission: "RecruitmentHiring.targetCompany",
        },
        {
          label: "Candidate Document Setup",
          href: "/employeeSetup/CandidateDocumentSetup",
          icon: <DescriptionOutlinedIcon />, // Document-related icon from Material UI
          description:
            "Configure required documents for candidates based on their designation during the hiring process.",
          permission: "RecruitmentHiring.CandidateDocumentCollection",
        }
      ],
    },
    {
      title: "Additional Setup",
      description: "Configure dropdown options and master data",
      color: "#14b8a6",
      gradient: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
      backendKey: "managementFeatures",
      items: [
        {
          label: "Custom PDF Template",
          href: "/employeeSetup/PdfTemplate",
          icon: <PictureAsPdf />,
          description: "Create and manage custom PDF templates",
          permission: "managementFeatures.CustomPdfTemplate",
        },
        {
          label: "Master Drop Down",
          href: "/employeeSetup/MasterDropDown",
          icon: <ExpandMoreIcon />,
          description: "Configure system dropdown options and lists",
          permission: "managementFeatures.masterDropdownSetup",
        },
        {
          label: "Mail Switch Setup",
          href: "/employeeSetup/MasterMailSetup",
          icon: <TuneIcon />,
          description: "Configure email notification settings and switches",
          permission: "managementFeatures.mailSwitchSetup",
        },

      ],
    },
    {
      title: "Interview Setup",
      description: "Configure all interview-related settings and authorizations",
      color: "#4E36FF",
      gradient: "linear-gradient(135deg, #4E36FF 0%, #9C27B0 100%)",
      backendKey: "InterviewManagement",
      items: [
        {
          label: "Authorization to Call",
          href: "/employeeSetup/TelePhonicAgent",
          icon: <Person />,
          description:
            "Grant employees permission to operate as call agents with assigned virtual numbers and call handling rules.",
          permission: "InterviewManagement.callingAgentCreation",
        },
      ],
    },
    {
      title: "Verification Suite Setup",
      description: "Configure verification workflows, manage APIs, and monitor reports",
      color: "#6B5BFF",
      gradient: "linear-gradient(135deg, #00897B 0%, #43A047 100%)",
      backendKey: "verificationSuite",
      items: [
        {
          label: "Verification Suite",
          href: "/verificationSuit",
          icon: <VerifiedOutlinedIcon />,
          description: "Access API catalog, create reports, and manage verification stages",
          permission: "verificationSuite.setup",
        }
      ],
    },
    {
      title: "Expense Setup",
      description: "Control and track organizational expenses",
      color: "#06b6d4",
      gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
      backendKey: "expenseManagement",
      items: [
        // {
        //   label: "Expense Policies",
        //   href: "/components/policy",
        //   icon: <PolicyIcon />,
        //   description: "Define expense policies and approval rules",
        //   permission: "expenseManagement.expensePoliciesSetup",
        // },
        // {
        //   label: "Configuration",
        //   href: "/components/configurationList",
        //   icon: <TuneIcon />,
        //   description: "Configure expense management settings",
        //   permission: "expenseManagement.expenseConfigSetup",
        // },
        {
          label: "Expense Categories",
          href: "/employeeSetup/NewExpensesDetails/Category",
          icon: <CategoryIcon />,
          description: "Organize and manage expense categories",
          permission: "expenseManagement.expenseCategoriesSetup",
        },
        {
          label: "Expense WorkFlow",
          href: "/employeeSetup/NewExpensesDetails/WorkFlowExpense",
          icon: <ReceiptIcon />,
          description: "Configure different types of expenses",
          permission: "expenseManagement.expenseTypesSetup",
        },
        // {
        //   label: "Roles & Permissions",
        //   href: "/components/roleAndPermission",
        //   icon: <SecurityIcon />,
        //   description: "Manage expense approval workflows and permissions",
        //   permission: "expenseManagement.expenseRolePermissionSetup",
        // },
      ],
    },
    {
      title: "Asset Setup",
      description: "Track and manage organizational assets",
      color: "#f59e0b",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      backendKey: "assetManagement",
      items: [
        {
          label: "Asset Equipment Setup",
          href: "/asset/equipment",
          icon: <InventoryIcon />,
          description: "Manage organizational assets and equipment",
          permission: "assetManagement.assetEquipmentSetup",
        },
        {
          label: "Asset Categories Setup",
          href: "/asset/categories",
          icon: <CategoryIcon />,
          description: "Categorize assets and equipment types",
          permission: "assetManagement.assetCategoriesSetup",
        },
        {
          label: "Asset Permissions Setup",
          href: "/asset/permissions",
          icon: <SecurityIcon />,
          description: "Control asset access and management permissions",
          permission: "assetManagement.assetPermissionsSetup",
        },
      ],
    },
    {
      title: 'CommandExe Setup',
      description: 'Manage your services and settings from this dashboard.',
      color: '#14b8a6',
      gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
      backendKey: 'CommandExe',
      items: [
        {
          label: 'Services ',
          href: '/commandexe/serviceForm',
          icon: <PersonAdd />,
          description: 'Manage your services and settings from this dashboard.',
          permission: 'CommandExe.service'
        },
        {
          label: 'Initiation Fields',
          href: '/commandexe/initForm',
          icon: <FormatAlignCenter />,
          description: 'Manage onboarding and initial setup.',
          permission: 'CommandExe.initField'
        },
        {
          label: 'Client',
          href: '/commandexe/partner',
          icon: <HandshakeOutlined />,
          description: 'Manage external partners and collabarations. ',
          permission: 'CommandExe.client'
        },
        {
          label: 'Variables',
          href: '/commandexe/variables',
          icon: <Add />,
          description: 'Create and manage system variables and parameters.',
          permission: 'CommandExe.variable'
        },
        {
          label: 'PDF Templates',
          href: '/commandexe/templates/pdflists',
          icon: <PictureAsPdfOutlined />,
          description: 'Create and customize PDF documents templates.',
          permission: 'CommandExe.pdfTemplate'
        },
        // {
        //   label: 'Add Admin ',
        //   href: '',
        //   icon: <PersonAdd />,
        //   description: 'Create and configure the services.',
        //   permission: 'CommandExe.addAdmin'
        // }
      ]
    }
  ]

  // Filter sections based on backend permissions and search
  const filteredSections = sections
    .filter((section) => {
      // Show section if user has the main permission or any sub-permission
      if (section.backendKey && !hasSectionPermission(section.backendKey)) {
        return false
      }
      return true
    })
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        const hasItemPermission = hasPermission(item.permission)
        const matchesSearch =
          item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
        return hasItemPermission && matchesSearch
      }),
    }))
    .filter((section) => section.items.length > 0)

  // Render card with permission-based styling
  const renderCard = (item, section, index) => {
    const isEnabled = hasPermission(item.permission)
    const CardWrapper = isEnabled ? Link : "div"
    const cardProps = isEnabled ? { href: item.href, style: { textDecoration: "none" } } : {}

    return (
      <Grid item xs={12} sm={6} md={view === "card" ? 4 : 6} lg={view === "card" ? 3 : 4} key={index}>
        <Tooltip
          title={
            isEnabled
              ? `Click to access ${item.label}`
              : `Access denied: You don't have permission to access ${item.label}`
          }
          placement="top"
        >
          <CardWrapper {...cardProps}>
            <Card
              sx={{
                borderRadius: 4,
                background: isEnabled ? "white" : alpha("#f5f5f5", 0.8),
                height: view === "card" ? "200px" : "auto",
                boxShadow: isEnabled ? "0 4px 20px rgba(0,0,0,0.08)" : "0 2px 8px rgba(0,0,0,0.04)",
                border: item.highlight
                  ? `2px solid ${section.color || "#6b7280"}`
                  : isEnabled
                    ? "1px solid rgba(0,0,0,0.05)"
                    : "1px solid rgba(0,0,0,0.1)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: isEnabled ? "pointer" : "not-allowed",
                opacity: isEnabled ? 1 : 0.6,
                "&:hover": isEnabled
                  ? {
                    boxShadow: `0 20px 40px ${section.color || "#6b7280"}20`,
                    transform: "translateY(-8px)",
                    borderColor: section.color || "#6b7280",
                  }
                  : {},
                position: "relative",
              }}
            >
              {!isEnabled && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    zIndex: 1,
                    bgcolor: "rgba(0,0,0,0.7)",
                    borderRadius: "50%",
                    p: 0.5,
                  }}
                >
                  <LockIcon sx={{ fontSize: 16, color: "white" }} />
                </Box>
              )}
              <CardActionArea
                disabled={!isEnabled}
                sx={{
                  p: view === "card" ? 3 : 2.5,
                  height: "100%",
                  display: "flex",
                  flexDirection: view === "card" ? "column" : "row",
                  alignItems: view === "card" ? "center" : "flex-start",
                  justifyContent: view === "card" ? "center" : "flex-start",
                  textAlign: view === "card" ? "center" : "left",
                  gap: view === "card" ? 0 : 3,
                }}
              >
                {view === "card" ? (
                  <>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 3,
                        background: isEnabled
                          ? section.gradient || "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)"
                          : "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                        boxShadow: isEnabled
                          ? `0 8px 24px ${section.color || "#6b7280"}30`
                          : "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    >
                      {React.cloneElement(item.icon, {
                        sx: { fontSize: 32, color: "white" },
                      })}
                    </Box>
                    <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                          color: isEnabled ? "#1f2937" : "#6b7280",
                          mb: 1,
                        }}
                      >
                        {item.label}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: isEnabled ? "#6b7280" : "#9ca3af",
                          lineHeight: 1.5,
                        }}
                      >
                        {item.description || "Configure this setting"}
                      </Typography>
                    </CardContent>
                  </>
                ) : (
                  <>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 3,
                        background: isEnabled
                          ? section.gradient || "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)"
                          : "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        boxShadow: isEnabled
                          ? `0 4px 16px ${section.color || "#6b7280"}25`
                          : "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      {React.cloneElement(item.icon, {
                        sx: { fontSize: 28, color: "white" },
                      })}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                          color: isEnabled ? "#1f2937" : "#6b7280",
                          mb: 0.5,
                        }}
                      >
                        {item.label}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: isEnabled ? "#6b7280" : "#9ca3af",
                          lineHeight: 1.5,
                        }}
                      >
                        {item.description || "Configure this setting"}
                      </Typography>
                    </Box>
                  </>
                )}
              </CardActionArea>
            </Card>
          </CardWrapper>
        </Tooltip>
      </Grid>
    )
  }

  if (!mounted || loading) {
    return (
      <Box
        sx={{
          backgroundColor: "#f8fafc",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={48} sx={{ color: "#3b82f6", mb: 2 }} />
          <Typography variant="h6" color="#6b7280">
            Loading Configuration Center...
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        p: 4,
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      }}
    >
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* Animated Background */}
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: "200px",
            height: "200px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            animation: "float 6s ease-in-out infinite",
            "@keyframes float": {
              "0%, 100%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(-20px)" },
            },
          }}
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DashboardIcon sx={{ fontSize: 40, color: "white" }} />
            </Box>
            <Box>
              <Typography variant="h3" fontWeight={700} sx={{ color: "white", mb: 0.5 }}>
                HR Configuration Center
              </Typography>
              <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 400 }}>
                Centralized settings for your organization
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Paper
              sx={{
                display: "flex",
                alignItems: "center",
                width: 350,
                px: 2,
                py: 1,
                borderRadius: 3,
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <SearchIcon sx={{ color: "#6b7280", mr: 1 }} />
              <InputBase
                placeholder="Search settings..."
                sx={{ flex: 1, fontSize: "0.95rem" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Paper>

            <IconButton
              onClick={() => setView(view === "card" ? "list" : "card")}
              sx={{
                bgcolor: "rgba(255,255,255,0.15)",
                color: "white",
                "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
              }}
            >
              {view === "card" ? <ViewListIcon /> : <ViewModuleIcon />}
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* Sections */}
      {filteredSections.map((section, sectionIndex) => (
        <Box sx={{ mb: 6 }} key={sectionIndex}>
          {/* Section Header */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Box
                sx={{
                  width: 4,
                  height: 32,
                  borderRadius: 2,
                  background: section.gradient || "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
                }}
              />
              <Typography variant="h5" fontWeight={700} sx={{ color: "#1f2937" }}>
                {section.title}
              </Typography>
              <Chip
                label={`${section.items.length} items`}
                size="small"
                sx={{
                  bgcolor: `${section.color || "#6b7280"}15`,
                  color: section.color || "#6b7280",
                  fontWeight: 600,
                }}
              />
            </Box>
            {section.description && (
              <Typography variant="body1" sx={{ color: "#6b7280", ml: 3 }}>
                {section.description}
              </Typography>
            )}
          </Box>

          {/* Items Grid */}
          <Grid container spacing={3}>
            {section.items.map((item, index) => renderCard(item, section, index))}
          </Grid>
        </Box>
      ))}

      {filteredSections.length === 0 && searchTerm && (
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 4,
            border: "2px dashed #e5e7eb",
            bgcolor: "#fafafa",
          }}
        >
          <SearchIcon sx={{ fontSize: 64, color: "#9ca3af", mb: 2 }} />
          <Typography variant="h5" fontWeight={600} sx={{ color: "#6b7280", mb: 1 }}>
            No settings found
          </Typography>
          <Typography variant="body1" sx={{ color: "#9ca3af" }}>
            Try adjusting your search terms or browse all categories above
          </Typography>
        </Paper>
      )}
    </Box>
  )
}

export default SettingsDashboard