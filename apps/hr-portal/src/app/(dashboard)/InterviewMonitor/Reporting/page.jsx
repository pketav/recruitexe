'use client'

import React, { useEffect, useState } from 'react'
import { Box, Stack, Typography, Tooltip, IconButton, Button, Chip, Drawer, Paper, Rating, TextField } from '@mui/material'
import { styled, keyframes, duration } from "@mui/material/styles"
import DataTable from '@/components/DataTable'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import {
  PictureAsPdf,
  ArrowBack,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  ViewColumn as ViewColumnIcon,
  Settings as SettingsIcon,
  Pause,
  CheckCircle,
  Cancel,
  PauseCircle,
  People,
  WhatsApp,
  Email,
  Search,
  ViewModule,
  Person,
  WorkspacePremium,
  Star,
  Feedback,
  Reviews
} from "@mui/icons-material"
import { GraduationCap, Presentation, Clock } from 'lucide-react'
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarFilterButton
} from '@mui/x-data-grid'
const CustomToolbar = () => {
  return (
    <GridToolbarContainer sx={{ p: 1, gap: 1 }}>
      <GridToolbarColumnsButton startIcon={<ViewColumnIcon />} sx={{ color: 'primary.main' }} />
      <GridToolbarFilterButton startIcon={<FilterIcon />} sx={{ color: 'primary.main' }} />
      <GridToolbarDensitySelector startIcon={<SettingsIcon />} sx={{ color: 'primary.main' }} />
      <GridToolbarExport
        startIcon={<DownloadIcon />}
        sx={{ color: 'primary.main' }}
        csvOptions={{
          disableToolbarButton: false
        }}
        printOptions={{
          disableToolbarButton: true
        }}
      />
    </GridToolbarContainer>
  )
}

