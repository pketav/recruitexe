"use client"

import { useState, useEffect, useRef } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Skeleton,
  Alert,
  LinearProgress,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"
import {
  AccountBalance,
  TrendingUp,
  People,
  Warning,
  CheckCircle,
  CurrencyRupee,
  Assessment,
} from "@mui/icons-material"
import { useApi } from "@core/hooks/useApi"

// Helper functions for safe data handling
const safeArray = (value) => {
  if (Array.isArray(value)) return value
  if (value === null || value === undefined) return []
  return []
}

const safeObject = (value) => {
  if (value && typeof value === "object" && !Array.isArray(value)) return value
  return {}
}

const safeNumber = (value) => {
  const num = Number(value)
  return isNaN(num) ? 0 : num
}

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format large numbers
const formatNumber = (num) => {
  if (num >= 10000000) return (num / 10000000).toFixed(1) + "Cr"
  if (num >= 100000) return (num / 100000).toFixed(1) + "L"
  if (num >= 1000) return (num / 1000).toFixed(1) + "K"
  return num.toString()
}

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
  transition: "all 0.3s ease",
  border: "1px solid rgba(0, 0, 0, 0.05)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.12)",
  },
}))

const CleanMetricCard = styled(Card)(({ theme, bgcolor }) => ({
  borderRadius: 16,
  backgroundColor: bgcolor,
  border: "none",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
  },
}))

const HeaderBox = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
  borderRadius: 20,
  padding: theme.spacing(4),
  color: "white",
  marginBottom: theme.spacing(3),
  position: "relative",
  overflow: "hidden",
}))

// Color scheme
const cardColors = {
  blue: "#E3F2FD",
  green: "#E8F5E8",
  orange: "#FFF3E0",
  red: "#FFEBEE",
  purple: "#F3E5F5",
  teal: "#E0F2F1",
}

const colors = {
  blue: "#2196F3",
  green: "#4CAF50",
  orange: "#FF9800",
  red: "#F44336",
  purple: "#9C27B0",
  teal: "#009688",
}

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper sx={{ p: 2, border: "1px solid #ddd", borderRadius: 2, bgcolor: "white", boxShadow: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Typography key={index} variant="body2" sx={{ color: entry.color }}>
            <strong>{entry.name}:</strong> {formatCurrency(entry.value)}
          </Typography>
        ))}
      </Paper>
    )
  }
  return null
}

// Calculate metrics from budget data
const calculateBudgetMetrics = (data) => {
  const annualAllocation = safeNumber(data.annualAllocation)
  const budgetUtilized = safeNumber(data.budgetUtilized)
  const budgetRemaining = safeNumber(data.budgetRemaining)
  const totalEmployees = safeNumber(data.totalEmployees)
  const avgPayPerEmployee = safeNumber(data.avgPayPerEmployee)
  const departmentCount = safeNumber(data.departmentCount)

  const budgetOverdrawn = safeObject(data.budgetOverdrawn)
  const budgetUnderUtilized = safeObject(data.budgetUnderUtilized)

  const utilizationPercentage = annualAllocation > 0 ? (budgetUtilized / annualAllocation) * 100 : 0
  const remainingPercentage = annualAllocation > 0 ? (budgetRemaining / annualAllocation) * 100 : 0

  return {
    annualAllocation,
    budgetUtilized,
    budgetRemaining,
    totalEmployees,
    avgPayPerEmployee,
    departmentCount,
    utilizationPercentage,
    remainingPercentage,
    overdrawCount: safeNumber(budgetOverdrawn.count),
    underUtilizedCount: safeNumber(budgetUnderUtilized.count),
    totalOverdraw: safeNumber(budgetOverdrawn.totalOverdraw),
    totalUnderUtilized: safeNumber(budgetUnderUtilized.totalUnderUtilized),
  }
}

