"use client"

import { useState } from "react"
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
  Container,
} from "@mui/material"
import {
  ExpandLess,
  ExpandMore,
  Person,
  Security,
  Extension,
  Settings as SettingsIcon,
  Palette,
  Category as CategoryIcon,
  Flight,
  Receipt,
  Assessment,
  Payments,
  ShoppingCart,
  AccountBalance,
  People,
  Business,
  Storefront,
} from "@mui/icons-material"

const SettingsSidebar = ({ activePage, setActivePage }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const [openUserControl, setOpenUserControl] = useState(true)
  const [openCustomization, setOpenCustomization] = useState(true)
  const [openModules, setOpenModules] = useState(true) // New state for Modules section

  const handleUserControlClick = () => {
    setOpenUserControl(!openUserControl)
  }

  const handleCustomizationClick = () => {
    setOpenCustomization(!openCustomization)
  }

  const handleModulesClick = () => {
    setOpenModules(!openModules)
  }

  const handlePageChange = (page) => {
    setActivePage(page)
  }

  return (
    <Container maxWidth='xl'>
    <Paper     
    >
      <List component="nav" aria-label="settings navigation">
        <ListItemButton onClick={handleUserControlClick}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="User & Control" />
          {openUserControl ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openUserControl} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} selected={activePage === "user"} onClick={() => handlePageChange("user")}>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText primary="User" />
            </ListItemButton>

            <ListItemButton
              sx={{ pl: 4 }}
              selected={activePage === "policies"}
              onClick={() => handlePageChange("policies")}
            >
              <ListItemIcon>
                <Security />
              </ListItemIcon>
              <ListItemText primary="Policies" />
            </ListItemButton>
          </List>
        </Collapse>

        <Divider />

        <ListItemButton onClick={handleCustomizationClick}>
          <ListItemIcon>
            <Palette />
          </ListItemIcon>
          <ListItemText primary="Customization" />
          {openCustomization ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openCustomization} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {/* Modules is now a collapsible section */}
            <ListItemButton sx={{ pl: 4 }} selected={activePage === "modules"} onClick={handleModulesClick}>
              <ListItemIcon>
                <Extension />
              </ListItemIcon>
              <ListItemText primary="Modules" />
              {openModules ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            {/* Module options based on the image */}
            <Collapse in={openModules} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 8 }}
                  selected={activePage === "trips"}
                  onClick={() => handlePageChange("trips")}
                >
                  <ListItemIcon>
                    <Flight /> 
                  </ListItemIcon>
                  <ListItemText primary="Trips" />
                </ListItemButton>

                <ListItemButton
                  sx={{ pl: 8 }}
                  selected={activePage === "expenses"}
                  onClick={() => handlePageChange("expenses")}
                >
                  <ListItemIcon>
                    <Receipt />
                  </ListItemIcon>
                  <ListItemText primary="Expenses" />
                </ListItemButton>

                <ListItemButton
                  sx={{ pl: 8 }}
                  selected={activePage === "reports"}
                  onClick={() => handlePageChange("reports")}
                >
                  <ListItemIcon>
                    <Assessment />
                  </ListItemIcon>
                  <ListItemText primary="Reports" />
                </ListItemButton>

                <ListItemButton
                  sx={{ pl: 8 }}
                  selected={activePage === "advances"}
                  onClick={() => handlePageChange("advances")}
                >
                  <ListItemIcon>
                    <Payments />
                  </ListItemIcon>
                  <ListItemText primary="Advances" />
                </ListItemButton>

                <ListItemButton
                  sx={{ pl: 8 }}
                  selected={activePage === "purchaseRequests"}
                  onClick={() => handlePageChange("purchaseRequests")}
                >
                  <ListItemIcon>
                    <ShoppingCart />
                  </ListItemIcon>
                  <ListItemText primary="Purchase Requests" />
                </ListItemButton>

                <ListItemButton
                  sx={{ pl: 8 }}
                  selected={activePage === "category"}
                  onClick={() => handlePageChange("category")}
                >
                  <ListItemIcon>
                    <CategoryIcon />
                  </ListItemIcon>
                  <ListItemText primary="Categories" />
                </ListItemButton>

                <ListItemButton
                  sx={{ pl: 8 }}
                  selected={activePage === "paidThroughAccounts"}
                  onClick={() => handlePageChange("paidThroughAccounts")}
                >
                  <ListItemIcon>
                    <AccountBalance />
                  </ListItemIcon>
                  <ListItemText primary="Paid Through Accounts" />
                </ListItemButton>

                <ListItemButton
                  sx={{ pl: 8 }}
                  selected={activePage === "customers"}
                  onClick={() => handlePageChange("customers")}
                >
                  <ListItemIcon>
                    <People />
                  </ListItemIcon>
                  <ListItemText primary="Customers" />
                </ListItemButton>

                <ListItemButton
                  sx={{ pl: 8 }}
                  selected={activePage === "projects"}
                  onClick={() => handlePageChange("projects")}
                >
                  <ListItemIcon>
                    <Business />
                  </ListItemIcon>
                  <ListItemText primary="Projects" />
                </ListItemButton>

                <ListItemButton
                  sx={{ pl: 8 }}
                  selected={activePage === "merchants"}
                  onClick={() => handlePageChange("merchants")}
                >
                  <ListItemIcon>
                    <Storefront />
                  </ListItemIcon>
                  <ListItemText primary="Merchants" />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
        </Collapse>
      </List>
    </Paper>
    </Container>
  )
}

export default SettingsSidebar
