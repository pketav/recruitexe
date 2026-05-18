"use client"

// React Imports
import { useEffect, useRef, useState } from "react"

// Next Imports
import Link from "next/link"

// MUI Imports
import { styled, useColorScheme, useTheme } from "@mui/material/styles"
import { Box } from "@mui/material"

// Component Imports
import VerticalNav, { NavHeader } from "@menu/vertical-menu"
import VerticalMenu from "./VerticalMenu"
import Logo from "@components/layout/shared/Logo"

// Hook Imports
import useVerticalNav from "@menu/hooks/useVerticalNav"
import { useSettings } from "@core/hooks/useSettings"
import NavToggle from "./NavToggle"

// Style Imports
import navigationCustomStyles from "@core/styles/vertical/navigationCustomStyles"

const StyledBoxForShadow = styled("div")(({ theme }) => ({
  top: 60,
  left: -8,
  zIndex: 2,
  opacity: 0,
  position: "absolute",
  pointerEvents: "none",
  width: "calc(100% + 15px)",
  height: theme.mixins.toolbar.minHeight,
  transition: "opacity .15s ease-in-out",
  background: `linear-gradient(var(--mui-palette-background-paper) ${theme.direction === "rtl" ? "95%" : "5%"}, rgb(var(--mui-palette-background-paperChannel) / 0.85) 30%, rgb(var(--mui-palette-background-paperChannel) / 0.5) 65%, rgb(var(--mui-palette-background-paperChannel) / 0.3) 75%, transparent)`,
  "&.scrolled": {
    opacity: 1,
  },
}))

const Navigation = (props) => {
  // Props
  const { mode } = props
  const [collapsed, setCollapsed] = useState(true)

  // Hooks
  const verticalNavOptions = useVerticalNav()
  const { updateSettings, settings } = useSettings()
  const { mode: muiMode, systemMode: muiSystemMode } = useColorScheme()
  const theme = useTheme()

  // Refs
  const shadowRef = useRef(null)
  const navWrapperRef = useRef(null)
  const overlayRef = useRef(null)

  // Vars
  const { isCollapsed, isHovered, collapseVerticalNav, isBreakpointReached } = verticalNavOptions
  const isSemiDark = settings.semiDark
  const currentMode = muiMode === "system" ? muiSystemMode : muiMode || mode
  const isDark = currentMode === "dark"

  const scrollMenu = (container, isPerfectScrollbar) => {
    container = isBreakpointReached || !isPerfectScrollbar ? container.target : container
    if (shadowRef && container.scrollTop > 0) {
      if (!shadowRef.current.classList.contains("scrolled")) {
        shadowRef.current.classList.add("scrolled")
      }
    } else {
      shadowRef.current.classList.remove("scrolled")
    }
  }

  // Mobile menu functions
  const toggleMobileMenu = () => {
    if (navWrapperRef.current && overlayRef.current) {
      const isOpen = navWrapperRef.current.classList.contains("mobile-open")
      if (isOpen) {
        navWrapperRef.current.classList.remove("mobile-open")
        overlayRef.current.classList.remove("open")
      } else {
        navWrapperRef.current.classList.add("mobile-open")
        overlayRef.current.classList.add("open")
      }
    }
  }

  const closeMobileMenu = () => {
    if (navWrapperRef.current && overlayRef.current) {
      navWrapperRef.current.classList.remove("mobile-open")
      overlayRef.current.classList.remove("open")
    }
  }

  // Hover functions for desktop
  const handleMouseEnter = () => {
    if (!isBreakpointReached) {
      collapseVerticalNav(false)
      setCollapsed(false)
    }
  }

  const handleMouseLeave = () => {
    if (!isBreakpointReached) {
      collapseVerticalNav(true)
      setCollapsed(true)
    }
  }

  useEffect(() => {
    if (settings.layout === "collapsed") {
      collapseVerticalNav(true)
    } else {
      collapseVerticalNav(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.layout])

  useEffect(() => {
    collapseVerticalNav(true)
  }, [])

  // Custom styles to remove horizontal scroll and add border radius
  const customNavStyles = {
    ...navigationCustomStyles(verticalNavOptions, theme),
    "& .MuiPaper-root": {
      overflowX: "hidden !important",
      maxWidth: "100%",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1) !important",
      ...navigationCustomStyles(verticalNavOptions, theme)?.["& .MuiPaper-root"],
    },
    "& .vertical-nav": {
      overflowX: "hidden !important",
      maxWidth: "100%",
    },
    "& .nav-item": {
      overflowX: "hidden !important",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    },
    "& .nav-link": {
      overflowX: "hidden !important",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      maxWidth: "100%",
    },
    "& .menu-content": {
      overflowX: "hidden !important",
      maxWidth: "100%",
    },
    overflowX: "hidden !important",
    // borderRadius: "0px 26px !important",
    margin: "0px",
  }

  return (
    <>
      {/* Mobile Menu Button */}
      {/* <button className="mobile-menu-button" onClick={toggleMobileMenu}>
        <svg viewBox="0 0 24 24">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
        </svg>
      </button> */}
      {isBreakpointReached ? (
        <Box sx={{ margin: "20px 0px 0px 20px" , position : "absolute" }}>
          {" "}
          <NavToggle setCollapsed={setCollapsed} />
        </Box>
      ) : null}
      {/* Mobile Overlay */}
      <div ref={overlayRef} className="mobile-nav-overlay" onClick={closeMobileMenu} />
      {/* Single Responsive Navigation */}
      <div ref={navWrapperRef} className="vertical-nav-wrapper">
        <VerticalNav
          customStyles={customNavStyles}
          collapsedWidth={64}
          backgroundColor="var(--mui-palette-background-paper)"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          // The following condition adds the data-dark attribute to the VerticalNav component
          // when semiDark is enabled and the mode or systemMode is light
          {...(isSemiDark &&
            !isDark && {
              "data-dark": "",
            })}
          sx={{
            overflowX: "hidden !important",
            maxWidth: "100%",
            height: "calc(100vh)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            "& *": {
              overflowX: "hidden !important",
              maxWidth: "100%",
            },
            "& .MuiList-root": {
              overflowX: "hidden !important",
              width: "100%",
            },
            "& .MuiListItem-root": {
              overflowX: "hidden !important",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            },
            "& .MuiListItemText-root": {
              overflowX: "hidden !important",
              "& span": {
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
                maxWidth: "100%",
                display: "block",
              },
            },
            "& .MuiTypography-root": {
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
              maxWidth: "100%",
            },
          }}
        >
          {/* Nav Header including Logo & nav toggle icons  */}
          <NavHeader>
            <Box sx={{ py : 5}}>
              <Link href="/">
                <Logo />
              </Link>
            </Box>
            {/* {!(isCollapsed && !isHovered) && (
              <NavCollapseIcons
                lockedIcon={<i className="tabler-circle-dot text-xl" />}
                unlockedIcon={<i className="tabler-circle text-xl" />}
                closeIcon={<i className="tabler-x text-xl" />}
                onClick={() => updateSettings({ layout: !isCollapsed ? "collapsed" : "vertical" })}
              />
            )} */}
          </NavHeader>
          {/* <StyledBoxForShadow ref={shadowRef} /> */}
          <VerticalMenu scrollMenu={scrollMenu} verticalNavOptions={verticalNavOptions} />
        </VerticalNav>
      </div>
    </>
  )
}

export default Navigation
