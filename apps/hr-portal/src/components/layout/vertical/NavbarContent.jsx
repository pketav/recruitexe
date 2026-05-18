'use client'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import NavToggle from './NavToggle'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'
import { Box, IconButton } from '@mui/material'
import { useRouter } from 'next/navigation'

const NavbarContent = () => {
  const router = useRouter()
  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
      <div className='flex items-center gap-4'>
        <NavToggle />
        {/* <ModeDropdown /> */}
      </div>
      <Box sx={{display:"flex", gap:4, alignItems:"center"}}>
      <IconButton onClick={() => router.push("/employeeSetup")}>
        <Box sx={{ fontSize: 35, display:"flex", alignItems:"center" }}>
          <SettingsSuggestIcon fontSize="inherit" color="primary" sx={{color:"#1A237E"}} />
        </Box>
      </IconButton>
        <UserDropdown />
      </Box>
    </div>
  )
}

export default NavbarContent
