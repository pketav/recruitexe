"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from "axios"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Collapse,
  Grid,
  Chip,
  Button,
  Avatar,
  Tabs,
  CardHeader,
  Tab,
  Container,
  Paper,
  Stack,
  CircularProgress,
  alpha,
  useTheme,
  TablePagination,
  TextField,
  IconButton,
  MenuItem,
  LinearProgress,
  InputAdornment,
  Popper,
  ClickAwayListener,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from "@mui/material"
import { DateRange } from "react-date-range"
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import format from "date-fns/format"
import { styled, keyframes } from "@mui/material/styles"
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  AlertTriangle,
  Briefcase,
  Star,
  Eye,
  Building,
  Award,
  Target,
  XCircle,
  Activity,
  Calendar,
  Filter,
} from "lucide-react"
import { ToggleButtonGroup, ToggleButton } from "@mui/material"
import ViewListIcon from "@mui/icons-material/ViewList"
import ViewModuleIcon from "@mui/icons-material/ViewModule"
import { AccountCircle, Deselect, DoDisturb, ImportantDevicesTwoTone, Pause, Refresh, SelectAllRounded, Stop, WorkspacePremium } from "@mui/icons-material"
import { useApi } from "@core/hooks/useApi"
import { useSearchParams, useRouter } from "next/navigation"
import Reporting from "./Reporting/page"
import CandidateManagement from "./CandidateManagement/page"
import CandidateMap from "./CandidateMap/page"
import { Person, CalendarToday } from "@mui/icons-material"
import PersonPinCircleOutlinedIcon from '@mui/icons-material/PersonPinCircleOutlined';

import { Search, Work, Psychology, CheckCircle, Clear, Dashboard } from "@mui/icons-material"
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

