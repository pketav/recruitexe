'use client'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import NavToggle from './NavToggle'
import Logo from '@components/layout/shared/Logo'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import UserDropdown from '@components/layout/shared/UserDropdown'

// Hook Imports
import useHorizontalNav from '@menu/hooks/useHorizontalNav'

// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'

const NavbarContent = () => {
  // Hooks
  const { isBreakpointReached } = useHorizontalNav()

  return (
    <div
      className={classnames(horizontalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}
    >
      <div className='flex items-center gap-4'>
        <NavToggle />
        {/* Hide Logo on Smaller screens */}
        {!isBreakpointReached && <Logo />}
      </div>
      <div className='flex items-center'>
      <Box sx={{display:"flex", gap:4, alignItems:"center"}}>
        {/* <IconButton onClick={() => router.push("/employeeSetup")}>
          <Box sx={{ fontSize: 35, display:"flex", alignItems:"center" }}>
            <SettingsSuggestIcon fontSize="inherit" color="primary" sx={{color:"#1A237E"}} />
          </Box>
        </IconButton> */}
        <ModeDropdown />
        {/* <UserDropdown /> */}
      </Box>
      </div>
    </div>
  )
}

export default NavbarContent
