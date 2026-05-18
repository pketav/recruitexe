// MUI Imports
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript"

// Third-party Imports
import "react-perfect-scrollbar/dist/css/styles.css"

// Util Imports
import { getSystemMode } from "@core/utils/serverHelpers"

// Style Imports
import "@/app/globals.css"

// Generated Icon CSS Imports
import "@assets/iconify-icons/generated-icons.css"

import { AuthProvider } from "../context/AuthContext"
import ProtectedRoute from "../components/ProtectedRoute"
import { SnackbarProvider } from "./(dashboard)/components/SnackbarContext"
import ClientLayout from "./client-layout"
import PlanGuard from "../components/PlanGuard"

export const metadata = {
  title: "HRMS - Fincoopers Tech",
  icons: {
    icon: "/Vector.svg",
  },
  description: "Empowering organizations with intelligent HR solutions for the digital age",
}

const RootLayout = async (props) => {
  const { children } = props

  // Vars
  const systemMode = await getSystemMode()
  const direction = "ltr"

  return (
    <html id="__next" lang="en" dir={direction} suppressHydrationWarning>
      <head>
        <InitColorSchemeScript attribute="data" defaultMode={systemMode} />
      </head>
      <body className="flex is-full min-bs-full flex-auto flex-col">
        <AuthProvider>
          <ProtectedRoute>
            <SnackbarProvider>
              <PlanGuard>
                <ClientLayout>{children}</ClientLayout>
              </PlanGuard>
            </SnackbarProvider>
          </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  )
}

export default RootLayout