const GradientBox = styled(Box)(({ theme }) => ({
  backgroundColor: "#f8fafc",
  padding: theme.spacing(3),
}))

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
`;


const toTitleCase = (str = '') =>
  str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());

export default function Reporting({ allCandidates }) {

  const router = useRouter()
  const [formattedCandidates, setFormattedCandidates] = useState([])
  const [openDrawerFeedback, setOpenDrawerFeedback] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState()
  const [feedback, setFeedBack] = useState({
    feedback: '',
    skillsFeedback: '',
    interviewfeedbackStatus: ''
  })
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  useEffect(() => {
    setFormattedCandidates(
      allCandidates.map((item) => ({
        id: item?._id,
        candidateId: item?.candidateId?._id,
        name: toTitleCase(item?.candidateId?.name),
        mobile: item?.candidateId?.mobileNumber,
        email: item?.candidateId?.emailId,
        position: item?.candidateId?.position,
        interviewerName: toTitleCase(item?.interviewerId?.userName),
        interviewType: item?.interviewType,
        interviewMode: toTitleCase(item?.interviewModel),
        roundName: toTitleCase(item?.roundName),
        roundNumber: item?.roundNumber,
        duration: item?.durationMinutes,
        jobPostId: item?.candidateId?.jobPostId,
        scheduleDate: item?.scheduleDate
          ? (() => {
            if (item.roundName === 'AI Round') {
              const rawDate = item.scheduleDate;
              const [datePart] = rawDate.split('T');
              const [year, month, day] = datePart.split('-');
              const monthShort = new Date(rawDate).toLocaleString('en-IN', { month: 'short' });
              return `${day}-${monthShort}-${year}`;
            } else {
              return new Date(item.scheduleDate).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              });
            }
          })()
          : "-",

        scheduleTime: item?.scheduleDate
          ? (() => {
            if (item.roundName === 'AI Round') {
              const rawDate = item.scheduleDate;
              const [, timePart] = rawDate.split('T');
              const [hour, minute] = timePart.split(':');
              return new Date(`1970-01-01T${hour}:${minute}:00`).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              });
            } else {
              return new Date(item.scheduleDate).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              });
            }
          })()
          : "-",

        status: item?.status,
      }))
    );
  }, [allCandidates]);


  const getSkillsCriteria = async (id) => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/jobPost/getDetail?jobPostId=${id}`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      })
      if (res.data.status) {
        setFeedBack((prev) => ({
          ...prev,
          skillsFeedback: res.data.items?.screeningCriteria ? res.data.items.screeningCriteria.filter(item => item.weight > 0).map(i => ({
            criteria: i.name,
            score: 0
          })) : []
        }))
      }
    } catch (error) {
      console.error("error", error)
    }
  }

  useEffect(() => {
    getSkillsCriteria(selectedCandidate?.jobPostId)
  }, [selectedCandidate])

  const handleRatingChange = (newValue, criteria) => {
    setFeedBack(prev => ({
      ...prev,
      skillsFeedback: prev.skillsFeedback.map(item =>
        item.criteria === criteria
          ? {
            ...item,
            score: newValue,
          }
          : item
      ),
    }));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${baseUrl}/v1/api/interview/update?id=${selectedCandidate?.id}`, {
        ...feedback,
        status: "complete"
      }, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      })
      if (res.data.status) {
        setSelectedCandidate({})
        setFeedBack({
          feedback: '',
          skillsFeedback: ''
        })
        setOpenDrawerFeedback(false)
      }
    } catch (error) {
      console.error("error", error)
    }
  }
  const fullColumnDefs = [
    {
      field: "name",
      headerName: "Candidate Name",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PersonIcon sx={{ fontSize: 16, color: "success.main" }} />
          <Typography fontSize={14} fontWeight={500} color='black'>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "scheduleDate",
      headerName: "Interview Date",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CalendarIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "scheduleTime",
      headerName: "Interview Time",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Clock size={19} sx={{ color: "text.secondary" }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "interviewerName",
      headerName: "Interviewer Name",
      width: 180,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Person sx={{ fontSize: 16, color: "warning.main" }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "roundName",
      headerName: "Round Name",
      width: 180,

      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <GraduationCap sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "roundNumber",
      headerName: "Round Number",
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <GraduationCap sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Interview Status",
      width: 180,
      renderCell: (params) => {
        const colorMap = {
          scheduled: "primary",
          completed: "success",
          rejected: "error",
          hold: "warning",
          reScheduled: "warning"
        };

        const formatCase = (text) =>
          text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : "Unknown";

        const status = params.value === "schedule" ? "scheduled" : params.value === "complete" ? "completed" : "reScheduled";
        const chipColor = colorMap[status] || "default";

        return (
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "center", width: "100%" }}>
            <Chip
              label={formatCase(status)}
              color={chipColor}
              sx={{
                borderRadius: "10px",
                fontSize: "0.75rem",
                height: 27,
                minWidth: 120,
                textAlign: "center",
                px: 1,
              }}
            />
          </Box>
        );
      },
    },
    {
      field: "interviewType",
      headerName: "Interview Type",
      width: 150,

      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Presentation size={19} sx={{ color: "warning.main" }} />
          <Typography variant="body2">{params.value === "Walk-In" ? "Face to Face" : params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "interviewMode",
      headerName: "Interview Mode",
      width: 150,

      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Presentation size={19} sx={{ color: "warning.main" }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "position",
      headerName: "Position",
      width: 280,

      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WorkIcon sx={{ fontSize: 16, color: "secondary.main" }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "mobile",
      headerName: "Contact",
      width: 130,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }} onClick={(e) => {
          e.stopPropagation();

          const width = 500;
          const height = 600;
          const left = window.innerWidth / 2 - width / 2 + window.screenX;
          const top = window.innerHeight / 2 - height / 2 + window.screenY;

          const url = `https://wa.me/${params.value}`;

          window.open(
            url,
            "whatsappPopup",
            `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
          );
        }}>
          <WhatsApp
            sx={{ fontSize: 16, color: "success.main", animation: `${bounce} 0.6s ease-in-out infinite` }}
          />
          <Typography variant="body2">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 300,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }} onClick={(e) => {
          e.stopPropagation();
          setSelectedEmail(params.value);
          setEmailModalOpen(true);
        }}>
          <Email sx={{ fontSize: 16, color: "info.main", animation: `${bounce} 0.6s ease-in-out infinite`, }} />
          <Typography
            variant="body2"
            color="primary"
            sx={{ cursor: "pointer", textDecoration: "underline" }}
          >
            {params.value}
          </Typography>
        </Box>
      ),
    },
    //           {
    //   field: "FeedBack",
    //   headerName: "FeedBack",
    //   width: 160,
    //   headerAlign: "center",
    //   align: "center",
    //   renderCell: (params) => {
    //     return (
    //       <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", justifyContent: "center", width: "100%" }}>
    //         <Button
    //           size="small"
    //           onClick={(e) => {
    //             e.stopPropagation();
    //             setOpenDrawerFeedback(true);
    //             setSelectedCandidate(params.row)
    //           }}
    //           disabled={params.row.status==='complete'}
    //           sx={{
    //             textTransform: 'none',
    //             borderRadius: '10px',
    //             fontWeight: 500,
    //             gap: 1,
    //             minWidth: 100,
    //             display: 'flex',
    //             alignItems: 'center',
    //             justifyContent: 'center',
    //             position: 'relative'
    //           }}
    //           color='info'
    //           variant='contained'
    //           >
    //              Interview Feedback
    //           </Button>
    //       </Box>
    //     );
    //   },
    // },
    {
      field: "view",
      headerName: "View Profile",
      width: 160,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", justifyContent: "center", width: "100%" }}>
            <Button
              size="small"
              onClick={(e) => { e.stopPropagation(); router.push(`/InterviewMonitor/CandidateProfile?id=${params.row.candidateId}`) }}
              sx={{
                color: "#3b82f6",
                backgroundColor: "#eff6ff",
                "&:hover": { backgroundColor: "#dbeafe" },
              }}
            >
              View Profile
            </Button>
          </Box>
        );
      },
    }
  ]
  return (
    <GradientBox maxWidth="xl">
      <Box sx={{ height: "600px", overflow: "auto" }}>
        <DataGrid
          rows={formattedCandidates}
          columns={fullColumnDefs}
          getRowId={(row) => row.id}
          checkboxSelection
          slots={{
            toolbar: CustomToolbar,
          }}
          hideFooter
          autoHeight={false}
          sx={{
            minWidth: '1000px',
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#1976d2",
              color: "#fff",
              fontWeight: 600,
            },
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "#1976d2",
              color: "#fff",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
              color: "#fff",
            },
            "& .MuiDataGrid-columnHeader .MuiSvgIcon-root": {
              color: "#fff",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid rgba(224, 224, 224, 1)",
              display: "flex",
              alignItems: "center",
            },
            "& .MuiDataGrid-row": {
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.04)",
                cursor: "pointer",
              },
            },
            "& .MuiDataGrid-toolbarContainer": {
              padding: "12px",
              backgroundColor: "#f8f9fa",
              borderBottom: "1px solid #e0e0e0",
            },
          }}
        />
      </Box>
      <Drawer
        anchor='right'
        open={openDrawerFeedback}
        onClose={() => setOpenDrawerFeedback(false)}
        PaperProps={{
          sx: {
            width: 550,
            // px:6,
            // my:5,
            padding: 6,
            background: '#FFFFFF'
          }
        }}
      >
        <Box display='flex' alignItems='center' gap={1} mb={4}>
          <IconButton onClick={() => setOpenDrawerFeedback(false)}>
            <ArrowBack />
          </IconButton>
          <Typography variant='h5' color='#101828' fontWeight={700}>
            Candidate Feedback
          </Typography>
        </Box>

        <Typography variant='h6' color='#101828' fontWeight={600} my={1}>
          *Candidate
        </Typography>
        <Paper variant='outlined' sx={{ padding: 1, mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip label={selectedCandidate?.name} sx={{ margin: '2px' }} />
        </Paper>

        {/* <Box display='flex' gap={3} my={3}>
            <TextField
              fullWidth
              label='Selected Date'
              type='date'
              value={date}
              onChange={e => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ background: '#FFF' }}
            />
            <TextField
              fullWidth
              label='Selected Time'
              value={time}
              onChange={e => setTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ background: '#FFF' }}
            />
          </Box> */}
        <Paper
          variant="outlined"
          sx={{
            width: '100%',
            maxWidth: 600,
            minHeight: 200,
            maxHeight: 500,
            // py: 5,
            // px: 4,
            my: 3,
            background: '#fff', // ⬅ solid background to fix overlay issue
            borderRadius: 3,
            textAlign: 'center',
            overflow: 'auto',
            position: 'relative',
          }}
        >
          {/* Fixed Header */}
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{
              position: 'sticky',
              top: 0,
              background: '#fff', // ⬅ must match Paper background
              zIndex: 1,
              p: 4
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                fontSize: 10,
              }}
            >
              <WorkspacePremium />
            </Box>
            <Typography variant="subtitle1" fontWeight={600} color="#101828">
              Candidate Feedback
            </Typography>
          </Box>

          <Box p={3}>
            {Array.isArray(feedback?.skillsFeedback) && feedback.skillsFeedback.length > 0 ? (
              feedback.skillsFeedback.map((item) => (
                <Box
                  key={item.criteria}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  py={3}
                  borderBottom="1px solid #E5E7EB"
                  sx={{ '&:last-child': { borderBottom: 'none' } }}
                >
                  <Typography variant="h6" color="#101828">
                    {item.criteria}
                  </Typography>
                  <Rating
                    value={item.score}
                    max={5}
                    onChange={(_, newValue) => handleRatingChange(newValue, item.criteria)}
                    icon={<Star fontSize="medium" />}
                    emptyIcon={<Star fontSize="medium" style={{ color: '#E4E7EC' }} />}
                    sx={{
                      '& .MuiRating-icon': {
                        fontSize: 30,
                        mx: 3,
                      },
                      '& .MuiRating-iconFilled': {
                        color:
                          item.score === 1
                            ? '#EF4444'
                            : item.score <= 3
                              ? '#FACC15'
                              : '#22C55E',
                      },
                    }}
                  />
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No skills Criteria available.
              </Typography>
            )}
          </Box>
        </Paper>


        <Typography variant='h6' color='#101828' fontWeight={600} my={4}>
          *Comments
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder='Add comment on this candidate'
          value={feedback?.feedback}
          onChange={e => setFeedBack((prev) => ({ ...prev, feedback: e.target.value }))}
          variant='outlined'
          sx={{ mb: 4, background: '#FFF' }}
        />
        <Typography variant='h6' color='#101828' fontWeight={600} my={2} display={'flex'} align='center' gap={2}>
          <Reviews sx={{ color: "#FFD700" }} />
          Feedback Review
        </Typography>
        <Box display="flex" gap={2} mb={4}>

          <Button
            variant={feedback.interviewfeedbackStatus === 'positive' ? 'contained' : 'outlined'}
            onClick={() => setFeedBack((prev) => ({ ...prev, interviewfeedbackStatus: 'positive' }))}
            sx={{
              textTransform: 'none',
              backgroundColor: feedback.interviewfeedbackStatus === 'positive' ? '#4CAF50' : '#FFF',
              color: feedback.interviewfeedbackStatus === 'positive' ? '#FFF' : '#4CAF50',
              borderColor: '#4CAF50',
              fontWeight: 600
            }}
            size='small'
          >
            👍 Positive Feedback
          </Button>

          <Button
            size='small'
            variant={feedback.interviewfeedbackStatus === 'negative' ? 'contained' : 'outlined'}
            onClick={() => setFeedBack((prev) => ({ ...prev, interviewfeedbackStatus: 'negative' }))}
            sx={{
              textTransform: 'none',
              backgroundColor: feedback.interviewfeedbackStatus === 'negative' ? '#F44336' : '#FFF',
              color: feedback.interviewfeedbackStatus === 'negative' ? '#FFF' : '#F44336',
              borderColor: '#F44336',
              fontWeight: 600
            }}
          >
            👎 Negative Feedback
          </Button>
        </Box>

        <Box display='flex' justifyContent='space-between' gap={2}>
          <Button
            variant='outlined'
            sx={{ textTransform: 'none', color: '#344054', borderColor: '#D0D5DD' }}
            onClick={() => setOpenDrawerFeedback(false)}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            sx={{ backgroundColor: '#5A4BFF', color: '#FFF', textTransform: 'none' }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </Drawer>
    </GradientBox>
  )
}
