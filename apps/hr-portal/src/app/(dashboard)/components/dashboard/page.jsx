// "use client";
// import {
//   AccessTime,
//   BarChart,
//   Cancel,
//   CheckCircle,
//   CreditCard,
//   Description,
//   Download as DownloadIcon,
//   FilterList,
//   GridView,
//   LocationCity,
//   Paid,
//   Person,
//   Search as SearchIcon,
//   CalendarMonth,
//   AccountBalance,
//   HourglassEmpty as HourglassFull,
//   ArrowBack,
//   Settings,
// } from "@mui/icons-material";
// import {
//   Box,
//   Grid,
//   Typography,
//   Card,
//   CardContent,
//   TextField,
//   Button,
//   Paper,
//   InputAdornment,
//   Snackbar,
//   Alert,
//   Chip,
//   Avatar,
// } from "@mui/material";
// import {
//   DataGrid,
//   GridToolbarContainer,
//   GridToolbarExport,
//   GridToolbarColumnsButton,
//   GridToolbarDensitySelector,
//   GridToolbarFilterButton,

// } from "@mui/x-data-grid";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useApi } from "@core/hooks/useApi";
// import dayjs from "dayjs";

// export default function Dashboard() {
//   const { callApi } = useApi();
//   const router = useRouter();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [rowsPerPage, setRowsPerPage] = useState(50);
//   const [rows, setRows] = useState([]);
//   const [columns, setColumns] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [recent, setRecent] = useState([]);
//   const [pending, setPending] = useState([]);

//   const [expenseStats, setExpenseStats] = useState([]);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const res = await callApi({
//           endpoint: "/v1/api/expenseSubmission/dashBoard?page=1&limit=10",
//           method: "GET",
//           auth: true,
//           disableSnackbar: true,
//         });

//         const data = res?.data;
//         if (!data?.status || !data?.items) {
//           throw new Error("Invalid response format");
//         }

//         const {
//           totalExpenses = 0,
//           pendingApprovals = 0,
//           approvedCount = 0,
//           rejectedCount = 0,
//           recentExpenses = {},
//           pendingApprovalsList = {},
//         } = data.items;

//         // Update Stat Cards
//         setExpenseStats([
//           {
//             title: "Total Expenses",
//             icon: CreditCard,
//             value: totalExpenses.toString(),
//             bgColor: "#e3f2fd",
//             borderColor: "#90caf9",
//             iconColor: "#1976d2",
//           },
//           {
//             title: "Pending Review",
//             icon: AccessTime,
//             value: pendingApprovals.toString(),
//             bgColor: "#fff3e0",
//             borderColor: "#ffb74d",
//             iconColor: "#ef6c00",
//           },
//           {
//             title: "Approved",
//             icon: CheckCircle,
//             value: approvedCount.toString(),
//             bgColor: "#e8f5e9",
//             borderColor: "#81c784",
//             iconColor: "#2e7d32",
//           },
//           {
//             title: "Rejected",
//             icon: Cancel,
//             value: rejectedCount.toString(),
//             bgColor: "#ffebee",
//             borderColor: "#ef9a9a",
//             iconColor: "#d32f2f",
//           },
//         ]);

//         // Convert object to array (ignoring pagination keys)
//         const recent = Object.values(recentExpenses).filter(
//           (item) => typeof item === "object" && item.submissionId
//         );
//         const pending = Object.values(pendingApprovalsList).filter(
//           (item) => typeof item === "object" && item.submissionId
//         );

//         setRecent(recent);
//         setPending(pending);
//       } catch (err) {
//         console.error("Dashboard API Error:", err);
//         setError("Failed to load dashboard data. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   return (
//     <Box sx={{ minHeight: "100vh", backgroundColor: "#f8fafc", p: 3 }}>
//       <Box sx={{ maxWidth: "1400px", mx: "auto" }}>
//         {/* Header Section */}
//         <Paper sx={{ p: 4, mb: 3, borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
//           <Grid container spacing={3} alignItems="center">

