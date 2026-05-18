import { Card, CardContent, Stepper, Step, StepLabel } from "@mui/material"

const INTERVIEW_STEPS = ["Welcome", "Setup", "Interview", "Complete"]

export default function InterviewStepper({ currentStep }) {
  return (
    <Card sx={{ mb: 3, bgcolor: "white", boxShadow: 2, border: "1px solid #e2e8f0" }}>
      <CardContent>
        <Stepper activeStep={currentStep} alternativeLabel>
          {INTERVIEW_STEPS.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </CardContent>
    </Card>
  )
}
