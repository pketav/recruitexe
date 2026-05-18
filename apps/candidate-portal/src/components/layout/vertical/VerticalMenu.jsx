"use client"

// MUI Imports
import { useTheme } from "@mui/material/styles"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Avatar from "@mui/material/Avatar"

// Third-party Imports
import PerfectScrollbar from "react-perfect-scrollbar"

// Component Imports
import { Menu, MenuItem } from "@menu/vertical-menu"

// Hook Imports
import useVerticalNav from "@menu/hooks/useVerticalNav"

// Styled Component Imports
import StyledVerticalNavExpandIcon from "@menu/styles/vertical/StyledVerticalNavExpandIcon"

// Style Imports
import menuItemStyles from "@core/styles/vertical/menuItemStyles"
import menuSectionStyles from "@core/styles/vertical/menuSectionStyles"

const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className="tabler-chevron-right" />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions
  const ScrollWrapper = isBreakpointReached ? "div" : PerfectScrollbar

  return (
    <>
      {/* Logo Section */}
      {/* <Box
        sx={{
          py: 3,
          px: 4,
          display: "flex",
          alignItems: "center",
          borderBottom: `1px solid ${theme.palette.divider}`,
          mb: 1,
        }}
      >
        <Avatar
          src="/images/logo.png"
          alt="Company Logo"
          variant="rounded"
          sx={{
            width: 40,
            height: 40,
            mr: 2,
            background: theme.palette.primary.main,
          }}
        >
          CP
        </Avatar>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            letterSpacing: "0.15px",
          }}
        >
          Candidate Portal
        </Typography>
      </Box> */}

      {/* Menu Scroll Area */}
      <ScrollWrapper
        {...(isBreakpointReached
          ? {
            className: "bs-full overflow-y-auto overflow-x-hidden",
            onScroll: (container) => scrollMenu(container, false),
          }
          : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: (container) => scrollMenu(container, true),
          })}
      >
        {/* Vertical Menu */}
        <Menu
          popoutMenuOffset={{ mainAxis: 23 }}
          menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
          renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
          renderExpandedMenuItemIcon={{ icon: <i className="tabler-circle text-xs" /> }}
          menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
        >
          <MenuItem href="/completeProfile" icon={<i className="tabler-user" />}>
            Profile
          </MenuItem>
          <MenuItem href="/Careers" icon={<i className="tabler-briefcase" />}>
            Careers
          </MenuItem>
          {/* <MenuItem href="/applications" icon={<i className="tabler-file-description" />}>
            Applications
          </MenuItem> */}
          {/* <MenuItem href="/home" icon={<i className="tabler-dashboard" />}>
            Dashboard
          </MenuItem> */}

        </Menu>
      </ScrollWrapper>
    </>
  )
}

export default VerticalMenu