//             <Grid item xs={12}>
//               <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
//                 <Avatar
//                   sx={{
//                     backgroundColor: "#3b82f6",
//                     width: 48,
//                     height: 48,
//                     boxShadow: "0 4px 6px rgba(59, 130, 246, 0.3)",
//                   }}
//                 >
//                   <BarChart sx={{ fontSize: 28 }} />
//                 </Avatar>
//                 <Box>
//                   <Typography variant="h4" sx={{ fontWeight: 700, color: "#1f2937", mb: 0.5 }}>
//                     Expense Dashboard
//                   </Typography>
//                   <Typography variant="body1" sx={{ color: "#6b7280" }}>
//                     View and manage expense
//                   </Typography>
//                 </Box>
//               </Box>
//             </Grid>
//           </Grid>
//         </Paper>

//         {/* Stat Cards */}
//         <Grid container spacing={2} sx={{ mb: 3 }}>
//           {expenseStats.map((stat, index) => {
//             const Icon = stat.icon;
//             return (
//               <Grid item xs={12} sm={6} md={3} key={index}>
//                 <Card
//                   sx={{
//                     backgroundColor: stat.bgColor,
//                     border: `1px solid ${stat.borderColor}`,
//                     borderRadius: 3,
//                     boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//                   }}
//                 >
//                   <CardContent sx={{ p: 3 }}>
//                     <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                       <Box
//                         sx={{
//                           p: 1.5,
//                           borderRadius: 2,
//                           backgroundColor: "rgba(255, 255, 255, 0.7)",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                         }}
//                       >
//                         <Icon sx={{ color: stat.iconColor, fontSize: 28 }} />
//                       </Box>
//                       <Box>
//                         <Typography variant="body2" color="text.secondary" fontWeight={500}>
//                           {stat.title}
//                         </Typography>
//                         <Typography variant="h5" fontWeight={700} color="#1f2937">
//                           {stat.title === "Total Expenses" ? `₹ ${stat.value}` : stat.value}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             );
//           })}
//         </Grid>

//         {/* Recent Expenses & Pending Approvals */}
//         <Grid container spacing={3} sx={{ mb: 4 }}>
//           <Grid item xs={12} md={6}>
//             <Paper sx={{ p: 3, borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
//               <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
//                 Recent Expenses
//               </Typography>
//               <Typography variant="body2" sx={{ color: "#6b7280", mb: 2 }}>
//                 Latest expense submissions
//               </Typography>
//               {recent.map((expense, idx) => (
//                 <Box key={idx} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                     <Avatar sx={{ bgcolor: "#e0f2fe", color: "#0288d1" }}>
//                       <Description />
//                     </Avatar>
//                     <Box>
//                       <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
//                         {expense.expenseTypeId?.name || "N/A"}
//                       </Typography>
//                       <Typography variant="caption" sx={{ color: "#6b7280" }}>
//                         {expense.department || "General"}
//                       </Typography>
//                     </Box>
//                   </Box>
//                   <Box textAlign="right">
//                     <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
//                       ₹{expense.approvedAmount?.toLocaleString("en-IN") || "0"}
//                     </Typography>
//                     <Chip
//                       label={expense.status?.toLowerCase() || "pending"}
//                       size="small"
//                       color={
//                         expense.status?.toLowerCase() === "approved"
//                           ? "success"
//                           : expense.status?.toLowerCase() === "rejected"
//                             ? "error"
//                             : "warning"
//                       }
//                       variant={expense.status?.toLowerCase() === "pending" ? "outlined" : "filled"}
//                       sx={{ textTransform: "capitalize", mt: 0.5 }}
//                     />
//                   </Box>
//                 </Box>
//               ))}

//             </Paper>
//           </Grid>

//           <Grid item xs={12} md={6}>
//             <Paper sx={{ p: 3, borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
//               <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
//                 Pending Approvals
//               </Typography>
//               <Typography variant="body2" sx={{ color: "#6b7280", mb: 2 }}>
//                 Items requiring your approval
//               </Typography>
//               {pending.map((item, idx) => {
//                 const createdDate = dayjs(item.createdAt);
//                 const today = dayjs();
//                 const pendingDays = today.diff(createdDate, "day");