// Card configuration
const getCardConfig = (metrics) => [
  {
    title: "Annual Allocation",
    value: formatNumber(metrics.annualAllocation),
    subtitle: formatCurrency(metrics.annualAllocation),
    icon: AccountBalance,
    color: cardColors.blue,
    iconColor: "#1976d2",
  },
  {
    title: "Budget Utilized",
    value: `${metrics.utilizationPercentage.toFixed(1)}%`,
    subtitle: formatCurrency(metrics.budgetUtilized),
    icon: TrendingUp,
    color: cardColors.green,
    iconColor: "#388e3c",
  },
  {
    title: "Budget Remaining",
    value: `${metrics.remainingPercentage.toFixed(1)}%`,
    subtitle: formatCurrency(metrics.budgetRemaining),
    icon: CurrencyRupee,
    color: cardColors.orange,
    iconColor: "#f57c00",
  },
  {
    title: "Total Employees",
    value: metrics.totalEmployees,
    subtitle: `Avg: ${formatCurrency(metrics.avgPayPerEmployee)}/emp`,
    icon: People,
    color: cardColors.purple,
    iconColor: "#7b1fa2",
  },
  {
    title: "Under-Utilized",
    value: metrics.underUtilizedCount,
    subtitle: `${formatNumber(metrics.totalUnderUtilized)} unused`,
    icon: Warning,
    color: cardColors.red,
    iconColor: "#d32f2f",
  },
]

