"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Avatar,
  Tabs,
  Tab,
  Container,
  Paper,
  Stack,
  CircularProgress,
  Alert,
  LinearProgress,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import {
  Users,
  UserCheck,
  UserPlus,
  UserX,
  Clock,
  TrendingUp,
  AlertTriangle,
  Briefcase,
  Star,
  Eye,
  FileText,
  Phone,
  Percent,
  Building,
  UserPenIcon,
  UserCircle2Icon,
  LucideCheckSquare,
  UserCircle,
  Check,
  LayoutDashboardIcon,
} from "lucide-react"
// import Reporting from './Reporting/page'
// import Graphs from './Graphs/page'
// import CandidateManagement from './CandidateManagement/page'
// import { useSession } from "next-auth/react"
import { getAllCount, getAllEmployeeApi, getMyPartnersAPI, getProductWisecountCountAPI, getServiceWisecountCountAPI, taskByEmpCountAPI } from "@/services/apiService"
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Dashboard, Report } from "@mui/icons-material"
import { IconServicemark } from "@tabler/icons-react"
import Reporting from "./report"



// Styled components for gradient backgrounds and custom styling
const GradientBox = styled(Box)(({ theme }) => ({
  backgroundColor: "#f8fafc",
  minHeight: "100vh",
  padding: theme.spacing(3),
}))

const TabsContainer = styled(Box)(({ theme }) => ({
  background: "linear-gradient(45deg, #9180ff 30%, #9C27B0 90%)",
  borderRadius: theme.spacing(1),
  padding: theme.spacing(0.5),
  marginBottom: theme.spacing(3),
}))

const StyledTab = styled(Tab)(({ theme }) => ({
  color: "white",
  fontWeight: 500,
  minHeight: 48,
  "&.Mui-selected": {
    backgroundColor: "white",
    color: "#2196F3",
    borderRadius: theme.spacing(0.5),
  },
}))

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

function MetricCard({ title, value, subtitle, icon: Icon, bgcolor, textColor }) {
  return (
    <Card
      sx={{
        bgcolor: bgcolor,
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 2,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500, mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: "bold", color: textColor || "text.primary", mb: 0.5 }}>
              {value}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {subtitle}
            </Typography>
          </Box>
          <Avatar sx={{ width: 40, height: 40, bgcolor: "rgba(0,0,0,0.04)" }}>
            <Icon size={20} color={textColor || "#666"} />
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  )
}

// Department color mapping
const departmentColors = {
  Legal: { color: "#e0f2fe", textColor: "#0277bd" },
  Finance: { color: "#f3e5f5", textColor: "#7b1fa2" },
  Engineering: { color: "#e8f5e8", textColor: "#2e7d32" },
  "Quality Assurance": { color: "#fff3e0", textColor: "#f57c00" },
  Product: { color: "#fce4ec", textColor: "#c2185b" },
  Design: { color: "#e0f2f1", textColor: "#00796b" },
  Sales: { color: "#f8bbd9", textColor: "#ad1457" },
  Operations: { color: "#e8eaf6", textColor: "#3f51b5" },
  Marketing: { color: "#f3e5f5", textColor: "#7b1fa2" },
  HR: { color: "#fff3e0", textColor: "#f57c00" },
}

// Default color for departments not in the mapping
const defaultDeptColor = { color: "#e8eaf6", textColor: "#3f51b5" }

