'use client'

import { useState, useEffect, useRef } from 'react'
import { format } from 'date-fns';
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
  Stack,
  CircularProgress,
  TablePagination,
  MenuItem,
  Select,
  InputAdornment,
  Popper,
  ClickAwayListener,
  FormControl,
  InputLabel,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  DialogActions,
  TextField
} from '@mui/material'
import { DateRange } from 'react-date-range'
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector
} from '@mui/x-data-grid'
import axios from 'axios'

import { Category, PresentToAll, Refresh, ResetTv, Search, WhatsApp } from '@mui/icons-material'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import ViewComfyIcon from '@mui/icons-material/ViewComfy'
import DownloadIcon from '@mui/icons-material/Download'
import { Person, CalendarToday } from "@mui/icons-material"
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { styled } from '@mui/material/styles'

import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Briefcase,
  Eye,
  Activity,
  Calendar,
  Filter,
  LayoutDashboard, // ✅ Correct icon
  AlignCenter
} from 'lucide-react'
import {
  PlayArrow,
  VolumeUp,
  MoreVert,
  Phone,
  PhoneCallback,
  PhoneMissed,
  PhoneDisabled,
  Call
} from '@mui/icons-material'


const GradientBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#f8fafc',
  minHeight: '100vh',
  padding: theme.spacing(3)
}))

function CustomToolbar() {
  return (
    <GridToolbarContainer
      sx={{
        p: 1,
        display: 'flex',
        gap: 1,
        backgroundColor: '#ffffff',
        borderRadius: '8px 8px 0 0'
      }}
    >
      <GridToolbarColumnsButton
        startIcon={<ViewColumnIcon sx={{ fontSize: 16 }} />}
        sx={{
          backgroundColor: 'black',
          color: 'black',
          fontSize: '0.8rem',
          padding: '4px 8px',
          '&:hover': { backgroundColor: 'black' }
        }}
      />
      <GridToolbarDensitySelector
        startIcon={<ViewComfyIcon sx={{ fontSize: 16 }} />}
        sx={{
          backgroundColor: '#f0f0ff',
          color: '#6366f1',
          fontSize: '0.8rem',
          padding: '4px 8px',
          '&:hover': { backgroundColor: '#e0e0ff' }
        }}
      />
      <GridToolbarExport
        startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
        sx={{
          backgroundColor: '#f0f0ff',
          color: '#6366f1',
          fontSize: '0.8rem',
          padding: '4px 8px',
          '&:hover': { backgroundColor: '#e0e0ff' }
        }}
        csvOptions={{
          fileName: 'exported-data',
          delimiter: ',',
          utf8WithBom: true
        }}
      />
    </GridToolbarContainer>
  )
}
const columns = [
  { field: 'uniqueId', headerName: 'Unique ID', width: 140 },
  { field: 'callerId', headerName: 'Caller ID', width: 130 },
  { field: 'receiverId', headerName: 'Receiver ID', width: 130 },
  { field: 'ivrNumber', headerName: 'IVR Number', width: 130 },
  { field: 'callType', headerName: 'Call Type', width: 120 },
  {
    field: 'callStatus',
    headerName: 'Status',
    width: 180,
    renderCell: params => {
      const value = params.value
      let label = value
      let bgColor = '#fff3e0'
      let color = '#e65100'

      if (value === 'agent_no_answer') {
        label = "Agent didn't Answer"
        bgColor = '#ffebee'
        color = '#d32f2f'
      } else if (value === 'caller_no_answer') {
        label = "Caller didn't Answer"
        bgColor = '#fffde7'
        color = '#f9a825'
      } else if (value === 'Answered') {
        label = 'Answered'
        bgColor = '#e8f5e9'
        color = '#2e7d32'
      }

      return (
        <Chip
          label={label}
          size='small'
          sx={{ bgcolor: bgColor, color: color }}
        />
      )
    }
  },
  { field: 'candidateName', headerName: 'Candidate', width: 160 },
  { field: 'candidateEmail', headerName: 'Candidate Email', width: 200 },
  { field: 'interviewerName', headerName: 'Interviewer', width: 160 },
  { field: 'interviewerEmail', headerName: 'Interviewer Email', width: 200 },
  { field: 'date', headerName: 'Date', width: 120 },
  { field: 'time', headerName: 'Time', width: 120 },
  { field: 'duration', headerName: 'Duration', width: 120 },
  {
    field: 'recording',
    headerName: 'Recording',
    width: 250,
    renderCell: params =>
      params.value ? (
        <audio controls src={params.value} style={{ width: '100%' }} />
      ) : (
        <Typography variant='body2' color='text.secondary'>-</Typography>
      )
  }
]


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
  '&.Mui-selected': {
    backgroundColor: 'white',
    color: '#2196F3',
    borderRadius: theme.spacing(1)
  },
  '&:hover': {
    color: 'white',
    borderRadius: theme.spacing(1)
  },
  '&.MuiTab-root:hover': {
    color: '#0b0303'
  }
}))

