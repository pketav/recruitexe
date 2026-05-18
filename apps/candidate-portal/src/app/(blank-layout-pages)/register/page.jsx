// Component Imports
import Register from '@/views/Register'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata = {
  title: 'Login',
  description: 'Login to your account'
}

const RegistrationPage = async () => {
  // Vars
  const mode = await getServerMode()

  return <Register mode={mode} />
}

export default RegistrationPage