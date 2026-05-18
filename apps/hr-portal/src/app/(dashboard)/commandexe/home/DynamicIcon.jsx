"use client"

import * as TablerIcons from "@tabler/icons-react"

const Icon = ({ icon, ...rest }) => {
  // Extract the icon name from the format "tabler:icon-name"
  const iconName = icon.startsWith("tabler:") ? icon.substring(7) : icon

  // Convert kebab-case to PascalCase for Tabler icons
  const formattedIconName =
    "Icon" +
    iconName
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("")

  // Get the icon component from TablerIcons
  const IconComponent = TablerIcons[formattedIconName]

  if (!IconComponent) {
    console.warn(`Icon not found: ${icon} (${formattedIconName})`)
    return null
  }

  return <IconComponent {...rest} />
}

export default Icon
