// MUI Imports
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'
import { AuthProvider } from '../context/AuthContext'
import ProtectedRoute from '../components/ProtectedRoute'
import { SnackbarProvider, useSnackbarContext } from './SnackbarContext'
import PortalInfo from '../components/PortalInfo'

export const metadata = {
  title: 'Recruitexe -Career',
  // icons: {
  //   icon: '/logo.png',
  // },
  // description:
  //   'Fincoopers Tech HRMS'
}

const RootLayout = async props => {
  const { children } = props

  // Vars
  const systemMode = await getSystemMode()
  const direction = 'ltr'

  return (

    <html id='__next' lang='en' dir={direction} suppressHydrationWarning>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        <AuthProvider>
          <ProtectedRoute>
            <PortalInfo />
            <SnackbarProvider>
              <InitColorSchemeScript attribute='data' defaultMode={systemMode} />
              {children}
            </SnackbarProvider>
          </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>

  )
}

export default RootLayout
