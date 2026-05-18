"use client"

import { Box, Tabs, Tab, Typography, Button, Tooltip, Fade } from "@mui/material"
import {
  Groups as GroupsIcon,
  Payment as PaymentIcon,
  Business as BusinessIcon,
  KeyboardBackspace as KeyboardBackspaceIcon,
  InfoOutlined as InfoOutlinedIcon,
} from "@mui/icons-material"
// Note: BookIcon from lucide-react was used in the original, but MUI has its own Book icon.
// For consistency with the original request's MUI focus, I'll use the MUI icon if available.
// If not, I'd keep lucide-react. MUI has a Book icon in @mui/icons-material.
import { Book as BookIcon } from "@mui/icons-material"

const AdminNavbar = ({ activeTab, onTabChange, router }) => {
  return (
    <Fade in={true} timeout={600}>
      <Box sx={{ mb: 4, overflow: "hidden" }}>
        {/* Header Section */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: 3,
            p: 4,
            // mb: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            // boxShadow: "0 8px 16px rgba(115,103,240,0.3)",
            color: "white",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <BusinessIcon sx={{ fontSize: 30, color: "white" }} />
              </Box>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5, color: "#ffffff" }}>
                Admin Management Center
              </Typography>
              <Tooltip title="Manage users, plans, and organizational settings">
                <InfoOutlinedIcon sx={{ color: "#ffffff", fontSize: 24, cursor: "pointer" }} />
              </Tooltip>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              sx={{ borderRadius: "25px" }}
              color="inherit" // Use inherit for white text on colored background
              variant="outlined"
              onClick={() => router.push("/")}
            >
              <KeyboardBackspaceIcon />
            </Button>
          </Box>
        </Box>
        {/* Tabs Section */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            // borderTop: "1px solid #e2e8f0",
            color: "#1e293b",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={onTabChange}
            sx={{
              px: 3,
              "& .MuiTabs-indicator": {
                backgroundColor: "#7367F0",
                height: 3,
                borderRadius: "3px 3px 0 0",
              },
              "& .MuiTab-root": {
                color: "#64748b",
                fontWeight: 600,
                fontSize: "1rem",
                textTransform: "none",
                minHeight: 56,
                px: 3,
                transition: "all 0.2s ease",
                "&:hover": {
                  color: "#7367F0",
                  backgroundColor: "rgba(115, 103, 240, 0.04)",
                },
                "&.Mui-selected": {
                  color: "#7367F0",
                  fontWeight: 700,
                },
              },
            }}
          >
            <Tab
              icon={<GroupsIcon sx={{ fontSize: 20 }} />}
              iconPosition="start"
              label="Users Management"
              value={0}
              sx={{
                "& .MuiTab-iconWrapper": { mr: 1 },
              }}
            />
            <Tab
              icon={<PaymentIcon sx={{ fontSize: 20 }} />}
              iconPosition="start"
              label="Plans & Modules"
              value={1}
              sx={{
                "& .MuiTab-iconWrapper": { mr: 1 },
              }}
            />
            <Tab
              icon={<BookIcon sx={{ fontSize: 20 }} />}
              iconPosition="start"
              label="Booked Demo"
              value={2}
              sx={{
                "& .MuiTab-iconWrapper": { mr: 1 },
              }}
            />
          </Tabs>
          {/* Tab Description */}
          <Box sx={{ p: 2, backgroundColor: "#f8fafc" }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
              {activeTab === 0 && "Manage organization administrators, user accounts, and access permissions"}
              {activeTab === 1 && "Configure subscription plans, module allocations, and pricing structures"}
              {activeTab === 2 && "Easily view all booked product demos and manage or remove unnecessary bookings."}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Fade>
  )
}

export default AdminNavbar