const pulseGlow = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(46, 226, 94, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(46, 226, 94, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(46, 226, 94, 0);
  }
`

const slideInFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`

const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
`

// Styled components
const EnhancedContainer = styled(Paper)(({ theme }) => ({
  background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
  borderRadius: "20px",
  padding: theme.spacing(3),
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  backdropFilter: "blur(10px)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)",
  },
  animation: `${slideInFromLeft} 0.6s ease-out`,

  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    borderRadius: "12px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.05)"
  }
}));


const AnimatedAvatar = styled(Avatar)(({ theme }) => ({
  background: "linear-gradient(135deg, rgb(111, 241, 239) 0%, rgb(46, 226, 94) 100%)",
  width: 48,
  height: 48,
  boxShadow: "0 8px 25px rgba(46, 226, 94, 0.3)",
  animation: `${pulseGlow} 2s infinite, ${floatAnimation} 3s ease-in-out infinite`,
  transition: "all 0.3s cubic-bezier(0.23, 1, 0.320, 1)",
  "&:hover": {
    transform: "scale(1.1) translateY(-2px)",
    boxShadow: "0 12px 35px rgba(46, 226, 94, 0.4)",
  },
}))

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.9)",
  borderRadius: "16px",
  padding: "4px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  border: "1px solid rgba(99, 102, 241, 0.2)",
  backdropFilter: "blur(10px)",
  "& .MuiToggleButton-root": {
    border: "none",
    borderRadius: "12px",
    padding: "8px 16px",
    margin: "0 2px",
    textTransform: "none",
    fontWeight: 600,
    fontSize: "0.875rem",
    color: "#64748b",
    transition: "all 0.3s cubic-bezier(0.23, 1, 0.320, 1)",
    "&:hover": {
      background: "rgba(99, 102, 241, 0.1)",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 15px rgba(99, 102, 241, 0.2)",
    },
    "&.Mui-selected": {
      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      color: "white",
      boxShadow: "0 6px 20px rgba(99, 102, 241, 0.4)",
      "&:hover": {
        background: "linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)",
        transform: "translateY(-2px)",
      },
    },
  },
}))

const ActionButton = styled(IconButton)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(0, 0, 0, 0.1)",
  borderRadius: "12px",
  width: 44,
  height: 44,
  color: "#64748b",
  transition: "all 0.3s cubic-bezier(0.23, 1, 0.320, 1)",
  "&:hover": {
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    color: "white",
    transform: "translateY(-3px) scale(1.05)",
    boxShadow: "0 8px 25px rgba(99, 102, 241, 0.3)",
  },
}))

const StatsChip = styled(Chip)(({ theme }) => ({
  background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
  border: "1px solid rgba(99, 102, 241, 0.2)",
  color: "#6366f1",
  fontWeight: 600,
  fontSize: "0.875rem",
  height: 32,
  borderRadius: "16px",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    color: "white",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
  },
}))

// Styled components for gradient backgrounds and custom styling
const GradientBox = styled(Box)(({ theme }) => ({
  backgroundColor: "#f8fafc",
  minHeight: "100vh",
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
  "&.Mui-selected": {
    backgroundColor: "white",
    color: "#2196F3",
    borderRadius: theme.spacing(1),
  },
  "&:hover": {
    color: "white",
    borderRadius: theme.spacing(1),
  },
  "&.MuiTab-root:hover": {
    color: "#0b0303",
  },
}))

// Enhanced Period Filter Component
const PeriodFilterDropdown = ({
  selectedPeriod,
  onPeriodChange,
  customStartDate,
  customEndDate,
  onCustomDateChange,
}) => {
  const [customDialogOpen, setCustomDialogOpen] = useState(false)
  const [tempDateRange, setTempDateRange] = useState([
    {
      startDate: customStartDate || new Date(),
      endDate: customEndDate || new Date(),
      key: "selection",
    },
  ])

  const periodOptions = [
    { value: "all", label: "All", icon: <Activity size={16} /> },
    { value: "1days", label: "Today", icon: <Clock size={16} /> },
    { value: "7days", label: "Last 7 Days", icon: <Calendar size={16} /> },
    { value: "30days", label: "Last 30 Days", icon: <Calendar size={16} /> },
    { value: "custom", label: "Custom", icon: <Filter size={16} /> },
  ]

  const handlePeriodSelect = (period) => {
    if (period === "custom") {
      setCustomDialogOpen(true)
    } else {
      onPeriodChange(period)
    }
  }

  const handleCustomDateApply = () => {
    const startDate = format(tempDateRange[0].startDate, "yyyy-MM-dd")
    const endDate = format(tempDateRange[0].endDate, "yyyy-MM-dd")

    onCustomDateChange(tempDateRange[0].startDate, tempDateRange[0].endDate)
    onPeriodChange("custom", startDate, endDate)
    setCustomDialogOpen(false)
  }

  const getDisplayText = () => {
    if (selectedPeriod === "custom" && customStartDate && customEndDate) {
      return `${format(customStartDate, "MMM dd")} - ${format(customEndDate, "MMM dd, yyyy")}`
    }
    return periodOptions.find((option) => option.value === selectedPeriod)?.label || "Select Period"
  }

  return (
    <>

      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Time Period</InputLabel>
        <Select
          value={selectedPeriod}
          label="Time Period"
          onChange={(e) => handlePeriodSelect(e.target.value)}
          sx={{
            borderRadius: 2,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(99, 102, 241, 0.3)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(99, 102, 241, 0.5)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#6366f1",
            },
          }}
        >
          {periodOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {option.icon}
                <Typography>{option.label}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Custom Date Range Dialog */}
      <Dialog open={customDialogOpen} onClose={() => setCustomDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Calendar size={20} />
            Select Custom Date Range
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <DateRange
              editableDateInputs={true}
              onChange={(item) => setTempDateRange([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={tempDateRange}
              maxDate={new Date()}
              showSelectionPreview={true}
              showDateDisplay={false}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button onClick={() => setCustomDialogOpen(false)} variant="outlined" sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            onClick={handleCustomDateApply}
            variant="contained"
            sx={{
              borderRadius: 2,
              background: "linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)",
            }}
          >
            Apply Range
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

function MetricCard({ title, value, subtitle, icon: Icon, bgcolor, textColor, onClick }) {
  return (
    <Card
      sx={{
        bgcolor: bgcolor,
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 2,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.3s ease",
        "&:hover": onClick
          ? {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }
          : {},
      }}
    >
      <CardContent sx={{ p: 3 }} onClick={onClick}>
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

const demoDashboardData = {
  overview: {
    totalApplications: 186,
    totalShortlisted: 58,
    totalRejected: 31,
  },
  departments: [
    { departmentId: "dept-legal", departmentName: "Legal", count: 46 },
    { departmentId: "dept-finance", departmentName: "Finance", count: 38 },
    { departmentId: "dept-ops", departmentName: "Operations", count: 42 },
    { departmentId: "dept-hr", departmentName: "HR", count: 26 },
    { departmentId: "dept-sales", departmentName: "Sales", count: 34 },
  ],
  hotPositions: [
    { _id: "hot-1", position: "Branch Manager", departmentName: "Operations", applications: 34, daysSincePosted: 4 },
    { _id: "hot-2", position: "Credit Officer", departmentName: "Finance", applications: 28, daysSincePosted: 6 },
    { _id: "hot-3", position: "Legal Executive", departmentName: "Legal", applications: 22, daysSincePosted: 3 },
  ],
  coldPositions: [
    { _id: "cold-1", position: "Recovery Officer", departmentName: "Operations", applications: 5, daysSincePosted: 18 },
    { _id: "cold-2", position: "HR Recruiter", departmentName: "HR", applications: 7, daysSincePosted: 14 },
    { _id: "cold-3", position: "Field Sales Executive", departmentName: "Sales", applications: 9, daysSincePosted: 21 },
  ],
}

const demoAiDashboardData = {
  keyMetrics: {
    totalApplications: 142,
    aiApproved: 64,
    aiRejected: 39,
    aiPending: 39,
  },
  departmentPerformance: [
    { department: "Legal", totalApps: 46, approved: 18, Reject: 8, passRate: "72%", color: "#e0f2fe" },
    { department: "Finance", totalApps: 38, approved: 16, Reject: 9, passRate: "64%", color: "#f3e5f5" },
    { department: "Operations", totalApps: 42, approved: 19, Reject: 13, passRate: "59%", color: "#e8f5e8" },
    { department: "Sales", totalApps: 34, approved: 11, Reject: 9, passRate: "55%", color: "#fce4ec" },
  ],
}

const demoGraphData = {
  applicationsByMonth: [
    { month: "January", count: 18 },
    { month: "February", count: 24 },
    { month: "March", count: 31 },
    { month: "April", count: 42 },
    { month: "May", count: 71 },
  ],
  applicationsByDepartment: [
    { departmentName: "Legal", count: 46 },
    { departmentName: "Finance", count: 38 },
    { departmentName: "Operations", count: 42 },
    { departmentName: "HR", count: 26 },
    { departmentName: "Sales", count: 34 },
  ],
  applicationsByStatus: [
    { status: "active", count: 97 },
    { status: "shortlisted", count: 58 },
    { status: "notshortlisted", count: 31 },
  ],
  topPositions: [
    { position: "Branch Manager", count: 34 },
    { position: "Credit Officer", count: 28 },
    { position: "Legal Executive", count: 22 },
    { position: "HR Recruiter", count: 18 },
  ],
  workflowStats: [
    { month: "January", applications: 18, shortlisted: 7, interviewSchedule: 4, offered: 2 },
    { month: "February", applications: 24, shortlisted: 9, interviewSchedule: 6, offered: 3 },
    { month: "March", applications: 31, shortlisted: 13, interviewSchedule: 8, offered: 4 },
    { month: "April", applications: 42, shortlisted: 16, interviewSchedule: 11, offered: 7 },
    { month: "May", applications: 71, shortlisted: 22, interviewSchedule: 15, offered: 9 },
  ],
  ShortlistedlistRate: [
    { month: "January", successRate: 38, totalApplications: 18, hired: 2 },
    { month: "February", successRate: 42, totalApplications: 24, hired: 3 },
    { month: "March", successRate: 48, totalApplications: 31, hired: 4 },
    { month: "April", successRate: 53, totalApplications: 42, hired: 7 },
    { month: "May", successRate: 61, totalApplications: 71, hired: 9 },
  ],
  aiScreeningMetrics: [
    { month: "January", passed: 8, failed: 4, avgMatchPercentage: 68 },
    { month: "February", passed: 12, failed: 6, avgMatchPercentage: 71 },
    { month: "March", passed: 16, failed: 8, avgMatchPercentage: 74 },
    { month: "April", passed: 21, failed: 10, avgMatchPercentage: 76 },
    { month: "May", passed: 33, failed: 11, avgMatchPercentage: 81 },
  ],
  timeToHire: [
    { month: "January", avgDays: 18, hires: 2 },
    { month: "February", avgDays: 16, hires: 3 },
    { month: "March", avgDays: 14, hires: 4 },
    { month: "April", avgDays: 12, hires: 7 },
    { month: "May", avgDays: 10, hires: 9 },
  ],
}

const demoVolumes = [
  { position: "Branch Manager", volume: "High", applications: 34, approved: 16, passRate: 72, avgScore: 81, status: "Strong" },
  { position: "Credit Officer", volume: "High", applications: 28, approved: 13, passRate: 66, avgScore: 77, status: "Healthy" },
  { position: "Legal Executive", volume: "Medium", applications: 22, approved: 9, passRate: 58, avgScore: 73, status: "Watch" },
  { position: "Recovery Officer", volume: "Low", applications: 5, approved: 1, passRate: 38, avgScore: 61, status: "Needs Attention" },
]

const demoCandidates = [
  {
    id: "cand-1",
    candidateId: "CAND001",
    name: "Rahul Sharma",
    mobile: "9876543210",
    email: "rahul.sharma@example.com",
    qualification: "MBA Finance",
    position: "Credit Officer",
    department: "Finance",
    recruiter: "Demo Admin",
    candidateStatus: "ACTIVE",
    applicationStatus: "ACTIVE",
    AI_Screeing_Status: "Completed",
    AI_Screeing_Result: "Approved",
    AI_Confidence: "High",
    AI_Score: 86,
    matchPercentage: "86%",
    resumeShortlisted: "shortlisted",
    createdAt: "18/05/2026",
  },
  {
    id: "cand-2",
    candidateId: "CAND002",
    name: "Priya Mehta",
    mobile: "9876543211",
    email: "priya.mehta@example.com",
    qualification: "LLB",
    position: "Legal Executive",
    department: "Legal",
    recruiter: "Demo Admin",
    candidateStatus: "ACTIVE",
    applicationStatus: "ACTIVE",
    AI_Screeing_Status: "Completed",
    AI_Screeing_Result: "Approved",
    AI_Confidence: "Medium",
    AI_Score: 79,
    matchPercentage: "79%",
    resumeShortlisted: "active",
    createdAt: "17/05/2026",
  },
  {
    id: "cand-3",
    candidateId: "CAND003",
    name: "Amit Jain",
    mobile: "9876543212",
    email: "amit.jain@example.com",
    qualification: "B.Com",
    position: "Branch Manager",
    department: "Operations",
    recruiter: "Demo Admin",
    candidateStatus: "ACTIVE",
    applicationStatus: "ACTIVE",
    AI_Screeing_Status: "Pending",
    AI_Screeing_Result: "Pending",
    AI_Confidence: "",
    AI_Score: 0,
    matchPercentage: "0%",
    resumeShortlisted: "active",
    createdAt: "16/05/2026",
  },
]

export default function JobApplicationDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("all")
  const [customStartDate, setCustomStartDate] = useState(null)
  const [customEndDate, setCustomEndDate] = useState(null)
  const [tabValue, setTabValue] = useState(0)
  const [dashboardData, setDashboardData] = useState(demoDashboardData)
  const { callApi, loading } = useApi()
  const router = useRouter()
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }
  const [showFilters, setShowFilters] = useState(true);
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const theme = useTheme()
  const searchParams = useSearchParams()
  const stage = searchParams.get("stage")
  const mode = searchParams.get("mode");
  const [modeToSet, setModeToSet] = useState(null)
  const [viewMode, setViewMode] = useState("table")
  const [open, setOpen] = useState(false)
  const anchorRef = useRef(null)
  const [selecteddepartment, setSelectedDepartment] = useState("")

  const handleRangeChange = (item) => {
    const { startDate, endDate } = item.selection;

    setFilters(prev => ({
      ...prev,
      startDate: startDate || "",
      endDate: endDate || "",
    }));

    if (startDate && endDate && startDate.getTime() !== endDate.getTime()) {
      setOpen(false);
    }
  };

  const handleClickAway = () => {
    setOpen(false)
  }

  useEffect(() => {
    const stageTabMap = {
      1: 0,
      2: 1,
    }

    if (stage && stageTabMap[stage] !== undefined) {
      setTabValue(stageTabMap[stage])
      setModeToSet(mode)

      const newParams = new URLSearchParams(searchParams.toString())
      newParams.delete("stage")
      newParams.delete("mode")

      const newUrl = `/JobApplications?${newParams.toString()}`
      router.replace(newUrl)
    }
  }, [stage])

  const fetchDashboardData = async (period, customStart = null, customEnd = null) => {
    let endpoint = `/v1/api/job/getDashboardSummary?period=${period}`

    if (period === "custom" && customStart && customEnd) {
      endpoint = `/v1/api/job/getDashboardSummary?period=custom&customStartDate=${customStart}&customEndDate=${customEnd}`
    }

    const response = await callApi({
      endpoint,
      disableSnackbar: true,
    })

    if (response.success && response.data?.items) {
      setDashboardData(response.data.items)
    }
  }

  useEffect(() => {
    if (selectedPeriod === "custom" && customStartDate && customEndDate) {
      const startDate = format(customStartDate, "yyyy-MM-dd")
      const endDate = format(customEndDate, "yyyy-MM-dd")
      fetchDashboardData(selectedPeriod, startDate, endDate)
    } else {
      fetchDashboardData(selectedPeriod)
    }
  }, [selectedPeriod, customStartDate, customEndDate])

  const handlePeriodChange = (period, customStart = null, customEnd = null) => {
    setSelectedPeriod(period)
    if (period === "custom" && customStart && customEnd) {
      // Custom dates are already set in the parent component
    }
  }

  const handleCustomDateChange = (startDate, endDate) => {
    setCustomStartDate(startDate)
    setCustomEndDate(endDate)
  }
  const [referenceSummaryList, setReferenceSummaryList] = useState([
    { employeeName: "Demo Admin" },
    { employeeName: "Neha Recruiter" },
  ]);

  const [candidates, setCandidates] = useState(demoCandidates)
  const [formattedCandidates, setFormattedCandidates] = useState(demoCandidates)
  const [error, setError] = useState(null)
  const [totalItems, setTotalItems] = useState(demoCandidates.length)
  const [totalShortlisted, setTotalShortlisted] = useState(1)
  const [totalRejected, setTotalRejected] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(50)
  const [filters, setFilters] = useState({
    position: "",
    searchTerm: "",
    AI_Screeing_Result: "",
    resumeShortlisted: "",
    startDate: "",
    endDate: "",
    departmentId: "",
    branchId: "",
    qualificationId: "",
    internalReferenceEmployeeName: ""
  })

  const [orgs, setOrgs] = useState({ _id: "org-demo", name: "Fincoopers" })
  const getOrganization = async () => {
    try {
      const res = await callApi({
        endpoint: `/v1/api/org/getOrganizations`,
        disableSnackbar: true,
      })
      if (res.data?.items?.[0]) {
        setOrgs(res.data.items[0]);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  const [depts, setDepts] = useState([
    { _id: "dept-legal", name: "Legal" },
    { _id: "dept-finance", name: "Finance" },
    { _id: "dept-ops", name: "Operations" },
    { _id: "dept-hr", name: "HR" },
    { _id: "dept-sales", name: "Sales" },
  ])
  const getDepartment = async () => {
    try {
      const res = await callApi({
        endpoint: `/v1/api/newdepartment/deparmentFromJobApply`,
        disableSnackbar: true,
      })
      const responseData = res.data
      if (responseData?.status && Array.isArray(responseData.items) && responseData.items.length) {
        setDepts(responseData.items)
      }
    } catch (error) {
      console.error("error", error)
    }
  }

  const [designations, setDesignations] = useState([
    { _id: "des-branch-manager", name: "Branch Manager" },
    { _id: "des-credit-officer", name: "Credit Officer" },
    { _id: "des-legal-exec", name: "Legal Executive" },
    { _id: "des-hr-recruiter", name: "HR Recruiter" },
  ])

  const getDesignations = async () => {
    try {
      const res = await callApi({
        endpoint: `/v1/api/designation/getAllFromJobApply`,
        disableSnackbar: true,
      })

      if (Array.isArray(res.data?.items) && res.data.items.length) {
        setDesignations(res.data.items)
      }
    } catch (error) {
      console.error("error", error)
    }
  }

  const [branches, setBranches] = useState([
    { _id: "branch-indore", name: "Indore" },
    { _id: "branch-bhopal", name: "Bhopal" },
    { _id: "branch-jaipur", name: "Jaipur" },
  ])

  const getBranches = async () => {
    try {
      const res = await callApi({
        endpoint: `/v1/api/branch/getBranchNamesFromJobApply  `,
        disableSnackbar: true,
      })

      if (Array.isArray(res.data?.items) && res.data.items.length) {
        setBranches(res.data.items)
      }
    } catch (error) {
      console.error("error", error)
    }
  }

  const [qualifications, setQualifications] = useState([
    { _id: "qual-mba", name: "MBA" },
    { _id: "qual-llb", name: "LLB" },
    { _id: "qual-bcom", name: "B.Com" },
    { _id: "qual-graduate", name: "Graduate" },
  ])

  const getQualifications = async (id) => {
    try {
      const res = await callApi({
        endpoint: `/v1/api/qualification/jobApplyUsedQualification?organizationId=${id}`,
        disableSnackbar: true,
      })

      if (Array.isArray(res.data?.items) && res.data.items.length) {
        setQualifications(res.data.items)
      }
    } catch (error) {
      console.error("error", error)
    }
  }

  useEffect(() => {
    getDesignations()
    getDepartment()
    getBranches()
    getOrganization()
  }, [])

  useEffect(() => {
    if (orgs._id) {
      getQualifications(orgs._id)
    }
  }, [orgs])

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const PaginationComponent = ({ page, rowsPerPage, rowsPerPageOptions, count, onPageChange, onRowsPerPageChange }) => {
    return (
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", mt: 4 }}>
        <TablePagination
          component="div"
          count={count}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={rowsPerPageOptions}
          labelRowsPerPage="Applicants per page:"
          sx={{
            ".MuiTablePagination-toolbar": {
              pl: 2,
              pr: 1,
              borderRadius: 2,
              backgroundColor: "#ffffff",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            },
            ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
              fontSize: "0.85rem",
              color: "#475569",
            },
            ".MuiInputBase-root": {
              fontSize: "0.85rem",
            },
          }}
        />
      </Box>
    )
  }

  const [aiDashboardData, setAiDashboardData] = useState(demoAiDashboardData)
  const getDashboardData = async () => {
    let endpoint = `/v1/api/job/AIDashboard?period=${selectedPeriod}`

    if (selectedPeriod === "custom" && customStartDate && customEndDate) {
      const startDate = format(customStartDate, "yyyy-MM-dd")
      const endDate = format(customEndDate, "yyyy-MM-dd")
      endpoint = `/v1/api/job/AIDashboard?period=custom&customStartDate=${startDate}&customEndDate=${endDate}`
    }

    try {
      const res = await callApi({
        endpoint,
        disableSnackbar: true,
      })
      if (res.data?.status && res.data?.items) {
        setAiDashboardData(res.data.items)
      }
    } catch (error) {
      console.error("Error fetching AI dashboard data:", error)
    }
  }

  const [screeningResults, setScreeningResults] = useState({})
  const [volumes, setVolumes] = useState(demoVolumes)
  const getScreeningResults = async () => {
    let endpoint = `/v1/api/job/getScreeningAnalytics?period=${selectedPeriod}`

    if (selectedPeriod === "custom" && customStartDate && customEndDate) {
      const startDate = format(customStartDate, "yyyy-MM-dd")
      const endDate = format(customEndDate, "yyyy-MM-dd")
      endpoint = `/v1/api/job/getScreeningAnalytics?period=custom&customStartDate=${startDate}&customEndDate=${endDate}`
    }

    try {
      const res = await callApi({
        endpoint,
        disableSnackbar: true,
      })
      if (res.data?.status && res.data?.items) {
        setScreeningResults(res.data.items)
        setVolumes([
          ...(res.data.items.dashboard?.positionMatrix?.highVolume || []),
          ...(res.data.items.dashboard?.positionMatrix?.lowVolume || []),
        ])
      }
    } catch (error) {
      console.error("Error fetching screening results:", error)
    }
  }

  const [graphData, setGraphData] = useState(demoGraphData)
  const fetchGraphsDashboardData = async () => {
    setError(null)
    let endpoint = `/v1/api/job/getDashboardMetrics?period=${selectedPeriod}`

    if (selectedPeriod === "custom" && customStartDate && customEndDate) {
      const startDate = format(customStartDate, "yyyy-MM-dd")
      const endDate = format(customEndDate, "yyyy-MM-dd")
      endpoint = `/v1/api/job/getDashboardMetrics?period=custom&customStartDate=${startDate}&customEndDate=${endDate}`
    }

    try {
      const response = await callApi({
        endpoint,
        disableSnackbar: true,
      })

      if (response.success && response.data?.items) {
        setGraphData(response.data.items)
      }
    } catch (err) {
      setError("Error fetching data: " + err.message)
    }
  }

  useEffect(() => {
    getDashboardData()
    getScreeningResults()
    fetchGraphsDashboardData()
  }, [selectedPeriod, customStartDate, customEndDate])

  const [agentDetail, setAgentDetail] = useState({})

  const getAgentDetail = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/v1/api/airphone/get/data`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token
          }
        }
      );

      const result = response.data?.items;
      setAgentDetail(result)

    } catch (error) {
      console.error('API error:', error);
    }
  }

  useEffect(() => {
    getAgentDetail()
  }, [])
  // Fetch candidates data
  const fetchCandidates = async () => {
    try {
      const response = await callApi({
        endpoint: `/v1/api/job/getAll?page=${page + 1}&limit=${rowsPerPage}&position=${filters.position}&search=${filters.searchTerm}&AI_Screeing_Result=${filters.AI_Screeing_Result}&resumeShortlisted=${filters.resumeShortlisted}&startDate=${filters.startDate}&endDate=${filters?.endDate}&departmentId=${filters.departmentId}&branchId=${filters.branchId}&qualificationId=${filters.qualificationId}&internalReferenceEmployeeName=${filters.internalReferenceEmployeeName || ""}`,
        disableSnackbar: true,
      })


      if (response.success && response.data?.items) {
        // if (formattedCandidates.length === 0) {
        //   setRowsPerPage(response.data.items.totalCount)
        // }
        setCandidates(response.data.items.data)
        setTotalItems(response.data.items.totalCount)
        setTotalShortlisted(response.data.items.totalShortlisted)
        setTotalRejected(response.data.items.totalRejected)
        const formattedApplications = [
          ...new Map(
            response.data.items.data.map((item) => [
              item._id,
              {
                id: item._id,
                candidateId: item.candidateUniqueId || "",
                orgId: item.orgainizationId || '',
                name: item.name || "",
                mobile: item.mobileNumber || "",
                email: item.emailId || "",
                qualification: item.highestQualification || "",
                university: item.university || "",
                graduationYear: item.graduationYear || "",
                cgpa: item.cgpa || "",
                address: item.address || "",
                state: item.state || "",
                city: item.city || "",
                pincode: item.pincode || "",
                skills: item.skills || [],
                resume: item.resume?.startsWith("blob:") ? item.resume.replace("blob:", "") : item.resume || "",
                jobPostId: item.jobPostId || "",
                interviewMode: item.preferedInterviewMode || "",
                position: item.position || "",
                source: item.knewaboutJobPostFrom || "",
                currentDesignation: item.designationDetail?.name || "",
                lastOrganization: item.lastOrganization || "",
                startDate: item.startDate || "",
                endDate: item.endDate || "",
                reasonForLeaving: item.reasonLeaving || "",
                experience: item.totalExperience || "",
                currentCTC: item.currentCTC || "",
                expectedCTC: item.expectedCTC || "",
                currentLocation: item.currentLocation || "",
                preferredLocation: item.preferredLocation || "",
                gap: item.gapIfAny || "",
                offerLetterStatus: item.finCooperOfferLetter || "",
                offerLetterPath: item.pathofferLetterFinCooper || "",
                interviewStatus: item.interviewSchedule || "",
                hrFeedback: item.feedbackByHr || "",
                candidateStatus: (item.candidateStatus || "").toUpperCase(),
                isEligible: item.isEligible === "false" ? "Not Eligible" : "Eligible",
                matchPercentage: item.matchPercentage != null ? `${item.matchPercentage}%` : "0%",
                summary: item.summary || "",
                applicationStatus: item.status?.toUpperCase() || "",
                department: item.department?.name || "",
                subDepartment: item.subDepartment?.name || "",
                recruiter: item.employees?.employeName || "",
                branches: item.branches,
                createdAt: item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                  : "",
                candidateDetails: item?.candidateDetails || {},
                AI_Screeing_Status: item?.AI_Screeing_Status || "Pending",
                AI_Screeing_Result: item?.AI_Screeing_Result || "Pending",
                AI_Confidence: item?.AI_Confidence || "",
                AI_Score: item?.AI_Score || 0,
                resumeShortlisted: item?.resumeShortlisted || "active",
                Remark: item?.Remark || "",
                JobType: item?.JobType || "",
                qualificationDetails: item?.qualificationDetails || "",
                interviewScheduleDetail: item?.interviewScheduleDetail || [],
                documentRequest: item?.documentRequest || '',
                offerLetter: item?.offerLetter || '',
                OfferLetterStatus: item?.OfferLetterStatus || '',
                ReportRequest : item?.ReportRequest || '',
                Reporturl : item?.Reporturl || ''
              },
            ]),
          ).values(),
        ]

        setFormattedCandidates(formattedApplications)
      }
    } catch (err) {
      setError("Error fetching candidates: " + err.message)
    }
  }

  useEffect(() => {
    fetchCandidates()
  }, [page, rowsPerPage, filters, selecteddepartment, filters.internalReferenceEmployeeName])

  useEffect(() => {
    const fetchReferenceSummary = async () => {
      const response = await callApi({ endpoint: "/v1/api/job/internal-reference-summary", disableSnackbar: true });


      if (response.success && response.data?.items) {
        setReferenceSummaryList(response.data.items)
      }
    }

    fetchReferenceSummary()
  }, []);

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
                  const labelName =
                    name.toLowerCase() === "active"
                      ? "Pending"
                      : name.toLowerCase() === "notshortlisted"
                        ? "Rejected"
                        : "Approved"
                  return `${labelName} ${(percent * 100).toFixed(0)}%`
                }}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
        )

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

  // Process data for charts
  const processedData = useMemo(() => {
    if (!graphData) return null

    const processed = {}

    // Applications by Month
    processed.applicationsByMonth = graphData.applicationsByMonth
      ?.filter((item) => item.count > 0)
      .map((item) => ({
        month: item.month.substring(0, 3),
        count: item.count,
      }))

    // Applications by Department
    processed.applicationsByDepartment = graphData.applicationsByDepartment?.map((item, index) => ({
      ...item,
      color: chartColors[index % chartColors.length],
    }))

    // Applications by Status
    processed.applicationsByStatus = graphData.applicationsByStatus?.map((item, index) => ({
      ...item,
      color: chartColors[index % chartColors.length],
    }))

    // Top Positions
    processed.topPositions = graphData.topPositions?.map((item, index) => ({
      ...item,
      color: chartColors[index % chartColors.length],
    }))

    // Workflow Stats (filter out months with no data)
    processed.workflowStats = graphData.workflowStats
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
    processed.ShortlistedlistRate = graphData.ShortlistedlistRate?.filter((item) => item.totalApplications > 0).map(
      (item) => ({
        month: item.month.substring(0, 3),
        successRate: item.successRate,
        totalApplications: item.totalApplications,
        hired: item.hired || 0,
      }),
    )

    // AI Screening Metrics
    processed.aiScreeningMetrics = graphData.aiScreeningMetrics
      ?.filter((item) => item.passed > 0 || item.failed > 0)
      .map((item) => ({
        month: item.month.substring(0, 3),
        passed: item.passed,
        failed: item.failed,
        avgMatchPercentage: item.avgMatchPercentage,
        total: item.passed + item.failed,
      }))

    // Time to Hire
    processed.timeToHire = graphData.timeToHire
      ?.filter((item) => item.avgDays > 0)
      .map((item) => ({
        month: item.month.substring(0, 3),
        avgDays: item.avgDays,
        hires: item.hires,
      }))

    return processed
  }, [graphData])

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter((value) => value && value !== "").length
  }

  const clearAllFilters = () => {
    setFilters({
      position: "",
      searchTerm: "",
      AI_Screeing_Result: "",
      resumeShortlisted: "",
      startDate: "",
      endDate: "",
      departmentId: "",
      branchId: "",
      qualificationId: "",
      internalReferenceEmployeeName: ""
    })
    setSelectedDepartment("")
  }

  if (loading && !dashboardData) {
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
        <Stack direction="row" justifyContent="space-between" alignItems="center" >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar sx={{ bgcolor: "linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)", width: 32, height: 32 }}>
                <Users size={20} />
              </Avatar>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  background: "linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Job Application Analytics
              </Typography>
            </Stack>
            <Chip
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
            />
          </Stack>

          {/* Enhanced Period Filter */}
          {(tabValue === 0) && (
            <PeriodFilterDropdown
              selectedPeriod={selectedPeriod}
              onPeriodChange={handlePeriodChange}
              customStartDate={customStartDate}
              customEndDate={customEndDate}
              onCustomDateChange={handleCustomDateChange}
            />
          )}
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
          {selectedPeriod === "custom" && customStartDate && customEndDate && (
            <Chip
              label={`${format(customStartDate, "MMM dd")} - ${format(customEndDate, "MMM dd, yyyy")}`}
              size="small"
              sx={{
                bgcolor: "#f3e5f5",
                color: "#7b1fa2",
                border: "1px solid #ce93d8",
              }}
            />
          )}
        </Stack>

        {/* Navigation Tabs */}
        <TabsContainer>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            TabIndicatorProps={{ style: { display: "none" } }}
          >
            <StyledTab icon={<Dashboard size={16} />} label="Dashboard" iconPosition="start" />
            <StyledTab icon={<Users size={16} />} label="Candidates" iconPosition="start" />
            <StyledTab icon={<PersonPinCircleOutlinedIcon size={16} />} label="Map" iconPosition="start" />

          </Tabs>
        </TabsContainer>

        {!dashboardData ? null : (
          <TabPanel value={tabValue} index={0}>
            {/* Main Metrics */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} lg={3}>
                <MetricCard
                  title="Total Applications"
                  value={dashboardData?.overview?.totalApplications || 0}
                  subtitle="All submissions"
                  icon={Users}
                  bgcolor="#e0f2fe"
                  textColor="#0277bd"
                  onClick={() => setTabValue(1)}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <MetricCard
                  title="Approved"
                  value={dashboardData?.overview?.totalShortlisted || 0}
                  subtitle="Applicants Approved"
                  icon={UserCheck}
                  bgcolor="#f3e5f5"
                  textColor="#7b1fa2"
                  onClick={() => {
                    setTabValue(1)
                    setFilters((prev) => ({
                      ...prev,
                      resumeShortlisted: "shortlisted",
                    }))
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <MetricCard
                  title="Rejected"
                  value={dashboardData?.overview?.totalRejected || 0}
                  subtitle="Applicants Rejected"
                  icon={UserX}
                  bgcolor="#ffebee"
                  textColor="#d32f2f"
                  onClick={() => {
                    setTabValue(1)
                    setFilters((prev) => ({
                      ...prev,
                      resumeShortlisted: "notshortlisted",
                    }))
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <MetricCard
                  title="Pending"
                  value={
                    (dashboardData?.overview?.totalApplications || 0) -
                    ((dashboardData?.overview?.totalShortlisted || 0) + (dashboardData?.overview?.totalRejected || 0))
                  }
                  subtitle="Decision Pending"
                  icon={Eye}
                  bgcolor="#f1f8e9"
                  textColor="#689f38"
                  onClick={() => {
                    setTabValue(1)
                    setFilters((prev) => ({
                      ...prev,
                      resumeShortlisted: "active",
                    }))
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} lg={3}>
                <MetricCard
                  title="Total Ai Screened"
                  value={aiDashboardData?.keyMetrics?.totalApplications}
                  icon={Users}
                  bgcolor="#e0f2fe"
                  textColor="#0277bd"
                  subtitle="AI Screened Applicants"
                />
              </Grid>

              <Grid item xs={12} sm={6} lg={3}>
                <MetricCard
                  title="AI Approved"
                  value={aiDashboardData?.keyMetrics?.aiApproved}
                  icon={UserCheck}
                  bgcolor="#e8f5e9"
                  textColor="#2e7d32"
                  subtitle=" AI Approved Applicants"
                  onClick={() => {
                    setTabValue(1)
                    setFilters((prev) => ({
                      ...prev,
                      AI_Screeing_Result: "Approved",
                    }))
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <MetricCard
                  title="AI Rejected"
                  value={aiDashboardData?.keyMetrics?.aiRejected}
                  icon={UserX}
                  bgcolor="#ffebee"
                  textColor="#c62828"
                  subtitle="AI Rejected Applicants"
                  onClick={() => {
                    setTabValue(1)
                    setFilters((prev) => ({
                      ...prev,
                      AI_Screeing_Result: "Rejected",
                    }))
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} lg={3}>
                <MetricCard
                  title="AI Screening Pending"
                  value={aiDashboardData?.keyMetrics?.aiPending}
                  subtitle="AI Screening Pending"
                  icon={Award}
                  bgcolor="#fce7f3"
                  textColor="#be185d"
                  onClick={() => {
                    setTabValue(1)
                    setFilters((prev) => ({
                      ...prev,
                      AI_Screeing_Result: "Pending",
                    }))
                  }}
                />
              </Grid>
            </Grid>

            {/* Department Breakdown */}
            <Card
              sx={{
                bgcolor: "white",
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: 2,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                mb: 3,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                  <Avatar sx={{ bgcolor: "#E3F2FD", color: "#1976D2" }}>
                    <Briefcase size={20} />
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold">
                    Department Breakdown
                  </Typography>
                  <Chip label="Live" size="small" sx={{ bgcolor: "#E3F2FD", color: "#1976D2" }} />
                </Stack>
                <Grid container spacing={2}>
                  {dashboardData?.departments?.map((dept) => {
                    const deptStyle = departmentColors[dept.departmentName] || defaultDeptColor
                    return (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={dept.departmentId}>
                        <Card
                          sx={{
                            bgcolor: deptStyle.color,
                            border: `1px solid ${deptStyle.textColor}20`,
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            "&:hover": { transform: "translateY(-2px)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" },
                          }}
                          onClick={() => {
                            setFilters((prev) => ({
                              ...prev,
                              departmentId: dept.departmentId,
                            }))
                            setTabValue(1)
                          }}
                        >
                          <CardContent>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Box>
                                <Typography variant="body2" fontWeight="medium" sx={{ color: deptStyle.textColor }}>
                                  {dept.departmentName}
                                </Typography>
                                <Typography variant="h4" fontWeight="bold" sx={{ color: deptStyle.textColor }}>
                                  {dept.count}
                                </Typography>
                                <Typography variant="body2" sx={{ color: deptStyle.textColor, opacity: 0.7 }}>
                                  Applications
                                </Typography>
                              </Box>
                              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.5)", color: deptStyle.textColor }}>
                                <Users size={20} />
                              </Avatar>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    )
                  })}
                </Grid>
              </CardContent>
            </Card>

            <Paper sx={{ p: 2, mb: 3 }}>
              <Box display="flex" alignItems="center" gap={1} mb={3}>
                <Box
                  sx={{
                    width: 4,
                    height: 24,
                    background: "linear-gradient(to bottom, #3b82f6, #8b5cf6)",
                    borderRadius: 2,
                  }}
                />
                <Typography variant="h6" fontWeight="bold">
                  Analytics
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  overflowX: "auto",
                  "&::-webkit-scrollbar": {
                    height: 6,
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: alpha(theme.palette.grey[300], 0.3),
                    borderRadius: 3,
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: alpha(theme.palette.grey[500], 0.5),
                    borderRadius: 3,
                  },
                }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Card
                      sx={{
                        background: "#f8fafc",
                        border: "1px solid #cbd5e1",
                        height: "auto",
                      }}
                    >
                      <CardHeader
                        sx={{
                          background: "linear-gradient(135deg, #818cf8 0%, #a5b4fc 100%)",
                          color: "white",
                        }}
                        title={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Building />
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                color: "#1e293b",
                                mb: 1,
                              }}
                            >
                              Department Performance Breakdown
                            </Typography>
                          </Box>
                        }
                        subheader={
                          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                            Detailed analysis by department
                          </Typography>
                        }
                      />
                      <CardContent sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                          {aiDashboardData?.departmentPerformance?.map((dept, index) => (
                            <Grid item xs={12} md={6} lg={4} key={index}>
                              <Card sx={{ p: 2, background: dept.color, border: "1px solid rgba(0, 0, 0, 0.05)" }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                  <Typography variant="h6" fontWeight="bold" color="#374151">
                                    {dept.department}
                                  </Typography>
                                  <Chip
                                    label={`${dept.totalApps} apps`}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                      backgroundColor: "rgba(99, 102, 241, 0.1)",
                                      color: "#6366f1",
                                      borderColor: "#6366f1",
                                    }}
                                  />
                                </Box>
                                <Stack spacing={2}>
                                  <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body2" color="#059669" fontWeight="medium">
                                      Passed: {dept.approved}
                                    </Typography>
                                    <Typography variant="body2" color="#dc2626" fontWeight="medium">
                                      Failed: {dept.Reject}
                                    </Typography>
                                  </Box>
                                  <LinearProgress
                                    variant="determinate"
                                    value={Number((dept.passRate || "0").replace("%", ""))}
                                    sx={{
                                      height: 8,
                                      borderRadius: 4,
                                      backgroundColor: alpha(theme.palette.grey[300], 0.3),
                                      "& .MuiLinearProgress-bar": {
                                        background: "linear-gradient(90deg, #10b981 0%, #059669 100%)",
                                        borderRadius: 4,
                                      },
                                    }}
                                  />
                                  <Typography variant="caption" fontWeight="medium" color="#374151">
                                    {dept?.passRate} pass rate
                                  </Typography>
                                </Stack>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Paper>

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
                        <Star size={20} />
                      </Avatar>
                      <Typography variant="h5" fontWeight="bold">
                        Hot Positions
                      </Typography>
                      <Chip label="Trending" size="small" sx={{ bgcolor: "#FFF3E0", color: "#F57C00" }} />
                    </Stack>
                    <Stack spacing={2}>
                      {dashboardData?.hotPositions?.map((position) => {
                        const deptStyle = departmentColors[position.departmentName] || defaultDeptColor
                        return (
                          <Paper
                            key={position._id}
                            sx={{
                              p: 2,
                              border: "1px solid #FFE0B2",
                              "&:hover": { borderColor: "#FFB74D" },
                              transition: "border-color 0.2s",
                              cursor: "pointer",
                            }}
                          >
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                              onClick={() => {
                                setFilters((prev) => ({
                                  ...prev,
                                  position: position.position,
                                }))
                                setTabValue(1)
                              }}
                            >
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar sx={{ bgcolor: "#FFF3E0", color: "#F57C00" }}>
                                  <Briefcase size={20} />
                                </Avatar>
                                <Box>
                                  <Typography variant="body1" fontWeight="medium">
                                    {position.position}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {position.departmentName}
                                  </Typography>
                                </Box>
                              </Stack>
                              <Box sx={{ textAlign: "right" }}>
                                <Typography variant="body1" fontWeight="bold" sx={{ color: "#F57C00" }}>
                                  {position.applications} Applicants
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Posted {position.daysSincePosted} days ago
                                </Typography>
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
                        <AlertTriangle size={20} />
                      </Avatar>
                      <Typography variant="h5" fontWeight="bold">
                        Cold Positions
                      </Typography>
                      <Chip label="Needs Attention" size="small" sx={{ bgcolor: "#E3F2FD", color: "#1976D2" }} />
                    </Stack>
                    <Stack spacing={2}>
                      {dashboardData?.coldPositions?.map((position) => {
                        const deptStyle = departmentColors[position.departmentName] || defaultDeptColor
                        return (
                          <Paper
                            key={position._id}
                            sx={{
                              p: 2,
                              border: "1px solid #BBDEFB",
                              "&:hover": { borderColor: "#64B5F6" },
                              transition: "border-color 0.2s",
                              cursor: "pointer",
                            }}
                          >
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                              onClick={() => {
                                setFilters((prev) => ({
                                  ...prev,
                                  position: position.position,
                                }))
                                setTabValue(1)
                              }}
                            >
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar sx={{ bgcolor: "#E3F2FD", color: "#1976D2" }}>
                                  <Briefcase size={20} />
                                </Avatar>
                                <Box>
                                  <Typography variant="body1" fontWeight="medium">
                                    {position.position}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {position.departmentName}
                                  </Typography>
                                </Box>
                              </Stack>
                              <Box sx={{ textAlign: "right" }}>
                                <Typography variant="body1" fontWeight="bold" sx={{ color: "#1976D2" }}>
                                  {position.applications} Applicants
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Posted {position.daysSincePosted} days ago
                                </Typography>
                              </Box>
                            </Stack>
                          </Paper>
                        )
                      })}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card
                  sx={{
                    background: "#faf5ff",
                    border: "1px solid #e9d5ff",
                  }}
                >
                  <CardHeader
                    sx={{
                      background: "linear-gradient(135deg,rgb(161, 123, 252) 0%,rgb(255, 96, 175) 100%)",
                      color: "white",
                    }}
                    title={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Target />
                        <Typography variant="h6">Position Performance Matrix</Typography>
                      </Box>
                    }
                    subheader={
                      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                        Application volume vs. success rate by position
                      </Typography>
                    }
                  />
                  <CardContent>
                    <Grid container spacing={2}>
                      {volumes.map((position, index) => (
                        <Grid item xs={12} md={6} lg={3} key={index}>
                          <Card sx={{ p: 2, background: "white", "&:hover": { boxShadow: theme.shadows[4] } }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                              <Chip
                                label={position.volume}
                                sx={{
                                  backgroundColor: position.applications > 50 ? "#dbeafe" : "#f3f4f6",
                                  color: position.applications > 50 ? "#1d4ed8" : "#6b7280",
                                }}
                                size="small"
                              />
                              <Box>
                                {position.passRate > 70 ? (
                                  <CheckCircle sx={{ color: "#059669" }} />
                                ) : position.passRate > 50 ? (
                                  <Eye sx={{ color: "#d97706" }} />
                                ) : (
                                  <XCircle sx={{ color: "#dc2626" }} />
                                )}
                              </Box>
                            </Box>
                            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                              {position.position}
                            </Typography>
                            <Stack spacing={1}>
                              <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2" color="text.secondary">
                                  Applications:
                                </Typography>
                                <Typography variant="body2" fontWeight="medium">
                                  {position.applications}
                                </Typography>
                              </Box>
                              <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2" color="text.secondary">
                                  Approved:
                                </Typography>
                                <Typography variant="body2" fontWeight="medium">
                                  {position.approved}
                                </Typography>
                              </Box>
                              <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2" color="text.secondary">
                                  Pass Rate:
                                </Typography>
                                <Typography variant="body2" fontWeight="medium">
                                  {position.passRate}%
                                </Typography>
                              </Box>
                              <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2" color="text.secondary">
                                  Avg Score:
                                </Typography>
                                <Typography variant="body2" fontWeight="medium">
                                  {position.avgScore}%
                                </Typography>
                              </Box>
                              <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2" color="text.secondary">
                                  Status:
                                </Typography>
                                <Typography variant="body2" fontWeight="medium">
                                  {position.status}
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={position.passRate}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  my: 5,
                                  backgroundColor: alpha(theme.palette.grey[300], 0.3),
                                  "& .MuiLinearProgress-bar": {
                                    background: "linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)",
                                    borderRadius: 4,
                                  },
                                }}
                              />
                            </Stack>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <ChartCard
                  title={chartConfigs.applicationsByMonth.title}
                  subtitle={chartConfigs.applicationsByMonth.subtitle}
                  icon={chartConfigs.applicationsByMonth.icon}
                >
                  {renderChart("applicationsByMonth")}
                </ChartCard>
              </Grid>

              <Grid item xs={12}>
                <ChartCard
                  title={chartConfigs.applicationsByDepartment.title}
                  subtitle={chartConfigs.applicationsByDepartment.subtitle}
                  icon={chartConfigs.applicationsByDepartment.icon}
                >
                  {renderChart("applicationsByDepartment")}
                </ChartCard>
              </Grid>

              <Grid item xs={12} md={6}>
                <ChartCard
                  title={chartConfigs.topPositions.title}
                  subtitle={chartConfigs.topPositions.subtitle}
                  icon={chartConfigs.topPositions.icon}
                >
                  {renderChart("topPositions")}
                </ChartCard>
              </Grid>

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
            <CardContent sx={{ p: 2 }}>
              <Box display="flex" justifyContent="flex-end" >
                <Tooltip title={showFilters ? "Hide Filters" : "Show Filters"}>
                  <IconButton
                    onClick={() => setShowFilters(!showFilters)}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: "#EEF1FF",
                      color: "#4E36FF",
                      height: 30,
                      width: 30,
                      "&:hover": {
                        backgroundColor: "#DDE2FF"
                      }
                    }}
                  >
                    {showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
              <Collapse in={showFilters} timeout="auto" unmountOnExit>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <EnhancedContainer elevation={0}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: 1,
                          alignItems: "center",
                          mt: 2
                        }}
                      >
                        {/* Left Filters */}
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            alignItems: "center",
                            flex: 1,
                            minWidth: "300px"
                          }}
                        >
                          {/* Search */}
                          <TextField
                            label="Search Applications"
                            variant="outlined"
                            size="small"
                            placeholder="Search by ID, Name, Email, etc..."
                            value={filters.searchTerm}
                            onChange={(e) =>
                              setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Search sx={{ color: "#667eea" }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              width: "250px",
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.15)",
                                },
                                "&.Mui-focused": {
                                  boxShadow: "0 4px 20px rgba(102, 126, 234, 0.25)",
                                },
                              },
                            }}
                          />

                          {/* Date */}
                          <ClickAwayListener onClickAway={handleClickAway}>
                            <Box>
                              <TextField
                                label="Applied Date"
                                inputRef={anchorRef}
                                value={
                                  filters.startDate && filters.endDate
                                    ? `${format(filters.startDate, "dd/MM/yyyy")} - ${format(filters.endDate, "dd/MM/yyyy")}`
                                    : ""
                                }
                                onClick={() => setOpen(true)}
                                readOnly
                                size="small"
                                sx={{
                                  width: "250px",
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: 2, // ✅ this is where it works!
                                  },
                                }}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <CalendarToday sx={{ color: "#45b7d1" }} />
                                    </InputAdornment>
                                  ),
                                }}
                              />

                              <Popper
                                open={open}
                                anchorEl={anchorRef.current}
                                placement="bottom-start"
                                sx={{ zIndex: 1500 }}
                              >
                                <Box bgcolor="white" boxShadow={3} p={1}>
                                  <DateRange
                                    editableDateInputs
                                    onChange={handleRangeChange}
                                    moveRangeOnFirstSelection={false}
                                    maxDate={new Date()}
                                    ranges={[
                                      {
                                        startDate: filters.startDate || new Date(),
                                        endDate: filters.endDate || new Date(),
                                        key: "selection",
                                      },
                                    ]}
                                  />
                                </Box>
                              </Popper>
                            </Box>
                          </ClickAwayListener>

                          {/* Location */}
                          <TextField
                            select
                            label="Locations"
                            size="small"
                            value={filters.branchId}
                            onChange={(e) =>
                              setFilters((prev) => ({ ...prev, branchId: e.target.value }))
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Work sx={{ color: "#f093fb" }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              width: "250px",
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  boxShadow: "0 4px 12px rgba(240, 147, 251, 0.15)",
                                },
                                "&.Mui-focused": {
                                  boxShadow: "0 4px 20px rgba(240, 147, 251, 0.25)",
                                },
                              },
                            }}
                          >
                            {Array.isArray(branches) &&
                              branches.map((branch) => (
                                <MenuItem key={branch._id} value={branch._id}>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    {branch.name}
                                  </Box>
                                </MenuItem>
                              ))}
                          </TextField>
                        </Box>

                        {/* Right: Toggle + Reset */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: { xs: 2, sm: 0 },
                          }}
                        >
                          <StyledToggleButtonGroup
                            value={viewMode}
                            exclusive
                            onChange={(e, nextView) => {
                              if (nextView) setViewMode(nextView)
                            }}
                            size="small" sx={{ mr: 5 }}
                          >
                            <ToggleButton value="table" aria-label="Table View">
                              <ViewListIcon sx={{ fontSize: 18, mr: 1 }} />
                              Table
                            </ToggleButton>
                            <ToggleButton value="card" aria-label="Card View">
                              <ViewModuleIcon sx={{ fontSize: 18, mr: 1 }} />
                              Cards
                            </ToggleButton>
                          </StyledToggleButtonGroup>

                          <IconButton
                            onClick={clearAllFilters}
                            sx={{
                              marginLeft: "10px",
                              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              color: "white",
                              width: 30,
                              height: 30,
                              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                                transform: "scale(1.1) rotate(180deg)",
                                boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
                              },
                            }}
                          >
                            <Refresh fontSize="small" />
                          </IconButton>
                          <Typography fontSize={14} fontWeight={600} color="primary">
                            Reset
                          </Typography>
                        </Box>
                      </Box>



                      <Grid
                        container
                        spacing={2}
                        wrap="nowrap"
                        sx={{
                          mt: 2,
                          overflowX: "auto",
                          flexWrap: "nowrap",
                          scrollbarWidth: "thin",
                          "&::-webkit-scrollbar": {
                            height: 6,
                          },
                          "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "#ccc",
                            borderRadius: 3,
                          },
                        }}
                      >

                        <Grid item xs={12} md={2.5}>
                          <TextField
                            fullWidth
                            select
                            label="Qualification"
                            size="small"
                            value={filters.qualificationId}
                            onChange={(e) =>
                              setFilters((prev) => ({
                                ...prev,
                                qualificationId: e.target.value,
                              }))
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Work sx={{ color: "#f093fb" }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  boxShadow: "0 4px 12px rgba(240, 147, 251, 0.15)",
                                },
                                "&.Mui-focused": {
                                  boxShadow: "0 4px 20px rgba(240, 147, 251, 0.25)",
                                },
                              },
                            }}
                          >
                            {Array.isArray(qualifications) &&
                              qualifications.map((qualify) => (
                                <MenuItem key={qualify._id} value={qualify._id}>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>{qualify.name}</Box>
                                </MenuItem>
                              ))}
                          </TextField>
                        </Grid>

                        <Grid item xs={12} md={2.5}>
                          <TextField
                            fullWidth
                            select
                            label="Department"
                            size="small"
                            value={filters.departmentId}
                            onChange={(e) =>
                              setFilters((prev) => ({
                                ...prev,
                                departmentId: e.target.value,
                              }))
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Work sx={{ color: "#f093fb" }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  boxShadow: "0 4px 12px rgba(240, 147, 251, 0.15)",
                                },
                                "&.Mui-focused": {
                                  boxShadow: "0 4px 20px rgba(240, 147, 251, 0.25)",
                                },
                              },
                            }}
                          >
                            {Array.isArray(depts) &&
                              depts.map((dept) => (
                                <MenuItem key={dept._id} value={dept._id}>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>{dept.name}</Box>
                                </MenuItem>
                              ))}
                          </TextField>
                        </Grid>

                        <Grid item xs={12} md={2.5}>
                          <TextField
                            fullWidth
                            select
                            label="Position"
                            size="small"
                            value={filters.position}
                            onChange={(e) =>
                              setFilters((prev) => ({
                                ...prev,
                                position: e.target.value,
                              }))
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Work sx={{ color: "#f093fb" }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  boxShadow: "0 4px 12px rgba(240, 147, 251, 0.15)",
                                },
                                "&.Mui-focused": {
                                  boxShadow: "0 4px 20px rgba(240, 147, 251, 0.25)",
                                },
                              },
                            }}
                          >
                            {Array.isArray(designations) &&
                              designations.map((designation) => (
                                <MenuItem key={designation._id} value={designation.name}>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>{designation.name}</Box>
                                </MenuItem>
                              ))}
                          </TextField>
                        </Grid>

                        <Grid item xs={12} md={2.5}>
                          <TextField
                            fullWidth
                            select
                            label="AI Screening"
                            size="small"
                            value={filters.AI_Screeing_Result}
                            onChange={(e) =>
                              setFilters((prev) => ({
                                ...prev,
                                AI_Screeing_Result: e.target.value,
                              }))
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Psychology sx={{ color: "#a8e6cf" }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  boxShadow: "0 4px 12px rgba(168, 230, 207, 0.15)",
                                },
                                "&.Mui-focused": {
                                  boxShadow: "0 4px 20px rgba(168, 230, 207, 0.25)",
                                },
                              },
                            }}
                          >
                            <MenuItem value="Pending">
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Pause fontSize="small" sx={{ color: "#ff9800" }} />
                                Pending
                              </Box>
                            </MenuItem>
                            <MenuItem value="Approved">
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <CheckCircle fontSize="small" sx={{ color: "#4CAF50" }} />
                                Recommended
                              </Box>
                            </MenuItem>
                            <MenuItem value="Rejected">
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Clear fontSize="small" sx={{ color: "#f44336" }} />
                                Not Recommended
                              </Box>
                            </MenuItem>
                          </TextField>
                        </Grid>

                        <Grid item xs={12} md={2.5}>
                          <TextField
                            select
                            fullWidth
                            size="small"
                            label="Internal Reference"
                            value={filters.internalReferenceEmployeeName}
                            onChange={(e) =>
                              setFilters((prev) => ({
                                ...prev,
                                internalReferenceEmployeeName: e.target.value === "All" ? "" : e.target.value
                              }))
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <AccountCircle
                                    sx={{ color: "#a8e6cf" }} />
                                </InputAdornment>
                              )
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  boxShadow: "0 4px 12px rgba(168, 230, 207, 0.15)"
                                },
                                "&.Mui-focused": {
                                  boxShadow: "0 4px 20px rgba(168, 230, 207, 0.25)"
                                }
                              }
                            }}
                          >
                            {/* "All" Option */}
                            <MenuItem value="All">
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

                                All
                              </Box>
                            </MenuItem>

                            {/* Employee list */}
                            {referenceSummaryList.map((item, idx) => (
                              <MenuItem key={idx} value={item.employeeName}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <AccountCircle
                                    fontSize="small" sx={{ color: "#4CAF50" }} />
                                  {item.employeeName}
                                </Box>
                              </MenuItem>
                            ))}
                          </TextField>



                        </Grid>

                        <Grid item xs={12} md={2.5}>
                          <TextField
                            fullWidth
                            select
                            label="Selection Status"
                            size="small"
                            value={filters.resumeShortlisted}
                            onChange={(e) =>
                              setFilters((prev) => ({
                                ...prev,
                                resumeShortlisted: e.target.value,
                              }))
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Person sx={{ color: "#ffd93d" }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  boxShadow: "0 4px 12px rgba(255, 217, 61, 0.15)",
                                },
                                "&.Mui-focused": {
                                  boxShadow: "0 4px 20px rgba(255, 217, 61, 0.25)",
                                },
                              },
                            }}
                          >
                            <MenuItem value="active">
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Pause fontSize="small" sx={{ color: "#ff9800" }} />
                                Pending
                              </Box>
                            </MenuItem>
                            <MenuItem value="shortlisted">
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <CheckCircle fontSize="small" sx={{ color: "#4CAF50" }} />
                                Shortlisted
                              </Box>
                            </MenuItem>
                            <MenuItem value="notshortlisted">
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Clear fontSize="small" sx={{ color: "#f44336" }} />
                                Not Shortlisted
                              </Box>
                            </MenuItem>
                            <MenuItem value="approve">
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <WorkspacePremium fontSize="small" sx={{ color: "#4CAF50" }} />
                                Selected
                              </Box>
                            </MenuItem>
                            <MenuItem value="reject">
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <DoDisturb fontSize="small" sx={{ color: "#f44336" }} />
                                Not Selected
                              </Box>
                            </MenuItem>
                          </TextField>
                        </Grid>


                      </Grid>
                    </EnhancedContainer>
                  </Grid>
                </Grid>
              </Collapse>
              <Box sx={{ width: "100%" }}>
                {viewMode === "table" ? (
                  <Reporting
                    formattedCandidates={formattedCandidates}
                    fetchCandidates={fetchCandidates}
                    filters={filters}
                    setFilters={setFilters}
                    agentDetail={agentDetail}
                    modeToSet={modeToSet}
                  />
                ) : (
                  <CandidateManagement fetchCandidates={fetchCandidates} candidates={candidates} />
                )}
              </Box>
              <PaginationComponent
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[50, 75, 100]}
                count={totalItems}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
              />
            </CardContent>
          </Card>
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <CandidateMap />
        </TabPanel>
      </Container>
    </GradientBox>
  )
}
