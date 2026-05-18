'use client'

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
  Radio,
  RadioGroup,
  FormControlLabel,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
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
  List,
  CalendarClock,
  CheckCircle2,
  BadgeCheck,
  Presentation
} from "lucide-react"
import { DateRange } from "react-date-range"
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import format from "date-fns/format"
import React, { useEffect, useRef, useState } from 'react'
import { styled, keyframes } from "@mui/material/styles"
import Reporting from "./Reporting/page"
import CalenderView from "./Calender/page"
import axios from "axios"
import { CalendarToday, MeetingRoom, NordicWalking, Person, Phone, Psychology, Refresh, Toys } from "@mui/icons-material"
import { useAuth } from "@/context/AuthContext"
import { useApi } from "@/@core/hooks/useApi"

const GradientBox = styled(Box)(({ theme }) => ({
    backgroundColor: "#f8fafc",
    overflow:'auto',
    padding : 15
  }))

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


export default function InterviewMonitor() {
  const [selectedPeriod, setSelectedPeriod] = useState("all")
  const [customStartDate, setCustomStartDate] = useState(null)
  const [customEndDate, setCustomEndDate] = useState(null)
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [allCandidates, setAllCandidates] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(100)
  const [totalItems, setTotalItems] = useState(0)
  const [filter, setFilter] = useState('all');
  const { userData } = useAuth();
  const anchorRef = useRef(null)
  const [filters, setFilters] = useState({
    interviewType: '',
    interviewModel: ''
  })
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const [dashboardFilters, setDashboardFilters] = useState({
    startDate: firstDayOfMonth,
    endDate: lastDayOfMonth
  });
  const [userAccess, setUserAccess] = useState("first")
  const { callApi } = useApi();


  const clearAllFilters = () => {
    setFilters({
      interviewType: '',
      interviewModel: ''
    })
  }

  const formatDateToYYYYMMDD = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date)) return '';
    return date.toISOString().split('T')[0];
  };


  const [open, setOpen] = useState(false)
  const handleClickAway = () => {
    setOpen(false)
  }

  const handleRangeChange = (item) => {
    const { startDate, endDate } = item.selection;

    setDashboardFilters(prev => ({
      ...prev,
      startDate: startDate || "",
      endDate: endDate || "",
    }));

    if (startDate && endDate && startDate.getTime() !== endDate.getTime()) {
      setOpen(false);
    }
  };

  const [dashboardData, setDashboardData] = useState({})

  const getDashboardData = async () => {
    const roleId = userData.roleId;
    try {
      const result = await callApi({
        endpoint: `/v1/api/interview/candidateLastReview?status=${filter === "schedule" ? "reSchedule,schedule" : filter}${dashboardFilters?.startDate ? `&startDate=${dashboardFilters?.startDate}` : ''}${dashboardFilters?.endDate ? `&endDate=${dashboardFilters?.endDate}` : ''}`,
        method: "GET",
        disableSnackbar: true,
      })
      if (result.success && result.data.items) {
        setDashboardData(result.data.items)
      } else {
        setError("Failed to fetch permissions")
        console.error("API Error:", result.message)
      }
    } catch (err) {
      console.error("Error fetching role permissions:", err)
    }
  }
  const [permissions, setPermissions] = useState([])

  const fetchRolePermissions = async () => {
    const roleId = userData.roleId;

    try {
      const result = await callApi({
        endpoint: `/v1/api/role/detail?roleId=${roleId}`,
        method: "GET",
        disableSnackbar: true,
      })
      if (result.success && result.data.items) {
        setPermissions(result.data.items)
      } else {
        setError("Failed to fetch permissions")
        console.error("API Error:", result.message)
      }
    } catch (err) {
      console.error("Error fetching role permissions:", err)
    }
  }

  // Fetch role permissions on mount
  useEffect(() => {
    fetchRolePermissions()
  }, [])

  useEffect(() => {
    getDashboardData()
  }, [dashboardFilters, filter])

  useEffect(() => {
    if (permissions?.InterviewManagement?.interviewCanViewAll) {
      setUserAccess("all");
    } else {
      setUserAccess("");
    }
  }, [permissions]);

  const [mode, setMode] = useState("list")

  const getAllScheduledCanidates = async () => {
    const startDate = formatDateToYYYYMMDD(dashboardFilters?.startDate);
    const endDate = formatDateToYYYYMMDD(dashboardFilters?.endDate);

    try {
      const res = await axios.get(`${baseUrl}/v1/api/interview/getScheduledInterviews?limit=${rowsPerPage}&page=${page + 1}&interviewType=${filters?.interviewType}&interviewModel=${filters?.interviewModel}&allDataShow=${userAccess}&status=${filter === "all" ? '' : filter}${startDate ? `&startDate=${startDate}` : ''
        }${endDate ? `&endDate=${endDate}` : ''}`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      });
      setAllCandidates(res.data.items.interviews)
      setTotalItems(res.data.items.totalRecords)
    } catch (error) {
      console.error('Error fetching ID setup:', error);
    }
  }

  useEffect(() => {
    if (userAccess !== "first") {
      getAllScheduledCanidates()
    }
  }, [page, rowsPerPage, filters, filter, userAccess, dashboardFilters])

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
          labelRowsPerPage="Interviews per page:"
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

  return (
    <GradientBox maxWidth="xl">
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Stack direction={"row"} sx={{ display: 'flex', alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              background: 'linear-gradient(45deg, #4E36FF 30%, #9C27B0 90%)',
              width: 38,
              height: 38,
              color: '#fff',
              boxShadow: 3,
              border: '2px solid white',
            }}
          >
            <Presentation size={20} />
          </Avatar>

          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              background: 'linear-gradient(45deg, #4E36FF 30%, #9C27B0 90%)',
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Interview Monitor
          </Typography>
        </Stack>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <ClickAwayListener onClickAway={handleClickAway}>
            <Box>
              <TextField
                label="Interview Date"
                inputRef={anchorRef}
                value={
                  dashboardFilters.startDate && dashboardFilters.endDate
                    ? `${format(dashboardFilters.startDate, "dd/MM/yyyy")} - ${format(dashboardFilters.endDate, "dd/MM/yyyy")}`
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
                        startDate: dashboardFilters.startDate || new Date(),
                        endDate: dashboardFilters.endDate || new Date(),
                        key: "selection",
                      },
                    ]}
                  />
                </Box>
              </Popper>
            </Box>
          </ClickAwayListener>
          <FormControl component="fieldset">
            <RadioGroup
              row
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {['all', 'complete', 'schedule'].map((val) => (
                <FormControlLabel
                  key={val}
                  value={val}
                  control={<Radio sx={{
                    color: '#4E36FF',
                    '&.Mui-checked': {
                      color: '#4E36FF',
                    },
                  }} />}
                  label={
                    val === 'all'
                      ? 'All'
                      : val === "schedule" ? "Scheduled" : val.charAt(0).toUpperCase() + val.slice(1)
                  }
                  sx={{
                    marginRight: 2,
                    borderRadius: '8px',
                    color: '#4E36FF',
                    fontWeight: 600,

                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>

          <IconButton onClick={() => mode === 'list' ? setMode('calender') : setMode('list')}>
            {mode === 'list' ? <List /> : <Calendar />}
          </IconButton>
        </Box>
      </Box>
      <Grid container spacing={3} sx={{ my: 2 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title="Total Interviews"
            value={dashboardData?.dashboardCounts?.totalInterviews || 0}
            subtitle="Combined Scheduled & Completed"
            icon={Users}
            bgcolor="#e0f2fe"
            textColor="#0277bd"
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title="Scheduled Interviews"
            value={dashboardData?.dashboardCounts?.scheduledInterviews || 0}
            subtitle="Upcoming Interviews"
            icon={CalendarClock}
            bgcolor="#f3e5f5" 
            textColor="#7b1fa2"
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title="Completed Interviews"
            value={dashboardData?.dashboardCounts?.completedInterviews || 0}
            subtitle="Successfully Concluded"
            icon={CheckCircle2}
            bgcolor="#e8f5e9"
            textColor="#2e7d32"
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard
            title="Candidates Interviewed"
            value={dashboardData?.totalCandidates || 0}
            subtitle="Unique Candidates"
            icon={BadgeCheck}
            bgcolor="#fff3e0"
            textColor="#f57c00"
          />
        </Grid>
      </Grid>
      <Paper sx={{ mt: 3 }}>
        <Grid container spacing={3} sx={{ alignItems: "center", mt: 2, p: 3 }}>

          <Grid item xs={12} md={2.25}>
            <TextField
              fullWidth
              select
              label="Interview Type"
              size="small"
              value={filters.interviewType}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  interviewType: e.target.value,
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
              <MenuItem value="Call">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Phone fontSize="small" sx={{ color: "#ff9800" }} />
                  Call
                </Box>
              </MenuItem>
              <MenuItem value="Walk-In">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <NordicWalking fontSize="small" sx={{ color: "#4CAF50" }} />
                  Face to Face
                </Box>
              </MenuItem>
              <MenuItem value="Online">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <MeetingRoom fontSize="small" sx={{ color: "#f44336" }} />
                  Online
                </Box>
              </MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} md={2.25}>
            <TextField
              fullWidth
              select
              label="Interview Mode"
              size="small"
              value={filters.interviewModel}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  interviewModel: e.target.value,
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
              <MenuItem value="HUMAN">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Person fontSize="small" sx={{ color: "#ff9800" }} />
                  Human
                </Box>
              </MenuItem>
              <MenuItem value="AI">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Toys fontSize="small" sx={{ color: "#4CAF50" }} />
                  Ai
                </Box>
              </MenuItem>

            </TextField>
          </Grid>

          <Grid item xs={12} md={0.9} sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={clearAllFilters}
              sx={{
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
            <Typography fontSize={14} fontWeight={600} color="primary" ml={2}>
              Reset
            </Typography>
          </Grid>
        </Grid>


        {mode === 'list' ?
          <Reporting
            allCandidates={allCandidates}
          /> : <CalenderView
            allCandidates={allCandidates}
          />}
        <PaginationComponent
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[100, 200, totalItems]}
          count={totalItems}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Paper>
    </GradientBox>
  )
}