//                 return (
//                   <Box
//                     key={idx}
//                     sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}
//                   >
//                     <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//                       <Avatar sx={{ bgcolor: "#fff7ed", color: "#fb923c" }}>
//                         <AccessTime />
//                       </Avatar>
//                       <Box>
//                         <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
//                           {item.expenseTypeId?.name || "N/A"}
//                         </Typography>
//                         <Typography variant="caption" sx={{ color: "#6b7280" }}>
//                           by {item.submittedBy?.employeName || "Unknown"}
//                         </Typography>
//                       </Box>
//                     </Box>
//                     <Box textAlign="right">
//                       <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
//                         ₹{item.approvedAmount?.toLocaleString("en-IN") || "0"}
//                       </Typography>
//                       <Typography variant="caption" sx={{ color: "#fb923c" }}>
//                         {pendingDays}d pending
//                       </Typography>
//                     </Box>
//                   </Box>
//                 );
//               })}

//             </Paper>
//           </Grid>
//         </Grid>

//       </Box>
//       {/* Error Snackbar */}
//       <Snackbar
//         open={!!error}
//         autoHideDuration={6000}
//         onClose={() => setError(null)}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         <Alert
//           onClose={() => setError(null)}
//           severity="error"
//           sx={{
//             width: "100%",
//             borderRadius: 2,
//             boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//             backgroundColor: "#fee2e2",
//             color: "#1f2937",
//           }}
//         >
//           {error}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// }

'use client'
import {
  AccessTime,
  BarChart,
  Cancel,
  CheckCircle,
  CreditCard,
  Description,
  Download as DownloadIcon,
  FilterList,
  GridView,
  LocationCity,
  Paid,
  Person,
  Search as SearchIcon,
  CalendarMonth,
  AccountBalance,
  HourglassEmpty as HourglassFull,
  ArrowBack,
  Settings,
  Dashboard as DashboardIcon,
  CurrencyRupee,
  MonetizationOnOutlined,
  ApprovalOutlined
} from '@mui/icons-material'
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Paper,
  InputAdornment,
  Snackbar,
  Alert,
  Chip,
  Avatar,
  Tabs,
  Tab,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material'
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarFilterButton
} from '@mui/x-data-grid'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApi } from '@core/hooks/useApi'
import { styled } from '@mui/material/styles'
import { DateRange } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import format from 'date-fns/format'
import { Activity, Clock, Calendar, Filter } from 'lucide-react'
import dayjs from 'dayjs'
// import Expense from '../../employeeSetup/NewExpensesDetails/Expense'
import ApproverScreen from '../approverScreen/page'
import Expense from '../../employeeSetup/NewExpensesDetails/Submitter/page'
// Styled components
const GradientBox = styled(Box)(({ theme }) => ({
  background: '#f8fafc',
  minHeight: '100vh',
  padding: theme.spacing(3)
}))

const TabsContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(0.5),
  marginBottom: theme.spacing(3)
}))

const StyledTab = styled(Tab)(({ theme }) => ({
  color: 'white',
  fontWeight: 500,
  minHeight: 48,
  textTransform: 'none',
  '&.Mui-selected': {
    backgroundColor: 'white',
    color: '#2196F3',
    borderRadius: theme.spacing(0.5)
  },
  '&:hover': {
    color: 'white',
    borderRadius: theme.spacing(1)
  },
  '&.MuiTab-root:hover': {
    color: '#0b0303'
  }
}))

// Wrapper for DateRange to avoid overflow conflicts
const DateRangeWrapper = styled(Box)({
  '& .rdrDateRangePickerWrapper': {
    overflowX: 'hidden',
    overflowY: 'auto'
  }
})

