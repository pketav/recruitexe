"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { BarChart3, TrendingUp, RefreshCw, Users, Building, Target, Activity, Briefcase, Clock } from "lucide-react"
import { useApi } from "@core/hooks/useApi"

const StyledCard = styled(Card)(({ theme }) => ({
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: theme.spacing(2),
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  transition: "all 0.3s ease",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  "&:hover": {
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
}))

const ChartCard = ({ title, subtitle, icon, children, height = 300 }) => {
  return (
    <StyledCard>
      <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%" }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Avatar sx={{ bgcolor: "#E3F2FD", color: "#1976D2" }}>{icon}</Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>
        </Stack>
        <Box sx={{ width: "100%", height: height, flexGrow: 1 }}>{children}</Box>
      </CardContent>
    </StyledCard>
  )
}

const Graphs = ({selectedPeriod}) => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const { callApi, loading } = useApi()

  // Chart colors
  const colors = {
    primary: "#2196F3",
    secondary: "#9C27B0",
    success: "#4CAF50",
    warning: "#FF9800",
    error: "#F44336",
    info: "#00BCD4",
    purple: "#673AB7",
    teal: "#009688",
    pink: "#E91E63",
    indigo: "#3F51B5",
  }

  const chartColors = [
    colors.primary,
    colors.secondary,
    colors.success,
    colors.warning,
    colors.error,
    colors.info,
    colors.purple,
    colors.teal,
    colors.pink,
    colors.indigo,
  ]

  // Fetch data from API using your useApi hook
  const fetchDashboardData = async () => {
    setError(null)
    try {
      const response = await callApi({
        endpoint: `/v1/api/job/getDashboardMetrics?period=${selectedPeriod}`,
        disableSnackbar: true,
      })

      if (response.success && response.data?.items) {
        setData(response.data.items)
      } else {
        setError("Failed to load dashboard data")
      }
    } catch (err) {
      setError("Error fetching data: " + err.message)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [selectedPeriod])

  // Chart configuration
  const chartConfigs = {
    applicationsByMonth: {
      title: "Applications by Month",
      subtitle: "Monthly application trends",
      icon: <TrendingUp size={20} />,
      type: "area",
      dataKey: "count",
      xAxisKey: "month",
      color: colors.primary,
    },
    applicationsByDepartment: {
      title: "Applications by Department",
      subtitle: "Department-wise distribution",
      icon: <Building size={20} />,
      type: "bar",
      dataKey: "count",
      xAxisKey: "departmentName",
      color: colors.success,
    },
    applicationsByStatus: {
      title: "Applications by Status",
      subtitle: "Current status breakdown",
      icon: <Activity size={20} />,
      type: "pie",
      dataKey: "count",
      nameKey: "status",
      color: colors.warning,
    },
    topPositions: {
      title: "Top Positions",
      subtitle: "Most popular job positions",
      icon: <Briefcase size={20} />,
      type: "bar",
      dataKey: "count",
      xAxisKey: "position",
      color: colors.secondary,
    },
    workflowStats: {
      title: "Workflow Statistics",
      subtitle: "Recruitment pipeline progress",
      icon: <Target size={20} />,
      type: "line",
      dataKey: "applications",
      xAxisKey: "month",
      color: colors.info,
      multiLine: true,
    },
    ShortlistedlistRate: {
      title: "Success Rate Trends",
      subtitle: "Monthly hiring success rates",
      icon: <Users size={20} />,
      type: "line",
      dataKey: "successRate",
      xAxisKey: "month",
      color: colors.success,
    },
    aiScreeningMetrics: {
      title: "AI Screening Performance",
      subtitle: "AI screening pass/fail rates",
      icon: <Activity size={20} />,
      type: "line",
      dataKey: "avgMatchPercentage",
      xAxisKey: "month",
      color: colors.purple,
      multiLine: true,
    },
    timeToHire: {
      title: "Time to Hire",
      subtitle: "Average hiring time by month",
      icon: <Clock size={20} />,
      type: "bar",
      dataKey: "avgDays",
      xAxisKey: "month",
      color: colors.teal,
    },
  }

  // Process data for charts
  const processedData = useMemo(() => {
    if (!data) return null

    const processed = {}

    // Applications by Month
    processed.applicationsByMonth = data.applicationsByMonth
      ?.filter((item) => item.count > 0)
      .map((item) => ({
        month: item.month.substring(0, 3),
        count: item.count,
      }))

    // Applications by Department
    processed.applicationsByDepartment = data.applicationsByDepartment?.map((item, index) => ({
      ...item,
      color: chartColors[index % chartColors.length],
    }))

    // Applications by Status
    processed.applicationsByStatus = data.applicationsByStatus?.map((item, index) => ({
      ...item,
      color: chartColors[index % chartColors.length],
    }))

    // Top Positions
    processed.topPositions = data.topPositions?.map((item, index) => ({
      ...item,
      color: chartColors[index % chartColors.length],
    }))

    // Workflow Stats (filter out months with no data)
    processed.workflowStats = data.workflowStats
      ?.filter((item) => item.applications > 0 || item.shortlisted > 0 || item.interviewSchedule > 0)
      .map((item) => ({
        month: item.month.substring(0, 3),
        applications: item.applications,
        shortlisted: item.shortlisted,
        interviews: item.interviewSchedule,
        offered: item.offered,
        preOfferGenerated: item.preOfferGenerated,
      }))

    // Success Rate
    processed.ShortlistedlistRate = data.ShortlistedlistRate?.filter((item) => item.totalApplications > 0).map(
      (item) => ({
        month: item.month.substring(0, 3),
        successRate: item.successRate,
        totalApplications: item.totalApplications,
        hired: item.hired || 0,
      }),
    )

    // AI Screening Metrics
    processed.aiScreeningMetrics = data.aiScreeningMetrics
      ?.filter((item) => item.passed > 0 || item.failed > 0)
      .map((item) => ({
        month: item.month.substring(0, 3),
        passed: item.passed,
        failed: item.failed,
        avgMatchPercentage: item.avgMatchPercentage,
        total: item.passed + item.failed,
      }))

    // Time to Hire
    processed.timeToHire = data.timeToHire
      ?.filter((item) => item.avgDays > 0)
      .map((item) => ({
        month: item.month.substring(0, 3),
        avgDays: item.avgDays,
        hires: item.hires,
      }))

    return processed
  }, [data])

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: "white",
            p: 2,
            border: "1px solid #ccc",
            borderRadius: 1,
            boxShadow: 2,
          }}
        >
          <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {`${entry.name || entry.dataKey}: ${entry.value}`}
            </Typography>
          ))}
        </Box>
      )
    }
    return null
  }

  // Render chart based on type
  const renderChart = (chartKey) => {
    const config = chartConfigs[chartKey]
    const chartData = processedData?.[chartKey]

    if (!chartData || chartData.length === 0) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            flexDirection: "column",
          }}
        >
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            No data available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {config.title} data is empty
          </Typography>
        </Box>
      )
    }

    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    }

    switch (config.type) {
      case "area":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={config.xAxisKey} />
              <YAxis />
              <RechartsTooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey={config.dataKey}
                stroke={config.color}
                fill={config.color}
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )

      case "bar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={config.xAxisKey} />
              <YAxis />
              <RechartsTooltip content={<CustomTooltip />} />
              <Bar dataKey={config.dataKey} fill={config.color} radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || config.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )

        case "pie":
          return (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey={config.dataKey}
                  nameKey={config.nameKey}
                  label={({ name, percent }) => {
                    const labelName = name.toLowerCase() === "active"
                      ? "Pending" : name.toLowerCase() === "notshortlisted" ? "Rejected"
                      : "Approved" 
                    return `${labelName} ${(percent * 100).toFixed(0)}%`;
                  }}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          );
        

      case "line":
        if (config.multiLine) {
          if (chartKey === "workflowStats") {
            return (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart {...commonProps}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={config.xAxisKey} />
                  <YAxis />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    stroke={colors.primary}
                    strokeWidth={2}
                    name="Applications"
                  />
                  <Line
                    type="monotone"
                    dataKey="shortlisted"
                    stroke={colors.success}
                    strokeWidth={2}
                    name="Shortlisted"
                  />
                  <Line
                    type="monotone"
                    dataKey="interviews"
                    stroke={colors.warning}
                    strokeWidth={2}
                    name="Interviews"
                  />
                  <Line type="monotone" dataKey="offered" stroke={colors.secondary} strokeWidth={2} name="Offered" />
                </LineChart>
              </ResponsiveContainer>
            )
          } else if (chartKey === "aiScreeningMetrics") {
            return (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart {...commonProps}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={config.xAxisKey} />
                  <YAxis />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="passed" stroke={colors.success} strokeWidth={2} name="Passed" />
                  <Line type="monotone" dataKey="failed" stroke={colors.error} strokeWidth={2} name="Failed" />
                  <Line
                    type="monotone"
                    dataKey="avgMatchPercentage"
                    stroke={colors.purple}
                    strokeWidth={2}
                    name="Avg Match %"
                  />
                </LineChart>
              </ResponsiveContainer>
            )
          }
        }
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={config.xAxisKey} />
              <YAxis />
              <RechartsTooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey={config.dataKey}
                stroke={config.color}
                strokeWidth={3}
                dot={{ fill: config.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    )
  }

  return (
    <Box sx={{p:3}}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: "#E3F2FD", color: "#1976D2" }}>
            <BarChart3 size={20} />
          </Avatar>
          <Typography variant="h4" fontWeight="bold">
            Dashboard Analytics
          </Typography>
          <Chip label="Live Data" size="small" sx={{ bgcolor: "#E8F5E8", color: "#2E7D32" }} />
        </Stack>
        <Tooltip title="Refresh Data">
          <IconButton onClick={fetchDashboardData} disabled={loading}>
            <RefreshCw size={16} />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard sx={{bgcolor:"#dbeafe"}}>
            <CardContent sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h4" fontWeight="bold" color={colors.primary}>
                {data?.applicationsByMonth?.reduce((sum, item) => sum + item.count, 0) || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Applications
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
        <StyledCard sx={{bgcolor:"#dcfce7"}}>
        <CardContent sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h4" fontWeight="bold" color={colors.success}>
                {data?.workflowStats?.reduce((sum, item) => sum + item.shortlisted, 0) || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Shortlisted
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* <Grid item xs={12} sm={6} md={3}>
        <StyledCard sx={{bgcolor:"#fff3e0"}}>
        <CardContent sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h4" fontWeight="bold" color={colors.warning}>
                {data?.workflowStats?.reduce((sum, item) => sum + item.interviewSchedule, 0) || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Interviews Scheduled
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid> */}

        <Grid item xs={12} sm={6} md={3}>
        <StyledCard sx={{bgcolor:"#f3e8ff"}}>
        <CardContent sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h4" fontWeight="bold" color={colors.secondary}>
                {data?.applicationsByDepartment?.length || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Departments
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Charts Grid */}
      <Grid container spacing={3}>
        {/* Applications by Month - Full Width */}
        <Grid item xs={12}>
          <ChartCard
            title={chartConfigs.applicationsByMonth.title}
            subtitle={chartConfigs.applicationsByMonth.subtitle}
            icon={chartConfigs.applicationsByMonth.icon}
          >
            {renderChart("applicationsByMonth")}
          </ChartCard>
        </Grid>

        {/* Workflow Stats - Half Width */}
        {/* <Grid item xs={12} md={6}>
          <ChartCard
            title={chartConfigs.workflowStats.title}
            subtitle={chartConfigs.workflowStats.subtitle}
            icon={chartConfigs.workflowStats.icon}
          >
            {renderChart("workflowStats")}
          </ChartCard>
        </Grid> */}

        {/* Applications by Department - Half Width */}
        <Grid item xs={12}>
          <ChartCard
            title={chartConfigs.applicationsByDepartment.title}
            subtitle={chartConfigs.applicationsByDepartment.subtitle}
            icon={chartConfigs.applicationsByDepartment.icon}
          >
            {renderChart("applicationsByDepartment")}
          </ChartCard>
        </Grid>

        {/* Top Positions - Half Width */}
        <Grid item xs={12} md={6}>
          <ChartCard
            title={chartConfigs.topPositions.title}
            subtitle={chartConfigs.topPositions.subtitle}
            icon={chartConfigs.topPositions.icon}
          >
            {renderChart("topPositions")}
          </ChartCard>
        </Grid>

        {/* Applications by Status - Half Width */}
        <Grid item xs={12} md={6}>
          <ChartCard
            title={chartConfigs.applicationsByStatus.title}
            subtitle={chartConfigs.applicationsByStatus.subtitle}
            icon={chartConfigs.applicationsByStatus.icon}
          >
            {renderChart("applicationsByStatus")}
          </ChartCard>
        </Grid>

     
      </Grid>
    </Box>
  )
}

export default Graphs
