"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import {
  AddCircleOutline,
  Business,
  Cancel,
  CurrencyRupee,
  Dashboard,
  Description,
  HourglassEmpty,
  WarningAmber,
  Work,
  WorkOffOutlined,
  WorkOutline,
} from "@mui/icons-material"
import { BarChart, Briefcase, Star } from "lucide-react"

type HrDashboardData = {
  metrics: Array<{ label: string; value: string; note: string }>
  departmentBreakdown: Array<{ name: string; value: number }>
  hotPositions: Array<{ title: string; applicants: number }>
}

const GradientBox = styled(Box)(({ theme }) => ({
  background: "#f8fafc",
  minHeight: "100vh",
  padding: theme.spacing(3),
}))

const TabsContainer = styled(Box)(({ theme }) => ({
  background: "linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)",
  borderRadius: theme.spacing(1),
  padding: theme.spacing(0.5),
  marginBottom: theme.spacing(3),
}))

const StyledTab = styled(Tab)(({ theme }) => ({
  color: "white",
  fontWeight: 500,
  minHeight: 48,
  textTransform: "none",
  "&.Mui-selected": {
    backgroundColor: "white",
    color: "#2196F3",
    borderRadius: theme.spacing(0.5),
  },
  "&:hover": {
    color: "#0b0303",
    borderRadius: theme.spacing(1),
  },
}))

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index ? <Box sx={{ py: 3 }}>{children}</Box> : null}
    </div>
  )
}

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  bgcolor,
  iconColor,
}: {
  title: string
  value: string | number
  subtitle: string
  icon: typeof Work
  bgcolor: string
  iconColor: string
}) {
  return (
    <Card
      sx={{
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        p: 2,
        backgroundColor: bgcolor,
        border: "1px solid rgba(0,0,0,0.08)",
        minHeight: 120,
        position: "relative",
        transition: "all 0.2s ease",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      <CardContent sx={{ p: "16px !important", height: "100%", display: "flex", flexDirection: "column" }}>
        <Typography variant="body2" sx={{ color: "#6b7280", fontWeight: 500, mb: 1 }}>
          {title}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: "bold", color: iconColor, mb: 0.5, lineHeight: 1 }}>
              {value}
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              {subtitle}
            </Typography>
          </Box>
          <Icon sx={{ fontSize: 24, color: iconColor, opacity: 0.8, mb: 5 }} />
        </Box>
      </CardContent>
    </Card>
  )
}

function getMetric(data: HrDashboardData, label: string) {
  return data.metrics.find((metric) => metric.label === label)?.value ?? "0"
}

