'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  CardContent,
  Divider,
  Typography,
  Paper,
  Button,
  StepConnector
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { styled } from '@mui/material/styles'
import { stepConnectorClasses } from '@mui/material/StepConnector'

// Import icons
import GroupIcon from '@mui/icons-material/Group'
import DescriptionIcon from '@mui/icons-material/Description'
import SettingsIcon from '@mui/icons-material/Settings'

// Import step content components
import PartnerDetails from './partnerDetails'
import ProductConfig from './productConfig'
import NewProductForm from './newProductForm'

// Map of custom icons
const StepIcons = [GroupIcon, DescriptionIcon, SettingsIcon, GroupIcon, SettingsIcon]

// Custom Step Icon Component
const CustomStepIcon = (props) => {
  const { active, completed, icon } = props
  const index = Number(icon) - 1
  const IconComponent = StepIcons[index]

  return (
    <Box
      sx={{
        backgroundColor: active || completed ? '#1976d2' : '#e0e0e0',
        color: '#fff',
        width: 40,
        height: 40,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
      }}
    >
      {IconComponent ? <IconComponent /> : icon}
    </Box>
  )
}

// Custom Step Connector
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: '#1976d2',
  },
}))

// Main Page Component
const Page = ({ params }) => {
  const [activeStep, setActiveStep] = useState(0)
  const [partnerData, setPartnerData] = useState({})
  const router = useRouter()

  const steps = ['Client Details', 'Communication Details' ,'Select Report Type','Employee Allocation', 'Configure Report Form']

  useEffect(() => {
    const getParams = async () => {
      try {
        const resolvedParams = await Promise.resolve(params)
        const { partnerDetails } = resolvedParams
        setPartnerData(partnerDetails)
      } catch (error) {
        console.error('Error resolving params:', error)
      }
    }

    getParams()
  }, [params])

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
      case 1:
        return <PartnerDetails id={partnerData} activeStep={activeStep} setActiveStep={setActiveStep}/>
      case 2:
        return <ProductConfig />
      case 3:
      case 4:
        return <NewProductForm activeStep={activeStep} setActiveStep={setActiveStep} />
      default:
        return null
    }
  }

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
      {/* Stepper Header */}
      <Box sx={{ px: 2, py: 1, mt:4}}>
      <Stepper activeStep={activeStep} alternativeLabel connector={<CustomConnector />}>
  {steps.map((label, index) => (
    <Step key={index} onClick={() => setActiveStep(index)} style={{ cursor: 'pointer' }}>
      <StepLabel StepIconComponent={CustomStepIcon}>
        <Typography variant="body2">{label}</Typography>
      </StepLabel>
    </Step>
  ))}
</Stepper>
      </Box>

      {/* Step Content */}
      <CardContent sx={{ mt: '-10px', width: '100%' }}>
        {renderStepContent(activeStep)}

        {/* Step Navigation */}
        <Box display="flex" justifyContent="flex-end" gap={3} my={4}>
          <Button
            variant="outlined"
            onClick={() => setActiveStep((prev) => prev - 1)}
            disabled={activeStep === 0}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (activeStep === steps.length - 1) {
                router.back()
              } else {
                setActiveStep((prev) => prev + 1)
              }
            }}
          >
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </CardContent>
      <Divider />
    </Paper>
  )
}

export default Page