export default function BudgetDashboard({ period }) {
  const [budgetData, setBudgetData] = useState(null)
  //   const [period, setPeriod] = useState("7")
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { callApi } = useApi()

  // Use refs to track ongoing requests and prevent duplicate calls
  const abortControllerRef = useRef(null)
  const currentRequestRef = useRef(null)

  // Fetch budget data
  useEffect(() => {
    const fetchBudgetData = async () => {
      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      // Prevent multiple simultaneous requests for the same period
      const requestKey = `budget-${period}`
      if (currentRequestRef.current === requestKey) {
        return
      }

      currentRequestRef.current = requestKey
      abortControllerRef.current = new AbortController()

      setError(null)
      setIsLoading(true)

      try {
        const result = await callApi({
          endpoint: `/v1/api/Budged/manBudgetDashboard?period=${period}`,
          disableSnackbar: true, // Disable automatic snackbar to prevent spam
        })

        // Check if request was aborted
        if (abortControllerRef.current?.signal.aborted) {
          return
        }

        if (result.success) {
          const responseData = safeObject(result.data.items)
          console.log("Budget API Response:", responseData)
          setBudgetData(responseData)
        } else {
          console.error("API Error:", result.message)
          setError(result.message)
          setBudgetData(null)
        }
      } catch (error) {
        // Check if request was aborted
        if (abortControllerRef.current?.signal.aborted) {
          return
        }

        console.error("Fetch Error:", error)
        setError("Failed to fetch budget data")
        setBudgetData(null)
      } finally {
        // Only update loading state if this is still the current request
        if (currentRequestRef.current === requestKey) {
          setIsLoading(false)
          currentRequestRef.current = null
        }
      }
    }

    fetchBudgetData()

    // Cleanup function to cancel request when component unmounts or period changes
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      currentRequestRef.current = null
    }
  }, [period, callApi]) // Now safe to include callApi since it's memoized

  if (isLoading) {
    return <BudgetSkeleton />
  }

  if (!budgetData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          No budget data available. Please check your API connection and try again.
        </Alert>
      </Box>
    )
  }

  // Calculate metrics
  const metrics = calculateBudgetMetrics(budgetData)
  const cardConfig = getCardConfig(metrics)

  // Prepare chart data
  const pieData = [
    { name: "Utilized", value: metrics.budgetUtilized, color: colors.green },
    { name: "Remaining", value: metrics.budgetRemaining, color: colors.orange },
  ]

  const underUtilizedDepts = safeArray(budgetData.budgetUnderUtilized?.departments || [])
    .filter((dept) => safeNumber(dept.allocatedBudget) > 0)
    .sort((a, b) => safeNumber(b.budgetUnderUtilized) - safeNumber(a.budgetUnderUtilized))

  // Prepare department chart data - use actual department names or fallback to index
  const departmentChartData = underUtilizedDepts.slice(0, 6).map((dept, index) => ({
    name:
      dept.departmentName !== "N/A"
        ? dept.departmentName?.length > 15
          ? dept.departmentName.substring(0, 15) + "..."
          : dept.departmentName
        : `Dept ${index + 1}`,
    fullName: dept.departmentName !== "N/A" ? dept.departmentName : `Department ${index + 1}`,
    allocated: safeNumber(dept.allocatedBudget),
    used: safeNumber(dept.usedBudget),
    employees: safeNumber(dept.numberOfEmployees),
    utilization: safeNumber(dept.utilizationPercentage),
  }))

  return (
    <Box sx={{ p: 3, bgcolor: "#f8fafc", minHeight: "100vh" }}>
      {/* Error Alert */}
      {error && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
          API Warning: {error}
        </Alert>
      )}



      {/* Metric Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {cardConfig.map((card, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <CleanMetricCard bgcolor={card.color}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ color: "#666", mb: 1, fontWeight: 500 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: card.iconColor, mb: 0.5 }}>
                      {card.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
                      {card.subtitle}
                    </Typography>
                  </Box>
                  <card.icon sx={{ fontSize: 28, color: card.iconColor, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </CleanMetricCard>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Budget Utilization Overview */}
        <Grid item xs={12} lg={4}>
          <StyledCard>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                📊 Budget Utilization
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Overall budget allocation vs utilization
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${formatNumber(value)}`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>

              {/* Utilization Progress */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                  Utilization Progress: {metrics.utilizationPercentage.toFixed(1)}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={metrics.utilizationPercentage}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: "#f0f0f0",
                    "& .MuiLinearProgress-bar": {
                      bgcolor:
                        metrics.utilizationPercentage > 80
                          ? colors.red
                          : metrics.utilizationPercentage > 50
                            ? colors.orange
                            : colors.green,
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Department Budget Analysis */}
        <Grid item xs={12} lg={8}>
          <StyledCard>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                🏢 Department Budget Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Top departments by budget allocation and utilization
              </Typography>
              <Box sx={{ height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#666" fontSize={12} />
                    <YAxis stroke="#666" fontSize={12} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload?.length) {
                          const data = payload[0]?.payload
                          return (
                            <Paper
                              sx={{ p: 2, border: "1px solid #ddd", borderRadius: 2, bgcolor: "white", boxShadow: 2 }}
                            >
                              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                              <strong>Department:</strong>  {data?.fullName || label}
                              </Typography>
                              <Typography variant="body2" sx={{ color: colors.blue }}>
                                <strong>Allocated:</strong> {formatCurrency(data?.allocated || 0)}
                              </Typography>
                              <Typography variant="body2" sx={{ color: colors.green }}>
                                <strong>Used:</strong> {formatCurrency(data?.used || 0)}
                              </Typography>
                              <Typography variant="body2" sx={{ color: colors.purple }}>
                                <strong>Employees:</strong> {data?.employees || 0}
                              </Typography>
                              <Typography variant="body2" sx={{ color: colors.orange }}>
                                <strong>Utilization:</strong> {data?.utilization || 0}%
                              </Typography>
                            </Paper>
                          )
                        }
                        return null
                      }}
                    />
                    <Legend />
                    <Bar dataKey="allocated" fill={colors.blue} name="Allocated Budget" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="used" fill={colors.green} name="Used Budget" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Under-Utilized Departments */}
        <Grid item xs={12}>
          <StyledCard>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                ⚠️ Under-Utilized Budget Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Departments with significant unused budget allocation ({underUtilizedDepts?.length} departments)
              </Typography>

              {underUtilizedDepts?.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#f8fafc" }}>
                        <TableCell sx={{ fontWeight: 700, fontSize:16 }}>Department</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize:16 }}>SubDepartment</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize:16 }}>Designation</TableCell>

                        <TableCell align="center" sx={{ fontWeight: 700, fontSize:16 }}>
                          Employees
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, fontSize:16 }}>
                          Allocated Budget
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, fontSize:16 }}>
                          Used Budget
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, fontSize:16 }}>
                          Under-Utilized
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, fontSize:16 }}>
                          Utilization %
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, fontSize:16 }}>
                          Status
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {underUtilizedDepts.map((dept, index) => (
                        <TableRow key={index} hover>
                          <TableCell>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {dept.departmentName}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {dept.subDepartmentName}
                            </Typography>

                          </TableCell>
                          <TableCell>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {dept.designationName}
                            </Typography>
                          </TableCell>

                          <TableCell align="center">
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {dept.numberOfEmployees}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body1" sx={{ fontWeight: 600, color: colors.blue }}>
                              {formatCurrency(dept.allocatedBudget)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body1" sx={{ fontWeight: 600, color: colors.green }}>
                              {formatCurrency(dept.usedBudget)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body1" sx={{ fontWeight: 600, color: colors.red }}>
                              {formatCurrency(dept.budgetUnderUtilized)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight: 600,
                                  color:
                                    dept.utilizationPercentage > 50
                                      ? colors.green
                                      : dept.utilizationPercentage > 20
                                        ? colors.orange
                                        : colors.red,
                                }}
                              >
                                {dept.utilizationPercentage}%
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={dept.utilizationPercentage}
                                sx={{
                                  width: 60,
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor: "#f0f0f0",
                                  "& .MuiLinearProgress-bar": {
                                    bgcolor:
                                      dept.utilizationPercentage > 50
                                        ? colors.green
                                        : dept.utilizationPercentage > 20
                                          ? colors.orange
                                          : colors.red,
                                    borderRadius: 3,
                                  },
                                }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={
                                dept.utilizationPercentage === 0
                                  ? "Unused"
                                  : dept.utilizationPercentage < 20
                                    ? "Critical"
                                    : dept.utilizationPercentage < 50
                                      ? "Low"
                                      : "Moderate"
                              }
                              size="small"
                              color={
                                dept.utilizationPercentage === 0
                                  ? "error"
                                  : dept.utilizationPercentage < 20
                                    ? "error"
                                    : dept.utilizationPercentage < 50
                                      ? "warning"
                                      : "primary"
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <CheckCircle sx={{ fontSize: 48, color: colors.green, mb: 2 }} />
                  <Typography variant="h6" sx={{ color: colors.green, fontWeight: 600 }}>
                    Excellent Budget Utilization!
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    All departments are efficiently utilizing their allocated budgets.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Budget Summary Cards */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <StyledCard>
                <CardContent sx={{ p: 3, textAlign: "center" }}>
                  <Assessment sx={{ fontSize: 48, color: colors.blue, mb: 2 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: colors.blue, mb: 1 }}>
                    {metrics.utilizationPercentage.toFixed(1)}%
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Overall Utilization
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatCurrency(metrics.budgetUtilized)} of {formatCurrency(metrics.annualAllocation)} allocated
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>

            <Grid item xs={12} md={4}>
              <StyledCard>
                <CardContent sx={{ p: 3, textAlign: "center" }}>
                  <Warning sx={{ fontSize: 48, color: colors.orange, mb: 2 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: colors.orange, mb: 1 }}>
                    {formatNumber(metrics.totalUnderUtilized)}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Under-Utilized
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Across {metrics.underUtilizedCount} departments
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>

            <Grid item xs={12} md={4}>
              <StyledCard>
                <CardContent sx={{ p: 3, textAlign: "center" }}>
                  <People sx={{ fontSize: 48, color: colors.purple, mb: 2 }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: colors.purple, mb: 1 }}>
                    {formatCurrency(metrics.avgPayPerEmployee)}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Avg Per Employee
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Across {metrics.totalEmployees} employees
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

// Loading Skeleton
function BudgetSkeleton() {
  return (
    <Box sx={{ p: 3 }}>
      <Skeleton variant="rectangular" width="100%" height={120} sx={{ borderRadius: 2, mb: 3 }} />
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[...Array(5)].map((_, i) => (
          <Grid item xs={12} sm={6} md={2.4} key={i}>
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={3}>
        {[...Array(4)].map((_, i) => (
          <Grid item xs={12} md={6} key={i}>
            <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 2 }} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}