// Period Filter Component
const PeriodFilterDropdown = ({
  selectedPeriod,
  onPeriodChange,
  customStartDate,
  customEndDate,
  onCustomDateChange
}) => {
  const [customDialogOpen, setCustomDialogOpen] = useState(false)
  const [tempDateRange, setTempDateRange] = useState([
    {
      startDate: customStartDate || new Date(),
      endDate: customEndDate || new Date(),
      key: 'selection'
    }
  ])

  const periodOptions = [
    { value: 'all', label: 'All', icon: <Activity size={16} /> },
    { value: '1days', label: 'Today', icon: <Clock size={16} /> },
    { value: '7days', label: 'Last 7 Days', icon: <Calendar size={16} /> },
    { value: '30days', label: 'Last 30 Days', icon: <Calendar size={16} /> },
    { value: 'custom', label: 'Custom', icon: <Filter size={16} /> }
  ]

  const handlePeriodSelect = period => {
    if (period === 'custom') {
      setCustomDialogOpen(true)
    } else {
      onPeriodChange(period)
    }
  }

  const handleCustomDateApply = () => {
    const startDate = format(tempDateRange[0].startDate, 'yyyy-MM-dd')
    const endDate = format(tempDateRange[0].endDate, 'yyyy-MM-dd')

    onCustomDateChange(tempDateRange[0].startDate, tempDateRange[0].endDate)
    onPeriodChange('custom', startDate, endDate)
    setCustomDialogOpen(false)
  }

  return (
    <>
      <FormControl size='small' sx={{ minWidth: 180 }}>
        <InputLabel>Time Period</InputLabel>
        <Select
          value={selectedPeriod}
          label='Time Period'
          onChange={e => handlePeriodSelect(e.target.value)}
          sx={{
            borderRadius: 2,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(99, 102, 241, 0.3)'
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(99, 102, 241, 0.5)'
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#6366f1'
            }
          }}
        >
          {periodOptions.map(option => (
            <MenuItem key={option.value} value={option.value}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {option.icon}
                <Typography>{option.label}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Dialog open={customDialogOpen} onClose={() => setCustomDialogOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Calendar size={20} />
            Select Custom Date Range
          </Box>
        </DialogTitle>
        <DialogContent>
          <DateRangeWrapper>
            <DateRange
              editableDateInputs={true}
              onChange={item => setTempDateRange([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={tempDateRange}
              maxDate={new Date()}
              showSelectionPreview={true}
              showDateDisplay={false}
            />
          </DateRangeWrapper>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button onClick={() => setCustomDialogOpen(false)} variant='outlined' sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            onClick={handleCustomDateApply}
            variant='contained'
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)'
            }}
          >
            Apply Range
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

// Tab Panel Component
function TabPanel({ children, value, index }) {
  return (
    <div role='tabpanel' hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

export default function Dashboard() {
  const { callApi } = useApi()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(50)
  const [rows, setRows] = useState([])
  const [columns, setColumns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [recent, setRecent] = useState([])
  const [pending, setPending] = useState([])
  const [expenseStats, setExpenseStats] = useState([])
  const [activeTab, setActiveTab] = useState(0)
  const [selectedPeriod, setSelectedPeriod] = useState('all')
  const [customStartDate, setCustomStartDate] = useState(null)
  const [customEndDate, setCustomEndDate] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        let endpoint = '/v1/api/expenseSubmission/dashBoard?page=1&limit=10'
        if (selectedPeriod === 'custom' && customStartDate && customEndDate) {
          const startDate = format(customStartDate, 'yyyy-MM-dd')
          const endDate = format(customEndDate, 'yyyy-MM-dd')
          endpoint += `&period=${selectedPeriod}&startDate=${startDate}&endDate=${endDate}`
        } else {
          endpoint += `&period=${selectedPeriod}`
        }

        const res = await callApi({
          endpoint,
          method: 'GET',
          auth: true,
          disableSnackbar: true
        })

        const data = res?.data
        if (!data?.status || !data?.items) {
          throw new Error('Invalid response format')
        }

        const {
          totalExpenses = 0,
          pendingApprovals = 0,
          approvedCount = 0,
          rejectedCount = 0,
          recentExpenses = {},
          pendingApprovalsList = {}
        } = data.items

        setExpenseStats([
          {
            title: 'Total Expenses',
            icon: CreditCard,
            value: totalExpenses.toString(),
            bgColor: '#e3f2fd',
            borderColor: '#90caf9',
            iconColor: '#1976d2'
          },
          {
            title: 'Pending Review',
            icon: AccessTime,
            value: pendingApprovals.toString(),
            bgColor: '#fff3e0',
            borderColor: '#ffb74d',
            iconColor: '#ef6c00'
          },
          {
            title: 'Approved',
            icon: CheckCircle,
            value: approvedCount.toString(),
            bgColor: '#e8f5e9',
            borderColor: '#81c784',
            iconColor: '#2e7d32'
          },
          {
            title: 'Rejected',
            icon: Cancel,
            value: rejectedCount.toString(),
            bgColor: '#ffebee',
            borderColor: '#ef9a9a',
            iconColor: '#d32f2f'
          }
        ])

        const recent = Object.values(recentExpenses).filter(item => typeof item === 'object' && item.submissionId)
        const pending = Object.values(pendingApprovalsList).filter(
          item => typeof item === 'object' && item.submissionId
        )

        setRecent(recent)
        setPending(pending)
      } catch (err) {
        console.error('Dashboard API Error:', err)
        setError('Failed to load dashboard data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [selectedPeriod, customStartDate, customEndDate])

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handlePeriodChange = (period, customStart = null, customEnd = null) => {
    setSelectedPeriod(period)
    if (period === 'custom' && customStart && customEnd) {
      setCustomStartDate(customStart)
      setCustomEndDate(customEnd)
    }
  }

  const handleCustomDateChange = (startDate, endDate) => {
    setCustomStartDate(startDate)
    setCustomEndDate(endDate)
  }

  const ExpenseContent = () => (
    <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
      {/* <Paper sx={{ p: 4, mb: 3, borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <Grid container spacing={3} alignItems='center'>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar
                sx={{
                  backgroundColor: '#3b82f6',
                  width: 48,
                  height: 48,
                  boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)'
                }}
              >
                <BarChart sx={{ fontSize: 28 }} />
              </Avatar>
              <Box>
                <Typography variant='h4' sx={{ fontWeight: 700, color: '#1f2937', mb: 0.5 }}>
                  Expense Dashboard
                </Typography>
                <Typography variant='body1' sx={{ color: '#6b7280' }}>
                  View and manage expense
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper> */}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {expenseStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  backgroundColor: stat.bgColor,
                  border: `1px solid ${stat.borderColor}`,
                  borderRadius: 3,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Icon sx={{ color: stat.iconColor, fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography variant='body2' color='text.secondary' fontWeight={500}>
                        {stat.title}
                      </Typography>
                      <Typography variant='h5' fontWeight={700} color='#1f2937'>
                        {stat.title === 'Total Expenses' ? `₹ ${stat.value}` : stat.value}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <Typography variant='h6' sx={{ fontWeight: 700, mb: 0.5 }}>
              Recent Expenses
            </Typography>
            <Typography variant='body2' sx={{ color: '#6b7280', mb: 2 }}>
              Latest expense submissions
            </Typography>
            {recent.map((expense, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: '#e0f2fe', color: '#0288d1' }}>
                    <Description />
                  </Avatar>
                  <Box>
                    <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
                      {expense.expenseTypeId?.name || 'N/A'}
                    </Typography>
                    <Typography variant='caption' sx={{ color: '#6b7280' }}>
                      {expense.department || 'General'}
                    </Typography>
                  </Box>
                </Box>
                <Box textAlign='right'>
                  <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
                    ₹{expense.approvedAmount?.toLocaleString('en-IN') || '0'}
                  </Typography>
                  <Chip
                    label={expense.status?.toLowerCase() || 'pending'}
                    size='small'
                    color={
                      expense.status?.toLowerCase() === 'approved'
                        ? 'success'
                        : expense.status?.toLowerCase() === 'rejected'
                          ? 'error'
                          : 'warning'
                    }
                    variant={expense.status?.toLowerCase() === 'pending' ? 'outlined' : 'filled'}
                    sx={{ textTransform: 'capitalize', mt: 0.5 }}
                  />
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <Typography variant='h6' sx={{ fontWeight: 700, mb: 0.5 }}>
              Pending Approvals
            </Typography>
            <Typography variant='body2' sx={{ color: '#6b7280', mb: 2 }}>
              Items requiring your approval
            </Typography>
            {pending.map((item, idx) => {
              const createdDate = dayjs(item.createdAt)
              const today = dayjs()
              const pendingDays = today.diff(createdDate, 'day')

              return (
                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#fff7ed', color: '#fb923c' }}>
                      <AccessTime />
                    </Avatar>
                    <Box>
                      <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
                        {item.expenseTypeId?.name || 'N/A'}
                      </Typography>
                      <Typography variant='caption' sx={{ color: '#6b7280' }}>
                        by {item.submittedBy?.employeName || 'Unknown'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box textAlign='right'>
                    <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
                      ₹{item.approvedAmount?.toLocaleString('en-IN') || '0'}
                    </Typography>
                    <Typography variant='caption' sx={{ color: '#fb923c' }}>
                      {pendingDays}d pending
                    </Typography>
                  </Box>
                </Box>
              )
            })}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )

  const Subbmitercontent = () => (
    <Box sx={{ mt: 2 }}>
      <Expense />
    </Box>
  )

  const AprroveContent = () => (
    <Box sx={{ mt: 2 }}>
      <ApproverScreen />
    </Box>
  )

  return (
    <GradientBox>
      <Container maxWidth='xl'>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography
              variant='h4'
              fontWeight='bold'
              sx={{
                background: 'linear-gradient(90deg, #1976d2 0%, #9c27b0 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              ✨ Expense Analytics
            </Typography>

            <PeriodFilterDropdown
              selectedPeriod={selectedPeriod}
              onPeriodChange={handlePeriodChange}
              customStartDate={customStartDate}
              customEndDate={customEndDate}
              onCustomDateChange={handleCustomDateChange}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BarChart fontSize='small' color='primary' />
            <Typography variant='body1' color='text.secondary'>
              Monitor and track your expense performance
            </Typography>
            {selectedPeriod === 'custom' && customStartDate && customEndDate && (
              <Chip
                label={`${format(customStartDate, 'MMM dd')} - ${format(customEndDate, 'MMM dd, yyyy')}`}
                size='small'
                sx={{
                  bgcolor: '#f3e5f5',
                  color: '#7b1fa2',
                  border: '1px solid #ce93d8'
                }}
              />
            )}
            <Chip
              label='Live'
              size='small'
              sx={{
                bgcolor: '#E3F2FD',
                color: '#1976D2',
                border: '1px solid #BBDEFB',
                '& .MuiChip-label': {
                  display: 'flex',
                  alignItems: 'center',
                  '&::before': {
                    content: '""',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#2196F3',
                    marginRight: 0.5,
                    animation: 'pulse 2s infinite'
                  }
                }
              }}
            />
          </Box>
        </Box>

        <TabsContainer>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant='fullWidth'
            TabIndicatorProps={{ style: { display: 'none' } }}
          >
            <StyledTab icon={<DashboardIcon size={16} />} label='Dashboard' iconPosition='start' />
            <StyledTab icon={<MonetizationOnOutlined size={16} />} label='Submitter' iconPosition='start' />
            <StyledTab icon={<ApprovalOutlined size={16} />} label='Approver' iconPosition='start' />
          </Tabs>
        </TabsContainer>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading dashboard...</Typography>
          </Box>
        ) : error ? (
          <Alert severity='error' sx={{ mt: 4 }}>
            {error}
            <Button onClick={() => fetchDashboardData()} sx={{ ml: 2 }} variant='contained' size='small'>
              Retry
            </Button>
          </Alert>
        ) : (
          <>
            <TabPanel value={activeTab} index={0}>
              <ExpenseContent />
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <Subbmitercontent />
            </TabPanel>
            <TabPanel value={activeTab} index={2}>
              <AprroveContent />
            </TabPanel>
          </>
        )}

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setError(null)}
            severity='error'
            sx={{
              width: '100%',
              borderRadius: 2,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#fee2e2',
              color: '#1f2937'
            }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </GradientBox>
  )
}