function TabPanel({ children, value, index }) {
  return (
    <div role='tabpanel' hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

function MetricCard({ title, value, subtitle, icon: Icon, bgcolor, textColor, onClick }) {
  return (
    <Card
      sx={{
        bgcolor,
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: 2,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        '&:hover': onClick
          ? {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }
          : {}
      }}
    >
      <CardContent sx={{ p: 3 }} onClick={onClick}>
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <Box>
            <Typography variant='body2' sx={{ color: 'text.secondary', fontWeight: 500, mb: 1 }}>
              {title}
            </Typography>
            <Typography variant='h3' sx={{ fontWeight: 'bold', color: textColor || 'text.primary', mb: 0.5 }}>
              {value}
            </Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              {subtitle}
            </Typography>
          </Box>
          <Avatar sx={{ width: 40, height: 40, bgcolor: 'rgba(0,0,0,0.04)' }}>
            <Icon size={20} color={textColor || '#666'} />
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default function TelePhonicDashboard() {
  const [rows, setRows] = useState([])
  const getSeconds = timeStr => {
    const [hh, mm, ss] = timeStr.split(':').map(Number)
    return hh * 3600 + mm * 60 + ss
  }
  const anchorRef = useRef(null)
  const [tabValue, setTabValue] = useState(0)
  const [searchText, setSearchText] = useState('')
  const [dateFilter, setDateFilter] = useState({
    startDate:'',
    endDate:''
  })
  const [open, setOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
  const [interviewerFilter,setInterviewerFilter] = useState('')
  const [candidateFilter, setCandidateFilter] = useState('')
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  // const [candidate,setCandidate]=useState([])
  // const [interview,setInterView] = useState([])

//   const filteredRows = rows.filter(row => {
//     const matchesSearch = row.callerId.includes(searchText) || row.agent.includes(searchText)
//     const matchesDuration =
//       durationFilter === ''
//         ? true
//         : durationFilter === 'short'
//           ? getSeconds(row.duration) < 30
//           : getSeconds(row.duration) >= 30
//     const matchesStatus = statusFilter === '' ? true : row.status.toLowerCase().includes(statusFilter.toLowerCase())

//     return matchesSearch && matchesDuration && matchesStatus
//   })

function useDebounce(value, delay = 1000) {
    const [debouncedValue, setDebouncedValue] = useState(value)
  
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)
  
      return () => clearTimeout(handler)
    }, [value, delay])
  
    return debouncedValue
  }

  const [isLoading, setIsLoading] = useState(false)

  const clearAllFilters = () => {
   setDateFilter({
    startDate:'',
    endDate:''
   })
   setStatusFilter("")
   setSearchText("")
   setInterviewerFilter('')
   setCandidateFilter('')
  }

  // const getAllCallLog = async () => {
  //   try {
  //     setIsLoading(true)
  //     const response = await axios.get(`${baseUrl}/v1/api/airphone/callLog`, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         authorization: token
  //       }
  //     })

  //     const logs = response.data?.items?.callLogs || []

  //     const mappedRows = logs.map(log => ({
  //       id: log._id,
  //       contact: log.ivr_number,
  //       callerId: log.caller_id,
  //       received_id:log.received_id,
  //       agent: log.received_id,
  //       status: log.call_status,
  //       date: log.datetime?.split(' ')[0],
  //       time: log.datetime?.split(' ')[1],
  //       duration: log.duration,
  //       recording: log.recording_url
  //     }))

  //     setRows(mappedRows)
  //   } catch (error) {
  //     console.error('Fetch error:', error)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  // useEffect(() => {
  //   getAllCallLog()
  // }, [])

  const [dashboardStats, setDashboardStats] = useState({
    totalCalls: 0,
    agentAnswered: 0,
    callerNoAnswer: 0,
    agentNoAnswer: 0,
    callMissed: 0
  })

  const debouncedSearch = useDebounce(searchText, 1000)  

  
  const columns = [
    { field: 'uniqueId', headerName: 'Unique ID', width: 140 },
    { field: 'callerId', headerName: 'Caller ID', width: 130 },
    { field: 'receiverId', headerName: 'Receiver ID', width: 130 },
    { field: 'ivrNumber', headerName: 'IVR Number', width: 130 },
    { field: 'callType', headerName: 'Call Type', width: 120 },
    {
      field: 'callStatus',
      headerName: 'Status',
      width: 180,
      renderCell: params => {
        const value = params.value
        let label = value
        let bgColor = '#fff3e0'
        let color = '#e65100'
  
        if (value === 'agent_no_answer') {
          label = "Agent didn't Answer"
          bgColor = '#ffebee'
          color = '#d32f2f'
        } else if (value === 'caller_no_answer') {
          label = "Caller didn't Answer"
          bgColor = '#fffde7'
          color = '#f9a825'
        } else if (value === 'Answered') {
          label = 'Answered'
          bgColor = '#e8f5e9'
          color = '#2e7d32'
        }
  
        return (
          <Chip
            label={label}
            size='small'
            sx={{ bgcolor: bgColor, color: color }}
          />
        )
      }
    },
    { field: 'candidateName', headerName: 'Candidate', width: 160 },
    { field: 'candidateEmail', headerName: 'Candidate Email', width: 200 },
    { field: 'interviewerName', headerName: 'Interviewer', width: 160 },
    { field: 'interviewerEmail', headerName: 'Interviewer Email', width: 200 },
    { field: 'date', headerName: 'Date', width: 120 },
    { field: 'time', headerName: 'Time', width: 120 },
    { field: 'duration', headerName: 'Duration', width: 120 },
    {
      field: 'recording',
      headerName: 'Recording',
      width: 250,
      renderCell: params =>
        params.value ? (
          <audio controls src={params.value} style={{ width: '100%' }} />
        ) : (
          <Typography variant='body2' color='text.secondary'>-</Typography>
        )
    }
  ]
  
  const getDashboardCallData = async () => {
    try {
      setIsLoading(true)
  
      const res = await axios.get(`${baseUrl}/v1/api/interview/DashBoard`, {
        headers: { authorization: token },
        params: {
          status: statusFilter,
          search: debouncedSearch,
          startDate: dateFilter.startDate,
          endDate: dateFilter.endDate,
          interviewer:interviewerFilter,
          candidate:candidateFilter
        }
      })
  
      const data = res.data?.items || {}
  
      setDashboardStats({
        totalCalls: data.totalCalls || 0,
        agentAnswered: data.agentAnswered || 0,
        callerNoAnswer: data.callerNoAnswer || 0,
        agentNoAnswer: data.agentNoAnswer || 0,
        callMissed: data.callMissed || 0
      })
  
      const mappedRows = (data.logs || []).map(log => ({
        id: log._id,
        uniqueId: log.unique_id,
        callerId: log.caller_id,
        receiverId: log.received_id,
        ivrNumber: log.ivr_number,
        callType: log.call_type,
        callStatus: log.call_status,
        date: log.datetime?.split(' ')[0],
        time: log.datetime?.split(' ')[1],
        duration: log.duration || log.Rec_duration,
        recording: log.recording_url,
        candidateName: log.candidate?.name || 'N/A',
        candidateId: log.candidate?._id || 'N/A',
        interviewerId: log.interviewer?._id || 'N/A',
        candidateEmail: log.candidate?.email || '-',
        interviewerName: log.interviewer?.userName || log.received_id || 'N/A',
        interviewerEmail: log.interviewer?.email || '-'
      }))
  
      setRows(mappedRows)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }
  

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleRangeChange = (item) => {
    setDateFilter({
      startDate: format(item.selection.startDate, 'yyyy/MM/dd'),
      endDate: format(item.selection.endDate, 'yyyy/MM/dd'),
    });
    setOpen(false);
  };

  const handleClickAway = () => {
    setOpen(false)
  }
//   const [agentAll, setAgentAll] = useState([])
 
// const getAgentAll = async () => {
// try {
// const response = await axios.get(`${baseUrl}/v1/api/airphone/saved-agents`, {
// headers: {
// 'Content-Type': 'application/json',
// authorization: token
// }
// })
 
// const agents = response.data?.items // ✅ FIXED HERE
// setAgentAll(Array.isArray(agents) ? agents : [])
// } catch (error) {
// console.error('Fetch error:', error)
// }
// }
useEffect(() => {
  getDashboardCallData()
}, [statusFilter, debouncedSearch, dateFilter, interviewerFilter, candidateFilter])
// useEffect(() => {
//   getAgentAll()
// }, [])

  return (
    <GradientBox>
      <Container maxWidth='xl'>
        <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ mb: 4 }}>
          <Stack direction='row' alignItems='center' spacing={2}>
            <Stack direction='row' alignItems='center' spacing={1}>
              <Avatar sx={{ bgcolor: 'linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)', width: 32, height: 32 }}>
                <Users size={20} />
              </Avatar>
              <Typography
                variant='h3'
                sx={{
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Call Logs Dashboard
                </Typography>
            </Stack>
            <Chip
              label='Live'
              size='small'
              sx={{ bgcolor: '#E3F2FD', color: '#1976D2', border: '1px solid #BBDEFB' }}
            />
          </Stack>
        </Stack>

        <TabsContainer>
          {/* <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant='fullWidth'
            TabIndicatorProps={{ style: { display: 'none' } }}
          >
            <StyledTab icon={<LayoutDashboard size={16} />} label='Dashboard' iconPosition='start' />
            <StyledTab icon={<Call size={16} />} label='Candidate' iconPosition='start' />
            <StyledTab icon={<Call size={16} />} label='Candidate FeedBack' iconPosition='start' />

          </Tabs> */}
        </TabsContainer>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} lg={3}>
              <MetricCard
                title='Total Calls'
                value={dashboardStats.totalCalls}
                subtitle='All dialed interview calls'
                icon={Users}
                bgcolor='#e0f2fe'
                textColor='#0277bd'
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <MetricCard
                title='Answered Calls'
                value={dashboardStats.agentAnswered}
                subtitle='Calls answered by agents'
                icon={UserCheck}
                bgcolor='#f1f8e9'
                textColor='#689f38'
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <MetricCard
                title='Missed Calls'
                value={dashboardStats.callMissed}
                subtitle='Calls marked as missed'
                icon={UserX}
                bgcolor='#ffebee'
                textColor='#d32f2f'
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <MetricCard
                title='Not Answered'
                value={dashboardStats.agentNoAnswer + dashboardStats.callerNoAnswer}
                subtitle='No answer from agent or caller'
                icon={Eye}
                bgcolor='#f3e5f5'
                textColor='#7b1fa2'
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} my={2} alignItems='center'>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Search"
                variant="outlined"
                fullWidth
                size="small"
                placeholder="Search by Caller ID, Receiver ID, etc..."
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "#667eea" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
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
            </Grid>
             <Grid item xs={12} sm={6} md={2}>
             <ClickAwayListener onClickAway={handleClickAway}>
                <Box sx={{ flex: "1 1 230px" }}>
                <TextField
                    label="Schedule Date"
                    inputRef={anchorRef}
                    value={
                    dateFilter.startDate && dateFilter.endDate
                        ? `${format(dateFilter.startDate, "dd/MM/yyyy")} - ${format(dateFilter.endDate, "dd/MM/yyyy")}`
                        : ""
                    }
                    onClick={() => setOpen(true)}
                    readOnly
                    size="small"
                    fullWidth
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
                            startDate: dateFilter.startDate || new Date(),
                            endDate: dateFilter.endDate || new Date(),
                            key: "selection",
                        },
                        ]}
                    />
                    </Box>
                </Popper>
                </Box>
            </ClickAwayListener>
                </Grid>
           
            <Grid item xs={12} sm={6} md={2}>

                <TextField
                                        select
                                        label="Status"
                                        size="small"
                                        value={status}
                                        fullWidth
                                        onChange={e => setStatusFilter(e.target.value)}
                                        InputProps={{
                                          startAdornment: (
                                            <InputAdornment position="start">
                                              <Category sx={{ color: "#f093fb" }} />
                                            </InputAdornment>
                                          ),
                                        }}
                                        sx={{
                                          "& .MuiOutlinedInput-root": {
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
                                        <MenuItem value='answered'>Answered</MenuItem>
                  <MenuItem value='agent_no_answer'>Agent Didn't Answer</MenuItem>
                  <MenuItem value='caller_no_answer'>Caller Didn't Answer</MenuItem>
                                      </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                label="Interviewer"
                size="small"
                value={interviewerFilter} 
                onChange={e => setInterviewerFilter(e.target.value)} 
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PresentToAll sx={{ color: "#f093fb" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
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
              {rows.map(item=> <MenuItem value={item.interviewerId}>{item.interviewerName}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                label="Candidate"
                size="small"
                value={candidateFilter} 
                onChange={e => setCandidateFilter(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: "#f093fb" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
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
            {rows.map(item=> <MenuItem value={item.candidateId}>{item.candidateName}</MenuItem>)}
            </TextField>
            </Grid>
            <Grid item xs={12} sm={4} md={1} sx={{ display: "flex", alignItems: "center" }}>
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

          <Box sx={{ height: 650, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 }
                }
              }}
              slots={{
                toolbar: CustomToolbar,
                noRowsOverlay: () => (
                  <Box
                    sx={{
                      display: 'flex',
                      height: '100%',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  ></Box>
                )
              }}
              disableRowSelectionOnClick
              sx={{
                minWidth: '1000px',
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#1976d2',
                  color: '#fff',
                  fontWeight: 600
                },
                '& .MuiDataGrid-columnHeader': {
                  backgroundColor: '#1976d2',
                  color: '#fff'
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 'bold',
                  color: '#fff'
                },
                '& .MuiDataGrid-columnHeader .MuiSvgIcon-root': {
                  color: '#fff'
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',
                  display: 'flex',
                  alignItems: 'center'
                },
                '& .MuiDataGrid-row': {
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    cursor: 'pointer'
                  }
                },
                '& .MuiDataGrid-toolbarContainer': {
                  padding: '12px',
                  backgroundColor: '#f8f9fa',
                  borderBottom: '1px solid #e0e0e0'
                }
              }}
            />
          </Box>
        </TabPanel>
        {/* <TabPanel value={tabValue} index={1}>
  <Candidate />
</TabPanel> */}

      </Container>
    </GradientBox>
  )
}
