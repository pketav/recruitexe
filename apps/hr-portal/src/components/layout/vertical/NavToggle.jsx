'use client'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

const NavToggle = ({setCollapsed}) => {
  // Hooks
  const { toggleVerticalNav, isBreakpointReached } = useVerticalNav()

  const handleClick = () => {
    toggleVerticalNav()
    setCollapsed(false)
  }

  return (
    <>
      {/* <i className='tabler-menu-2 cursor-pointer' onClick={handleClick} /> */}
      {/* Comment following code and uncomment above code in order to toggle menu on desktop screens as well */}
       <i className='tabler-menu-2 cursor-pointer' onClick={handleClick} />
    </>
  )
}

export default NavToggle
