// Third-party Imports
import styled from "@emotion/styled"

// Hook Imports
import useVerticalNav from "../../hooks/useVerticalNav"

// Util Imports
import { verticalNavClasses } from "../../utils/menuClasses"

const StyledNavHeader = styled.div`
  padding-inline-start: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: ${({ transitionDuration }) => `padding-inline ${transitionDuration}ms ease-in-out`};

`

const NavHeader = ({ children }) => {
  // Hooks
  const { isHovered, isCollapsed, collapsedWidth, transitionDuration } = useVerticalNav()

  return (
    <StyledNavHeader
      // className={verticalNavClasses.header}
      isHovered={isHovered}
      isCollapsed={isCollapsed}
      collapsedWidth={collapsedWidth}
      transitionDuration={transitionDuration}
    >
      {children}
    </StyledNavHeader>
  )
}

export default NavHeader