export default function Page() {
  // const { data: session } = useSession()

  const [selectedPeriod, setSelectedPeriod] = useState("7days")
    const [tabValue, setTabValue] = useState(0)
    const [chartTabValue, setChartTabValue] = useState(0)
    const [dashboardData, setDashboardData] = useState(null)
    const [clients, setClients] = useState([])
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [empTaskCount, setEmpTaskCount] = useState([])
    const [productWiseData, setProductWiseData] = useState([])
    const [serviceWiseData, setServiceWiseData] = useState([])

    const handleTabChange = (event, newValue) => {
      setTabValue(newValue)
    }
     const handleChartTabChange = (event, newValue) => {
    setChartTabValue(newValue)
  }

  
    const fetchDashboardData = async () => {
      const response = await getAllCount()
      
      if (response.status && response?.items) {
        setDashboardData(response.items)
      }
    }
  
    const fetchAllClient = async () => {
      try {
        const response = await getMyPartnersAPI()
        if (response.status && response?.items) {
          setClients(response.items)
        }
      } catch (error) {
        console.error("Failed to fetch clients:", error)
      }
    }
  
    const fetchAllEmployee = async () => {
      try {
        const response = await getAllEmployeeApi()
        if (response.status && response?.items) {
          setEmployees(response.items.employees)
        }
      } catch (error) {
        console.error("Failed to fetch employees:", error)
      }
    }

      const getEmpTaskCount = async () => {
    try {
      const response = await taskByEmpCountAPI()

      setEmpTaskCount(response.items)
    } catch (error) {
      console.error('Error fetching Employee count:', error)
    }
  }
    const getPartnerWiseCount = async () => {
    try {
      const response = await getProductWisecountCountAPI()


      if (response && response.items) {
        setProductWiseData(response.items)
      }
    } catch (error) {
      console.error('Error fetching Product Wise count:', error)
    }
  }
    const getServiceWiseCount = async () => {
    try {
      const response = await getServiceWisecountCountAPI()


      if (response && response.items) {
        setServiceWiseData(response.items)
      }
    } catch (error) {
      console.error('Error fetching Service Wise count:', error)
    }
  }


    // Transform API data for the chart
  const employeeTaskData = useMemo(() => {
    if (!empTaskCount || !Array.isArray(empTaskCount)) return []

    return empTaskCount.map(item => ({
      name: item.name,
      completed: item.completed,
      inProgress: item.allocated
    }))
  }, [empTaskCount])

    // Transform API data for the chart
  const productTaskData = useMemo(() => {
    if (!productWiseData || !Array.isArray(productWiseData)) return []

    return productWiseData.map(item => ({
     name: item.name,
      completed: item.completed,
      allocated: item.allocated
    }))
  }, [productWiseData])
  
  
  // const setAuthToken = token => {
  //   if (typeof window !== 'undefined') {
  //     if (token) {
  //       localStorage.setItem('accessToken', token)
  //     } else {
  //       localStorage.removeItem('accessToken')
  //     }
  //   }
  // }

  useEffect(() => {
    
        fetchDashboardData()
        fetchAllClient()
        fetchAllEmployee()
        getEmpTaskCount()
        getPartnerWiseCount()
        getServiceWiseCount()
     
  }, [])

  // Transform data for pie charts
  const serviceDistributionData = serviceWiseData.map((item) => ({
    name: item.name,
    value: item.allocated + item.completed,
    allocated: item.allocated,
    completed: item.completed,
    wipCount: item.wipCount,
  }))

  const completionRateData = serviceWiseData.map((item) => {
    const total = item.allocated + item.completed + item.wipCount
    return {
      name: item.name,
      completionRate: total > 0 ? Math.round((item.completed / total) * 100) : 0,
      total: total,
    }
  })

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

    // Custom tooltip for pie charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 2, bgcolor: "background.paper", border: 1, borderColor: "divider" }}>
          <Typography variant="body2">{`${payload[0].name}: ${payload[0].value}`}</Typography>
        </Paper>
      )
    }
    return null
  }

  if (!dashboardData) {
      return (
        <GradientBox>
          <Container maxWidth="xl">
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
              <CircularProgress />
            </Box>
          </Container>
        </GradientBox>
      )
    }

  return (
      <GradientBox>
          <Container maxWidth="xl">
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Avatar sx={{ bgcolor: "linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)", width: 32, height: 32 }}>
                    <Dashboard size={20} />
                  </Avatar>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: "bold",
                      background: "linear-gradient(45deg, #9180ff 30%, #9C27B0 90%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Operations Dashboard
                  </Typography>
                </Stack>
                {/* <Chip
                  label="Live"
                  size="small"
                  sx={{
                    bgcolor: "#E3F2FD",
                    color: "#1976D2",
                    border: "1px solid #BBDEFB",
                    "& .MuiChip-label": {
                      display: "flex",
                      alignItems: "center",
                      "&::before": {
                        content: '""',
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "#2196F3",
                        marginRight: 0.5,
                        animation: "pulse 2s infinite",
                      },
                    },
                  }}
                /> */}
              </Stack>
              {/* {tabValue == 0 ?
              <Stack direction="row" spacing={1}>
                <Button
                  variant={selectedPeriod === "7days" ? "contained" : "outlined"}
                  onClick={() => handlePeriodChange("7days")}
                  sx={
                    selectedPeriod === "7days"
                      ? {
                          background: "linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)",
                          color: "white",
                        }
                      : {}
                  }
                >
                  Last 7 Days
                </Button>
                <Button
                  variant={selectedPeriod === "30days" ? "contained" : "outlined"}
                  onClick={() => handlePeriodChange("30days")}
                  sx={
                    selectedPeriod === "30days"
                      ? {
                          background: "linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)",
                          color: "white",
                        }
                      : {}
                  }
                >
                  Last 30 Days
                </Button>
              </Stack> : null} */}
            </Stack>
    
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
              <Briefcase size={16} />
              <Typography variant="body1" color="text.secondary">
                Monitor and track cases application and report status.
              </Typography>
            </Stack>
    
            {/* Navigation Tabs */}
            <TabsContainer>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                TabIndicatorProps={{ style: { display: "none" } }}
              >
                <StyledTab icon={<LayoutDashboardIcon size={16} />} label="Dashboard" iconPosition="start" />
                <StyledTab icon={<FileText size={16} />} label="Reports" iconPosition="start" />
                <StyledTab icon={<TrendingUp size={16} />} label="Charts" iconPosition="start" />
                <StyledTab icon={<UserCheck size={16} />} label="Invoice" iconPosition="start" />
              </Tabs>
            </TabsContainer>
    
            {!dashboardData ? (
              <Alert severity="error">Failed to load dashboard data. Please try again later.</Alert>
            ) : (
              <TabPanel value={tabValue} index={0}>
                {/* Main Metrics */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6} lg={3}>
                    <MetricCard
                      title="Total Cases"
                      value={dashboardData.allCount}
                      subtitle="All Cases"
                      icon={Users}
                      bgcolor="#e0f2fe"
                      textColor="#0277bd"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <MetricCard
                      title="Added Cases"
                      value={dashboardData.allocatedCount}
                      subtitle="In progress"
                      icon={UserCheck}
                      bgcolor="#f3e5f5"
                      textColor="#7b1fa2"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <MetricCard
                      title="Allocated Cases"
                      value={dashboardData.allocatedCount}
                      subtitle="Assigned Cases"
                      icon={UserCheck}
                      bgcolor="#e8f5e8"
                      textColor="#2e7d32"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <MetricCard
                      title="BackOffice Received"
                      value={dashboardData.backOfficeReceivedCount}
                      subtitle="Allocated to BackOffice"
                      icon={UserCheck}
                      bgcolor="#ffebee"
                      textColor="#d32f2f"
                    />
                  </Grid>
                </Grid>
    
                {/* Secondary Metrics */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6} lg={3}>
                    <MetricCard
                      title="WIP Cases"
                      value={dashboardData.wipCount}
                      subtitle="Work in Progress"
                      icon={Clock}
                      bgcolor="#e8eaf6"
                      textColor="#3f51b5"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <MetricCard
                      title="Completed Cases"
                      value={dashboardData.completedCount}
                      subtitle="Completed Cases"
                      icon={LucideCheckSquare}
                      bgcolor="#fff3e0"
                      textColor="#f57c00"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <MetricCard
                      title="Total Client Count"
                      value={`${dashboardData.clientCount}`}
                      subtitle="All Clients"
                      icon={UserPenIcon}
                      bgcolor="#e0f2f1"
                      textColor="#00796b"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <MetricCard
                      title="Employee Count"
                      value={dashboardData.empCount}
                      subtitle="Active"
                      icon={UserCircle2Icon}
                      bgcolor="#f1f8e9"
                      textColor="#689f38"
                    />
                  </Grid>
                </Grid>
    
                {/* Hot and Cold Positions */}
                <Grid container spacing={3}>
                  {/* Hot Positions */}
                  <Grid item xs={12} lg={6}>
                    <Card
                      sx={{
                        bgcolor: "white",
                        border: "1px solid rgba(0,0,0,0.08)",
                        borderRadius: 2,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                          <Avatar sx={{ bgcolor: "#FFF3E0", color: "#F57C00" }}>
                            <UserPlus size={20} />
                          </Avatar>
                          <Typography variant="h5" fontWeight="bold">
                            All Clients
                          </Typography>
                          <Chip label="Users" size="small" sx={{ bgcolor: "#FFF3E0", color: "#F57C00" }} />
                        </Stack>
                        <Stack spacing={2} sx={{ maxHeight: 500, overflowY: "auto" }}>
                          {clients.map((position) => {
                            // const deptStyle = departmentColors[position.departmentName] || defaultDeptColor
                            return (
                              <Paper
                                key={position._id}
                                sx={{
                                  p: 2,
                                  border: "1px solid #FFE0B2",
                                  "&:hover": { borderColor: "#FFB74D" },
                                  transition: "border-color 0.2s",
                                }}
                              >
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                  <Stack direction="row" alignItems="center" spacing={2}>
                                    <Avatar sx={{ bgcolor: "#FFF3E0", color: "#F57C00" }}>
                                      <UserCircle size={20} />
                                    </Avatar>
                                    <Box>
                                      <Typography variant="body1" fontWeight="medium">
                                        {position.partner?.name}
                                      </Typography>
                                      {/* <Typography variant="body2" color="text.secondary">
                                        {position.departmentName}
                                      </Typography> */}
                                    </Box>
                                  </Stack>
                                  <Box sx={{ textAlign: "right" }}>
                                    {/* <Typography variant="body1" fontWeight="bold" sx={{ color: "#F57C00" }}>
                                      <Eye size={16} />
                                    </Typography> */}
                                    <Chip label="All users" size="small" sx={{ bgcolor: "#FFF3E0", color: "#F57C00" }} />
                                    {/* <Typography variant="body2" color="text.secondary">
                                      {position.daysSincePosted}d
                                    </Typography> */}
                                  </Box>
                                </Stack>
                              </Paper>
                            )
                          })}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
    
                  {/* Cold Positions */}
                  <Grid item xs={12} lg={6}>
                    <Card
                      sx={{
                        bgcolor: "white",
                        border: "1px solid rgba(0,0,0,0.08)",
                        borderRadius: 2,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                          <Avatar sx={{ bgcolor: "#E3F2FD", color: "#1976D2" }}>
                            <UserCheck size={20} />
                          </Avatar>
                          <Typography variant="h5" fontWeight="bold">
                            All Employees
                          </Typography>
                          <Chip label="Employees to Allocate" size="small" sx={{ bgcolor: "#E3F2FD", color: "#1976D2" }} />
                        </Stack>
                        <Stack spacing={2} sx={{ maxHeight: 500, overflowY: "auto" }}>
                          {employees.map((position) => {
                            // const deptStyle = departmentColors[position.departmentName] || defaultDeptColor
                            return (
                              <Paper
                                key={position._id}
                                sx={{
                                  p: 2,
                                  border: "1px solid #BBDEFB",
                                  "&:hover": { borderColor: "#64B5F6" },
                                  transition: "border-color 0.2s",
                                }}
                              >
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                  <Stack direction="row" alignItems="center" spacing={2}>
                                    <Avatar sx={{ bgcolor: "#E3F2FD", color: "#1976D2" }}>
                                      <Briefcase size={20} />
                                    </Avatar>
                                    <Box>
                                      <Typography variant="body1" fontWeight="medium">
                                        {position.employeName}
                                      </Typography>
                                      {/* <Typography variant="body2" color="text.secondary">
                                        {position.departmentName}
                                      </Typography> */}
                                    </Box>
                                  </Stack>
                                  <Box sx={{ textAlign: "right" }}>
                                    <Chip label="Active" size="small" sx={{ bgcolor: "#E3F2FD", color: "#1976D2" }} />
                                    
                                    {/* <Typography variant="body2" color="text.secondary">
                                      {position.daysSincePosted}d
                                    </Typography> */}
                                  </Box>
                                </Stack>
                              </Paper>
                            )
                          })}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </TabPanel>
            )}
    
            <TabPanel value={tabValue} index={1}>
              <Card
                sx={{
                  bgcolor: "white",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 2,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                    <Reporting />
                </CardContent>
              </Card>
            </TabPanel>
    
            <TabPanel value={tabValue} index={2}>
              <Card
                sx={{
                  bgcolor: "white",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 2,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <Grid container spacing={3} sx={{ p: 3 }}>
                  <Grid item xs={12}>
             <Box sx={{ width: "100%", p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Task Analytics Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Comprehensive view of task allocation and completion across products and services
        </Typography>
      </Box>

      <Paper sx={{ width: "100%" }}>
        <TabsContainer>
        <Tabs
          value={chartTabValue}
          onChange={handleChartTabChange}
        //   indicatorColor="primary"
          TabIndicatorProps={{ style: { display: "none" } }}
          textColor="primary"
          variant="fullWidth"
        >
          <StyledTab icon={<LayoutDashboardIcon />} label="Overview" />
          <StyledTab icon={<Report />} label="Report Analysis" />
          <StyledTab icon={<IconServicemark />} label="Service Analysis" />
        </Tabs>
        </TabsContainer>


        {/* Overview Tab */}
        <TabPanel value={chartTabValue} index={0}>
          <Grid container spacing={4}>
            {/* Service Distribution Pie Chart */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Service Task Distribution
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Total tasks by service type
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={serviceDistributionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {serviceDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Completion Rate Donut Chart */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Service Completion Rates
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Percentage of completed tasks by service
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={completionRateData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        fill="#82ca9d"
                        dataKey="completionRate"
                        label={({ name, completionRate }) => `${name}: ${completionRate}%`}
                      >
                        {completionRateData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Completion Rate"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Product Analysis Tab */}
        <TabPanel value={chartTabValue} index={1}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Report-wise Task Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Allocated vs completed tasks by report/client
              </Typography>
              <ResponsiveContainer width="100%" height={500}>
                <BarChart
                  data={productTaskData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                  <Legend />
                  <Tooltip />
                  <Bar dataKey="completed" name="Completed" fill="#82ca9d" />
                  <Bar dataKey="allocated" name="Allocated" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Service Analysis Tab */}
        <TabPanel value={chartTabValue} index={2}>
          <Grid container spacing={4}>
            {/* Service Workflow Stacked Bar */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Service Workflow Status
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Task status breakdown by service
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={serviceWiseData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="allocated" stackId="a" name="Allocated" fill="#ff7300" />
                      <Bar dataKey="wipCount" stackId="a" name="Work in Progress" fill="#ffbb28" />
                      <Bar dataKey="completed" stackId="a" name="Completed" fill="#00c49f" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Service Performance Metrics */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Service Performance
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Individual service metrics
                  </Typography>
                  <Box sx={{ space: 3 }}>
                    {serviceWiseData.map((service, index) => {
                      const total = service.allocated + service.wipCount + service.completed
                      const completionRate = total > 0 ? Math.round((service.completed / total) * 100) : 0

                      return (
                        <Box key={service.name} sx={{ mb: 3 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                            <Typography variant="subtitle2" fontWeight="medium">
                              {service.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {completionRate}% complete
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={completionRate}
                            sx={{ height: 8, borderRadius: 4, mb: 1 }}
                          />
                          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="caption" color="text.secondary">
                              Allocated: {service.allocated}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              WIP: {service.wipCount}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Completed: {service.completed}
                            </Typography>
                          </Box>
                        </Box>
                      )
                    })}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Box>
          </Grid>
                <Grid item xs={12}>
            <Card className='h-full shadow'>
              <CardContent>
                <Typography variant='h6' className='mb-4'>
                  Tasks Assigned Employee-Wise
                </Typography>
                <ResponsiveContainer width='100%' height={300}>
                  <BarChart data={employeeTaskData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='name' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey='completed' name='Completed' fill='#82ca9d' />
                    <Bar dataKey='inProgress' name='In Progress' fill='#8884d8' />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
              </Grid>

          <Grid item xs={12}>
            <Card className='shadow'>
              <CardContent>
                <Typography variant='h6' className='mb-4'>
                  Tasks Completed Per Employee
                </Typography>
                <ResponsiveContainer width='100%' height={300}>
                  <BarChart data={employeeTaskData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='name' />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey='completed' fill='#82ca9d' />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
                </Grid>
              </Card>
            </TabPanel>
    
            <TabPanel value={tabValue} index={3}>
              <Card
                sx={{
                  bgcolor: "white",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 2,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                {/* <CandidateManagement/> */}
              </Card>
            </TabPanel>
          </Container>
        </GradientBox>
  )
}