"use client"

// Next Imports
import { useRouter } from "next/navigation"
import { useAuth } from "../../../context/AuthContext"

// MUI Imports
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Avatar from "@mui/material/Avatar"
import IconButton from "@mui/material/IconButton"
import { Logout } from "@mui/icons-material"

const UserDropdown = () => {
  // Get user data and logout function
  const { logout } = useAuth()
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');

  // Hooks
  const router = useRouter()

  // Handle profile navigation
  const handleProfileClick = () => {
    router.push("/Profile")
  }

  // Handle logout
  const handleLogout = (e) => {
    e.stopPropagation() // Prevent profile navigation when clicking logout
    logout()
  }

  return (
    <ListItemButton
      onClick={handleProfileClick}
      sx={{
        borderRadius: 1.5,
        width: "100%",
        "&:hover": {
          backgroundColor: "action.hover",
        },
        // pr: 1, // Reduce right padding to accommodate logout button
        pl : 3,
      }}
    >
      <ListItemIcon sx={{ minWidth: 40 }}>
        <Avatar
          alt={userData?.name || ""}
          src={userData?.photo}
          sx={{
            width: 25,
            height: 26,
          }}
        />
      </ListItemIcon>
      <ListItemText
        primary={userData?.name || ''}
        primaryTypographyProps={{
          fontWeight: 500,
          fontSize: "0.875rem",
        }}
        sx={{
          whiteSpace: 'nowrap',         // ✅ keep it on one line
          overflow: 'hidden',           // ✅ hide overflowed text
          textOverflow: 'ellipsis',     // ✅ add ... if it overflows
        }}
      />
      <IconButton
        onClick={handleLogout}
        size="small"
        sx={{
          color: "error.main",
          "&:hover": {
            backgroundColor: "error.light",
            color: "error.dark",
          },
        }}
      >
        <Logout sx={{ fontSize: 18 }} />
      </IconButton>
    </ListItemButton>
  )
}

export default UserDropdown
