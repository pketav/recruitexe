"use client"

import { useState, useEffect } from "react"
import { Container, Grid, Paper, Typography, Box, Alert, AlertTitle } from "@mui/material"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

// Loading Spinner Component
const LoadingSpinner = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "50vh",
    }}
  >
    <Typography variant="h6">Loading...</Typography>
  </Box>
)

// KPI Card Component
const KPICard = ({ title, value, icon, color, trend }) => (
  <Paper
    sx={{
      p: 3,
      display: "flex",
      alignItems: "center",
      gap: 2,
      background:
        color === "success"
          ? "linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)"
          : color === "primary"
            ? "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)"
            : color === "info"
              ? "linear-gradient(45deg, #00BCD4 30%, #4DD0E1 90%)"
              : "linear-gradient(45deg, #FF9800 30%, #FFC107 90%)",
      color: "white",
    }}
  >
    <Box sx={{ fontSize: "2rem" }}>{icon}</Box>
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="div">
        {value}
      </Typography>
      <Typography variant="body2">{title}</Typography>
      {trend && (
        <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {trend.isPositive ? "↗️" : "↘️"}
          {Math.abs(trend.value)}
          {typeof trend.value === "number" && trend.value < 1 ? "" : "%"}
        </Typography>
      )}
    </Box>
  </Paper>
)

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

const mockAIPerformanceData = {
  metrics: {
    accuracy: 87,
    accuracyTrend: { value: 3, isPositive: true },
    precision: 82,
    precisionTrend: { value: 1, isPositive: true },
    recall: 79,
    recallTrend: { value: 2, isPositive: false },
    f1Score: 0.81,
    f1Trend: { value: 0.02, isPositive: true },
  },
  scoreDistribution: [
    { score: "0-20", count: 45 },
    { score: "21-40", count: 89 },
    { score: "41-60", count: 234 },
    { score: "61-80", count: 567 },
    { score: "81-100", count: 312 },
  ],
  humanVsAI: [
    { category: "True Positive", ai: 156, human: 149 },
    { category: "False Positive", ai: 34, human: 41 },
    { category: "True Negative", ai: 567, human: 572 },
    { category: "False Negative", ai: 43, human: 38 },
  ],
  genderDistribution: [
    { stage: "Applications", male: 620, female: 487, other: 140 },
    { stage: "AI Qualified", male: 189, female: 134, other: 19 },
    { stage: "Interviews", male: 51, female: 32, other: 6 },
    { stage: "Hired", male: 15, female: 9, other: 2 },
  ],
  ageDistribution: [
    { name: "22-25", value: 180 },
    { name: "26-30", value: 420 },
    { name: "31-35", value: 350 },
    { name: "36-40", value: 200 },
    { name: "41+", value: 97 },
  ],
  ethnicityDistribution: [
    { name: "White", value: 45 },
    { name: "Asian", value: 25 },
    { name: "Hispanic", value: 15 },
    { name: "Black", value: 10 },
    { name: "Other", value: 5 },
  ],
  performanceTrends: [
    { month: "Jan", accuracy: 84, precision: 80, recall: 76 },
    { month: "Feb", accuracy: 85, precision: 81, recall: 77 },
    { month: "Mar", accuracy: 86, precision: 81, recall: 78 },
    { month: "Apr", accuracy: 87, precision: 82, recall: 79 },
    { month: "May", accuracy: 87, precision: 82, recall: 79 },
  ],
}

const TargetIcon = () => <span style={{ fontSize: "20px" }}>🎯</span>
const TrendingUpIcon = () => <span style={{ fontSize: "20px" }}>📈</span>
const UsersIcon = () => <span style={{ fontSize: "20px" }}>👥</span>
const AlertIcon = () => <span style={{ fontSize: "20px" }}>⚠️</span>

export default function AIPerformancePage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setData(mockAIPerformanceData)
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          🤖 AI Performance & Bias Monitoring
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor AI model effectiveness, accuracy, and fairness metrics
        </Typography>
      </Box>

      {/* AI Metrics KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Model Accuracy"
            value={`${data.metrics.accuracy}%`}
            icon={<TargetIcon />}
            color="success"
            trend={data.metrics.accuracyTrend}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Precision"
            value={`${data.metrics.precision}%`}
            icon={<TrendingUpIcon />}
            color="primary"
            trend={data.metrics.precisionTrend}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Recall"
            value={`${data.metrics.recall}%`}
            icon={<UsersIcon />}
            color="info"
            trend={data.metrics.recallTrend}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="F1 Score"
            value={data.metrics.f1Score.toFixed(2)}
            icon={<AlertIcon />}
            color="warning"
            trend={data.metrics.f1Trend}
          />
        </Grid>
      </Grid>

      {/* Bias Alert */}
      <Box sx={{ mb: 3 }}>
        <Alert severity="warning">
          <AlertTitle>⚠️ Bias Detection Alert</AlertTitle>
          Potential bias detected in gender distribution at the AI qualification stage. Review recommended to ensure
          fair screening practices.
        </Alert>
      </Box>

      <Grid container spacing={3}>
        {/* AI Score Distribution */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, height: 450 }}>
            <Typography variant="h6" gutterBottom>
              📊 AI Score Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.scoreDistribution}  margin={{ top: 20, right: 30, left: 0, bottom:40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="score" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Human vs AI Decisions */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, height: 450 }}>
            <Typography variant="h6" gutterBottom>
              🤖 vs 👨‍💼 Human vs AI Decisions
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.humanVsAI} margin={{ top: 20, right: 30, left: 0, bottom:40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ai" fill="#8884d8" name="AI Decisions" />
                <Bar dataKey="human" fill="#82ca9d" name="Human Overrides" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Gender Distribution */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, height: 450 }}>
            <Typography variant="h6" gutterBottom>
              👫 Gender Distribution by Stage
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data.genderDistribution}
                margin={{ top: 20, right: 30, left: 0, bottom:40 }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="male" stackId="a" fill="#8884d8" name="Male" />
                <Bar dataKey="female" stackId="a" fill="#82ca9d" name="Female" />
                <Bar dataKey="other" stackId="a" fill="#ffc658" name="Other" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Age Distribution */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, height: 450 }}>
            <Typography variant="h6" gutterBottom>
              🎂 Age Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.ageDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.ageDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Ethnicity Distribution */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, height: 450 }}>
            <Typography variant="h6" gutterBottom>
              🌍 Ethnicity Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.ethnicityDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.ethnicityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Model Performance Over Time */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, height: 450 }}>
            <Typography variant="h6" gutterBottom>
              📈 Model Performance Trends
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.performanceTrends}  margin={{ top: 20, right: 30, left: 0, bottom:40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="accuracy" stroke="#8884d8" strokeWidth={3} name="Accuracy %" />
                <Line type="monotone" dataKey="precision" stroke="#82ca9d" strokeWidth={3} name="Precision %" />
                <Line type="monotone" dataKey="recall" stroke="#ffc658" strokeWidth={3} name="Recall %" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}