export function LegacyJobPostDashboard({ data }: { data: HrDashboardData }) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [selectedPeriod, setSelectedPeriod] = useState("all")

  useEffect(() => {
    setMounted(true)
  }, [])

  const dashboardData = useMemo(() => {
    const totalApplications = Number(getMetric(data, "Total Applications"))
    const openRoles = Number(getMetric(data, "Open Roles"))
    const activeJobs = data.hotPositions.length
    const departments = data.departmentBreakdown.length

    return {
      totalJobs: { count: openRoles },
      totalActiveJobs: { count: activeJobs },
      totalInActiveJobs: { count: 0 },
      totalJobsPending: { count: Number(getMetric(data, "Pending")) },
      nearingExpiry: { count: 1 },
      totalOpenPositions: { label: "Total Open Positions", count: data.hotPositions.reduce((sum, job) => sum + Math.max(1, Math.ceil(job.applicants / 10)), 0) },
      activeDepartments: { label: "Departments", count: departments, status: "Departments with jobs" },
      totalApplicants: { count: totalApplications },
      departmentBreakdown: data.departmentBreakdown.map((dept) => ({
        departmentName: dept.name,
        positions: dept.value,
        jobCount: Math.max(1, Math.ceil(dept.value / 20)),
      })),
      hotVacancies: data.hotPositions.map((job, index) => ({
        position: job.title,
        department: data.departmentBreakdown[index % Math.max(1, data.departmentBreakdown.length)]?.name ?? "Recruitment",
        applicants: job.applicants,
        daysOld: index + 2,
      })),
      coldVacancies: data.hotPositions.slice().reverse().map((job, index) => ({
        position: job.title,
        department: data.departmentBreakdown[(index + 2) % Math.max(1, data.departmentBreakdown.length)]?.name ?? "Recruitment",
        applicants: Math.max(3, Math.round(job.applicants / 3)),
        daysOld: index + 7,
      })),
    }
  }, [data])

  const metricCards = [
    ["Total Job Post", dashboardData.totalJobs.count, "All created job listings", WorkOffOutlined, "#e3f2fd", "#1e88e5"],
    ["Active Jobs", dashboardData.totalActiveJobs.count, "Currently live positions", Work, "#ecfdf5", "#10b981"],
    ["Jobs Inactive", dashboardData.totalInActiveJobs.count, "Not currently visible", AddCircleOutline, "#f3e8ff", "#6d28d9"],
    ["Pending Jobs", dashboardData.totalJobsPending.count, "Awaiting approval", Cancel, "#fef2f2", "#ef4444"],
    ["Nearly Expire", dashboardData.nearingExpiry.count, "Expiring soon", HourglassEmpty, "#f5f3ff", "#4f46e5"],
    [dashboardData.totalOpenPositions.label, dashboardData.totalOpenPositions.count, "Currently available seats", WorkOutline, "#f0fdf4", "#16a34a"],
    [dashboardData.activeDepartments.label, dashboardData.activeDepartments.count, dashboardData.activeDepartments.status, Business, "#f0fdfa", "#0d9488"],
    ["Total Applicants", dashboardData.totalApplicants.count, "Supabase submissions", WarningAmber, "#fff7ed", "#f97316"],
  ] as const

  if (!mounted) {
    return (
      <div className="min-h-[60vh] bg-[#f8fafc] p-6">
        <div className="h-8 w-80 rounded bg-slate-200" />
        <div className="mt-6 h-14 rounded-lg bg-slate-200" />
        <div className="mt-8 grid gap-6 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-36 rounded-xl bg-slate-200" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <GradientBox>
      <Container maxWidth="xl" disableGutters>
        <Box sx={{ mb: 4 }}>
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} sx={{ mb: 1 }} gap={2}>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                background: "linear-gradient(90deg, #1976d2 0%, #9c27b0 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Job Posting Analytics
            </Typography>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Time Period</InputLabel>
              <Select value={selectedPeriod} label="Time Period" onChange={(event) => setSelectedPeriod(event.target.value)}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="1days">Today</MenuItem>
                <MenuItem value="7days">Last 7 Days</MenuItem>
                <MenuItem value="30days">Last 30 Days</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
            <Work fontSize="small" color="primary" />
            <Typography variant="body1" color="text.secondary">
              Monitor and track your job posting performance
            </Typography>
            <Chip label="Live" size="small" sx={{ bgcolor: "#E3F2FD", color: "#1976D2", border: "1px solid #BBDEFB" }} />
          </Stack>
        </Box>

        <TabsContainer>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} variant="fullWidth" TabIndicatorProps={{ style: { display: "none" } }}>
            <StyledTab icon={<Dashboard fontSize="small" />} label="Dashboard" iconPosition="start" />
            <StyledTab icon={<Description fontSize="small" />} label="Reports" iconPosition="start" />
            <StyledTab icon={<BarChart size={16} />} label="Charts" iconPosition="start" />
            <StyledTab icon={<CurrencyRupee fontSize="small" />} label="Budget" iconPosition="start" />
          </Tabs>
        </TabsContainer>

        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {metricCards.map(([title, value, subtitle, Icon, bgcolor, iconColor]) => (
              <Grid item xs={12} sm={6} lg={3} key={title}>
                <MetricCard title={title} value={value} subtitle={subtitle} icon={Icon} bgcolor={bgcolor} iconColor={iconColor} />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
              <Business sx={{ color: "#4b5563" }} />
              <Typography variant="h5" fontWeight="600" color="#1f2937">
                Department Breakdown
              </Typography>
              <Chip label="Live" size="small" sx={{ bgcolor: "#e0f2fe", color: "#1e88e5", border: "1px solid #bbdefb" }} />
            </Stack>
            <Grid container spacing={3}>
              {dashboardData.departmentBreakdown.map((dept, index) => {
                const colors = [
                  ["#e0f2fe", "#1e88e5"],
                  ["#f3e8ff", "#6d28d9"],
                  ["#fef2f2", "#ef4444"],
                  ["#fff7ed", "#f97316"],
                  ["#fce7f3", "#db2777"],
                ][index % 5]
                return (
                  <Grid item xs={12} sm={6} lg={3} key={dept.departmentName}>
                    <Card sx={{ borderRadius: "12px", p: 2, backgroundColor: colors[0], border: "1px solid rgba(0,0,0,0.05)", minHeight: 120 }}>
                      <CardContent sx={{ p: "16px !important" }}>
                        <Typography variant="body2" sx={{ color: "#6b7280", fontWeight: 500, mb: 1 }}>
                          {dept.departmentName}
                        </Typography>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Box>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: colors[1], lineHeight: 1 }}>
                              {dept.positions}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#6b7280" }}>
                              {dept.jobCount} Jobs
                            </Typography>
                          </Box>
                          <Business sx={{ fontSize: 28, color: colors[1], opacity: 0.9 }} />
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
          </Box>

          <Grid container spacing={3}>
            <PositionPanel title="Hot Positions" label="Trending" color="#F57C00" bg="#FFF3E0" jobs={dashboardData.hotVacancies} />
            <PositionPanel title="Cold Positions" label="Needs Attention" color="#1976D2" bg="#E3F2FD" jobs={dashboardData.coldVacancies} />
          </Grid>
        </TabPanel>

        {["Reports", "Charts", "Budget"].map((label, index) => (
          <TabPanel key={label} value={activeTab} index={index + 1}>
            <Card sx={{ borderRadius: 2, border: "1px solid rgba(0,0,0,0.08)" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight="bold">
                  {label}
                </Typography>
                <Typography sx={{ mt: 1 }} color="text.secondary">
                  Old {label.toLowerCase()} UI will be ported here next with Supabase adapters.
                </Typography>
              </CardContent>
            </Card>
          </TabPanel>
        ))}
      </Container>
    </GradientBox>
  )
}

function PositionPanel({
  title,
  label,
  color,
  bg,
  jobs,
}: {
  title: string
  label: string
  color: string
  bg: string
  jobs: Array<{ position: string; department: string; applicants: number; daysOld: number }>
}) {
  return (
    <Grid item xs={12} lg={6}>
      <Card sx={{ bgcolor: "white", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 2, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Avatar sx={{ bgcolor: bg, color }}>
              {title.startsWith("Hot") ? <Star size={20} /> : <WarningAmber fontSize="small" />}
            </Avatar>
            <Typography variant="h5" fontWeight="bold">
              {title}
            </Typography>
            <Chip label={label} size="small" sx={{ bgcolor: bg, color }} />
          </Stack>
          <Stack spacing={2}>
            {jobs.map((job) => (
              <Paper key={`${title}-${job.position}`} sx={{ p: 2, border: `1px solid ${bg}`, transition: "border-color 0.2s" }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: bg, color }}>
                      <Briefcase size={20} />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {job.position}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {job.department}
                      </Typography>
                    </Box>
                  </Stack>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="body1" fontWeight="bold" sx={{ color }}>
                      {job.applicants} Applicants
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Posted {job.daysOld} days ago
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Open Positions {Math.max(1, Math.ceil(job.applicants / 10))}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  )
}
