"use client"

import { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Container,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import {
  Briefcase,
  Search,
  MessageSquare,
  FileCheck,
  UserCheck,
  Send,
  FileText,
  ThumbsUp,
  UserPlus,
  ChevronRight,
  Info,
} from "lucide-react"

const HiringFlowScreen = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [expandedStage, setExpandedStage] = useState(null)

  const toggleStageExpand = (stageId) => {
    if (expandedStage === stageId) {
      setExpandedStage(null)
    } else {
      setExpandedStage(stageId)
    }
  }

  const stages = [
    {
      id: 1,
      orgStage: {
        name: "JOB POSTING",
        description: "Create and publish job opening",
        icon: <Briefcase size={24} />,
        color: theme.palette.primary.main,
        details: [
          "Define job requirements",
          "Set compensation range",
          "Publish on job boards",
          "Promote on social media",
        ],
      },
      candidateStage: {
        name: "APPLY",
        description: "Submit application and resume",
        icon: <Send size={24} />,
        color: theme.palette.secondary.main,
        details: ["Find job posting", "Prepare resume and cover letter", "Submit application", "Receive confirmation"],
      },
    },
    {
      id: 2,
      orgStage: {
        name: "SCREENING",
        description: "Review applications and resumes",
        icon: <Search size={24} />,
        color: theme.palette.primary.main,
        details: [
          "Review all applications",
          "Filter based on qualifications",
          "Conduct initial phone screens",
          "Select candidates for interviews",
        ],
      },
      candidateStage: {
        name: "PRE INTERVIEW",
        description: "Prepare for upcoming interview",
        icon: <FileText size={24} />,
        color: theme.palette.secondary.main,
        details: [
          "Research the company",
          "Prepare for common questions",
          "Plan interview outfit",
          "Schedule interview time",
        ],
      },
    },
    {
      id: 3,
      orgStage: {
        name: "INTERVIEW",
        description: "Conduct candidate interviews",
        icon: <MessageSquare size={24} />,
        color: theme.palette.primary.main,
        details: [
          "Conduct technical assessment",
          "Evaluate cultural fit",
          "Multiple interview rounds",
          "Collect team feedback",
        ],
      },
      candidateStage: {
        name: "PRE OFFER",
        description: "Await hiring decision",
        icon: <ThumbsUp size={24} />,
        color: theme.palette.secondary.main,
        details: [
          "Complete all interviews",
          "Send follow-up thank you",
          "Provide additional information if requested",
          "Wait for decision",
        ],
      },
    },
    {
      id: 4,
      orgStage: {
        name: "OFFER LETTER",
        description: "Extend job offer to selected candidate",
        icon: <FileCheck size={24} />,
        color: theme.palette.primary.main,
        details: [
          "Prepare offer package",
          "Get approval from management",
          "Send formal offer letter",
          "Negotiate terms if needed",
        ],
      },
      candidateStage: {
        name: "PRE JOINING",
        description: "Complete pre-joining formalities",
        icon: <UserPlus size={24} />,
        color: theme.palette.secondary.main,
        details: ["Review offer details", "Negotiate if needed", "Accept offer", "Complete background check"],
      },
    },
    {
      id: 5,
      orgStage: {
        name: "JOINING",
        description: "Complete onboarding process",
        icon: <UserCheck size={24} />,
        color: theme.palette.primary.main,
        details: [
          "Prepare onboarding materials",
          "Set up workstation and access",
          "Schedule orientation",
          "Assign mentor/buddy",
        ],
      },
      candidateStage: {
        name: "FIRST DAY",
        description: "Begin new role at company",
        icon: <Briefcase size={24} />,
        color: theme.palette.secondary.main,
        details: ["Complete paperwork", "Attend orientation", "Meet the team", "Begin training program"],
      },
    },
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          borderRadius: 2,
        }}
      >
        <Typography variant="h3" component="h1" align="center" sx={{ color: "white", fontWeight: "bold", mb: 1 }}>
          Hiring Process Flow
        </Typography>
        <Typography variant="h6" align="center" sx={{ color: "rgba(255,255,255,0.9)" }}>
          Organization and Candidate Journey
        </Typography>
      </Paper>

      {/* Legend */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 4,
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              bgcolor: theme.palette.primary.main,
              mr: 1,
            }}
          />
          <Typography variant="subtitle1" fontWeight="bold">
            Organization
          </Typography>
        </Box>
        <Box sx={{ mx: 2, display: isMobile ? "none" : "block" }}>|</Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              bgcolor: theme.palette.secondary.main,
              mr: 1,
            }}
          />
          <Typography variant="subtitle1" fontWeight="bold">
            Candidate
          </Typography>
        </Box>
        <Box sx={{ mx: 2, display: isMobile ? "none" : "block" }}>|</Box>
        <Typography variant="body2" color="text.secondary">
          Click on any stage for details
        </Typography>
      </Box>

      {/* Flow Visualization */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        {stages.map((stage, index) => (
          <Box key={stage.id}>
            {/* Stage Row */}
            <Grid container spacing={2} alignItems="center">
              {/* Stage Number */}
              <Grid item xs={12} md={1} sx={{ textAlign: "center" }}>
                <Chip
                  label={`Stage ${stage.id}`}
                  sx={{
                    fontWeight: "bold",
                    bgcolor: "grey.200",
                    fontSize: "0.9rem",
                    height: 32,
                  }}
                />
              </Grid>

              {/* Organization Side */}
              <Grid item xs={12} md={5}>
                <Card
                  sx={{
                    borderLeft: `4px solid ${stage.orgStage.color}`,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      boxShadow: 4,
                      transform: "translateY(-2px)",
                    },
                  }}
                  onClick={() => toggleStageExpand(stage.id + "org")}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box display="flex" alignItems="center">
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: "50%",
                            bgcolor: `${stage.orgStage.color}15`,
                            color: stage.orgStage.color,
                            mr: 2,
                          }}
                        >
                          {stage.orgStage.icon}
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {stage.orgStage.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {stage.orgStage.description}
                          </Typography>
                        </Box>
                      </Box>
                      <Tooltip title="View details">
                        <IconButton size="small">
                          <Info size={18} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
                {expandedStage === stage.id + "org" && (
                  <Paper
                    elevation={0}
                    sx={{
                      mt: 1,
                      p: 2,
                      bgcolor: "grey.50",
                      borderRadius: 1,
                      borderLeft: `4px solid ${stage.orgStage.color}`,
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                      Key Activities:
                    </Typography>
                    <Grid container spacing={1}>
                      {stage.orgStage.details.map((detail, idx) => (
                        <Grid item xs={12} sm={6} key={idx}>
                          <Box display="flex" alignItems="center">
                            <ChevronRight size={16} color={stage.orgStage.color} />
                            <Typography variant="body2">{detail}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                )}
              </Grid>

              {/* Enhanced Flow Connector */}
              <Grid item xs={12} md={1} sx={{ textAlign: "center", position: "relative" }}>
                {/* Mobile horizontal line */}
                <Box
                  sx={{
                    height: "2px",
                    width: "100%",
                    bgcolor: "grey.300",
                    my: 2,
                    display: { xs: "block", md: "none" },
                  }}
                />

                {/* Desktop connector */}
                <Box
                  sx={{
                    display: { xs: "none", md: "flex" },
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    position: "relative",
                    minHeight: "80px",
                  }}
                >
                  {/* Connecting line */}
                  <Box
                    sx={{
                      position: "absolute",
                      width: "2px",
                      height: "100%",
                      bgcolor: "grey.300",
                      left: "50%",
                      transform: "translateX(-50%)",
                      zIndex: 1,
                    }}
                  />

                  {/* Left arrow pointing to candidate */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: "20%",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: "30px",
                        height: "2px",
                        bgcolor: theme.palette.primary.main,
                        position: "relative",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          right: "-6px",
                          top: "-3px",
                          width: 0,
                          height: 0,
                          borderLeft: "6px solid " + theme.palette.primary.main,
                          borderTop: "4px solid transparent",
                          borderBottom: "4px solid transparent",
                        },
                      }}
                    />
                  </Box>

                  {/* Right arrow pointing back to organization */}
                  <Box
                    sx={{
                      position: "absolute",
                      right: "20%",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: "30px",
                        height: "2px",
                        bgcolor: theme.palette.secondary.main,
                        position: "relative",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          left: "-6px",
                          top: "-3px",
                          width: 0,
                          height: 0,
                          borderRight: "6px solid " + theme.palette.secondary.main,
                          borderTop: "4px solid transparent",
                          borderBottom: "4px solid transparent",
                        },
                      }}
                    />
                  </Box>

                  {/* Central connection point */}
                  <Box
                    sx={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      bgcolor: "white",
                      border: "2px solid grey.400",
                      zIndex: 3,
                      position: "relative",
                    }}
                  />
                </Box>
              </Grid>

              {/* Candidate Side */}
              <Grid item xs={12} md={5}>
                <Card
                  sx={{
                    borderLeft: `4px solid ${stage.candidateStage.color}`,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      boxShadow: 4,
                      transform: "translateY(-2px)",
                    },
                  }}
                  onClick={() => toggleStageExpand(stage.id + "candidate")}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box display="flex" alignItems="center">
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: "50%",
                            bgcolor: `${stage.candidateStage.color}15`,
                            color: stage.candidateStage.color,
                            mr: 2,
                          }}
                        >
                          {stage.candidateStage.icon}
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {stage.candidateStage.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {stage.candidateStage.description}
                          </Typography>
                        </Box>
                      </Box>
                      <Tooltip title="View details">
                        <IconButton size="small">
                          <Info size={18} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
                {expandedStage === stage.id + "candidate" && (
                  <Paper
                    elevation={0}
                    sx={{
                      mt: 1,
                      p: 2,
                      bgcolor: "grey.50",
                      borderRadius: 1,
                      borderLeft: `4px solid ${stage.candidateStage.color}`,
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                      Key Activities:
                    </Typography>
                    <Grid container spacing={1}>
                      {stage.candidateStage.details.map((detail, idx) => (
                        <Grid item xs={12} sm={6} key={idx}>
                          <Box display="flex" alignItems="center">
                            <ChevronRight size={16} color={stage.candidateStage.color} />
                            <Typography variant="body2">{detail}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                )}
              </Grid>
            </Grid>

            {/* Divider between stages */}
            {index < stages.length - 1 && (
              <Box sx={{ my: 3, px: 4 }}>
                <Divider />
              </Box>
            )}
          </Box>
        ))}
      </Paper>

      {/* Overall Flow Connection */}
      <Paper elevation={1} sx={{ mt: 4, p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" align="center" mb={2}>
          Process Flow Connection
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: theme.palette.primary.main,
                mr: 1,
              }}
            />
            <Typography variant="body2">Organization initiates</Typography>
          </Box>
          <ChevronRight size={20} color={theme.palette.grey[600]} />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: theme.palette.secondary.main,
                mr: 1,
              }}
            />
            <Typography variant="body2">Candidate responds</Typography>
          </Box>
          <ChevronRight size={20} color={theme.palette.grey[600]} />
          <Typography variant="body2" color="text.secondary">
            Continuous interaction throughout the process
          </Typography>
        </Box>
      </Paper>

      {/* Footer */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          This visualization shows the parallel journey of both organization and candidate throughout the hiring
          process.
        </Typography>
      </Box>
    </Container>
  )
}

export default HiringFlowScreen
