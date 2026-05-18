'use client';

import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Box,
  Stack,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import TodayIcon from '@mui/icons-material/Today';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import UpdateIcon from '@mui/icons-material/Update';
import CategoryIcon from '@mui/icons-material/Category';
import StarIcon from '@mui/icons-material/Star';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { parseISO, format, startOfWeek, getDay ,isSunday } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { DateCalendar, PickersDay } from '@mui/x-date-pickers';
import { styled } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';


export default function HolidayDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter()
  const [addSunday, setAddSunday] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    status: 'active',
    departmentSelection: 'Specific',
    department: [],
    isWorking: true,
    reason: ''
  });

  const getDashboardData = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/calender/holidays-dashboard`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      });
      setDashboardData(res.data.items || {});
    } catch (error) {
      console.error('Error fetching holidays:', error);
    }
  };
  const [date, setDate] = useState(new Date()); 

  const handleNavigate = (newDate) => {
    setDate(newDate); 
  };

  const locales = {
    'en-US': enUS,
  };
  
  const localizer = dateFnsLocalizer({
    format,
    parse: parseISO,
    startOfWeek,
    getDay,
    locales,
  });

  const SundayHighlight = styled(PickersDay)(({ theme }) => ({
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
    },
    '&.MuiPickersDay-root.sunday': {
      border: `1px solid ${theme.palette.warning.main}`,
      backgroundColor: theme.palette.warning.light,
      color: theme.palette.common.white,
    },
  }));
  
  const renderSundayDay = (day, _value, DayComponentProps) => {
    const isDaySunday = isSunday(day);
    return <SundayHighlight {...DayComponentProps} className={isDaySunday ? 'sunday' : ''} />;
  };
  
  const holidayEvents = dashboardData?.nextHolidays?.map((holiday) => {
    const date = parseISO(holiday.date.split('T')[0]); 
    return {
      title: `${holiday.title} ${isSunday(date) ? ' - Sunday' : ''}`,
      start: date,
      end: date,
      allDay: true,
    };
  }) || [];

  const [depts, setDepts] = useState([])
  const getAllDepartment = async () =>{
    try {
        const res = await axios.get(`${baseUrl}/v1/api/newdepartment`, {
          headers: {
            'Content-Type': 'application/json',
             authorization: token
          }
        })
        if(res.data.status){
          setDepts(res.data.items.filter(i=>i.isActive===true) || []);
        }
    } catch (error) {
        console.error("error",error)
    }
}

  useEffect(() => {
    getDashboardData();
    getAllDepartment()
  }, []);

  if (!dashboardData) return null;

  const metrics = [
    { label: 'Total Holidays', value: dashboardData.totalHolidays, icon: <TodayIcon />, color: '#e3f2fd' },
    { label: 'Active Holidays', value: dashboardData.activeHolidays, icon: <EventAvailableIcon />, color: '#e8f5e9' },
    { label: 'Upcoming Holidays', value: dashboardData.upcomingHolidays, icon: <UpdateIcon />, color: '#fff3e0' },
    { label: 'Distinct Holiday Types', value: dashboardData.distinctHolidayTypes, icon: <CategoryIcon />, color: '#f3e5f5' },
    { label: 'Most Common Type', value: dashboardData.mostCommonType, icon: <StarIcon />, color: '#ede7f6' },
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMultiSelect = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      department: value.map(id => ({ departmentId: id }))
    }));
  };

  const handleDateChange = (newDate) => {
    console.log("date",newDate)
    if (isSunday(newDate)) {
      const formatted = format(newDate, 'yyyy-MM-dd');
      setFormData((prev) => ({ ...prev, date: formatted }));
    }
  };

  const handleSubmit = async () => {
    try {
        await axios.post(`${baseUrl}/v1/api/calender/addSundayWorking`, formData, {
          headers: {
            'Content-Type': 'application/json',
            authorization: token,
          },
        });
        setAddSunday(false);        
        setFormData({
            title: '',
            date: '',
            status: 'active',
            departmentSelection: 'Specific',
            department: [],
            isWorking: true,
            reason: ''
          });
        getDashboardData();
      } catch (error) {
        console.error('Error adding holiday:', error);
      }
  };

  return (
    <Container sx={{ mt: 4 }}>
        <Box sx={{display:'flex', justifyContent:"space-between", alignContent:"center", my:3}}>
    <Typography fontSize={18} fontWeight={700} mb={3}>
        🎉 Holiday Dashboard
      </Typography>
      <Box sx={{display:'flex', gap:3}}>
      <Button variant='contained' size='small' onClick={()=>router.push("/employeeSetup/HolidaySetup")}>
        Holiday Setup
      </Button>
      <Button variant='contained' size='small' onClick={()=>setAddSunday(true)}>
        Add Working Sunday
      </Button>
      <Button variant='contained' size='small' onClick={()=>router.push("/dashboard/holidayDashboard/sundayDashboard")}>
        Sunday Dashboard
      </Button>
      </Box>
        </Box>

      {/* Metrics Section */}
      <Grid container spacing={3} mb={4}>
        {metrics.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
                elevation={4}
                sx={{
                borderRadius: 3,
                bgcolor: item.color,
                }}
            >
                <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                    {item.icon}
                    <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                        {item.label}
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="text.primary">
                        {item.value}
                    </Typography>
                    </Box>
                </Box>
                </CardContent>
            </Card>
            </Grid>
        ))}
        </Grid>

      <Card elevation={4} sx={{ borderRadius: 3, mb: 4 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} mb={2}>
          📅 Upcoming Holidays Calendar
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Calendar
          localizer={localizer}
          events={holidayEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          views={['month']}
          defaultView="month"
          date={date} 
          onNavigate={handleNavigate} 
          popup
        />
      </CardContent>
    </Card>


      {dashboardData.lastUpdatedHoliday && (
        <Card elevation={4} sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              🕒 Last Updated Holiday
            </Typography>
            <Typography variant="body1">
              <strong>{dashboardData.lastUpdatedHoliday.title}</strong> was last updated on{' '}
              {format(new Date(dashboardData.lastUpdatedHoliday.updatedAt.split('T')[0]), 'PPP')}.
            </Typography>
          </CardContent>
        </Card>
      )}

<Dialog open={addSunday} onClose={() => setAddSunday(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create Shift/Holiday</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <TextField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateCalendar
                value={formData.date ? new Date(formData.date) : null}
                onChange={handleDateChange}
                shouldDisableDate={(date) => !isSunday(date)}
            />
            </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Department Selection</InputLabel>
                <Select
                  name="departmentSelection"
                  value={formData.departmentSelection}
                  onChange={handleChange}
                  label="Department Selection"
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Specific">Specific</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {formData.departmentSelection === 'Specific' && (
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>Departments</InputLabel>
                  <Select
                    multiple
                    value={formData.department.map((d) => d.departmentId)}
                    onChange={handleMultiSelect}
                    input={<OutlinedInput label="Departments" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((id) => {
                          const dept = depts.find((d) => d._id === id);
                          return <Chip key={id} label={dept?.name || id} />;
                        })}
                      </Box>
                    )}
                  >
                    {depts.map((dept) => (
                      <MenuItem key={dept._id} value={dept._id}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                label="Reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                size="small"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setAddSunday(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
