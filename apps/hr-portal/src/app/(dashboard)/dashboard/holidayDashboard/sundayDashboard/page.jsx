'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import CelebrationIcon from '@mui/icons-material/Celebration';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import WorkIcon from '@mui/icons-material/Work';
import UpcomingIcon from '@mui/icons-material/Update';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { useRouter } from 'next/navigation';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { parseISO, format, startOfWeek, getDay, addMonths } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import DeleteIcon from '@mui/icons-material/Delete';
import 'react-big-calendar/lib/css/react-big-calendar.css';

export default function SundayDashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [workingSundays, setWorkingSundays] = useState([]);
  
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const router = useRouter()

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
    
    const [date, setDate] = useState(new Date()); 
    
    const workingSundayEvents = workingSundays.map((item) => {
        const eventDate = parseISO(item.date);
        return {
        title: "Working",
        start: eventDate,
        end: eventDate,
        allDay: true,
        reason: item.reason,
        };
    });
    

    const handleNavigate = (newDate) => {
        setDate(newDate); 
    };

    const getDashboardData = async () => {
      try {
        const res = await axios.get(`${baseUrl}/v1/api/calender/sunday_dashboard`, {
          headers: {
            'Content-Type': 'application/json',
            authorization: token,
          },
        });
        setDashboardData(res.data.items || {});
      } catch (error) {
        console.error('Error fetching sunday dashboard:', error);
      }
    };
  
    const getWorkingSundays = async () => {
      try {
        const res = await axios.get(`${baseUrl}/v1/api/calender/getSunday`, {
          headers: {
            'Content-Type': 'application/json',
            authorization: token,
          },
        });
        setWorkingSundays(res.data.items || []);
      } catch (error) {
        console.error('Error fetching working sundays:', error);
      }
    };
  
    useEffect(() => {
      getDashboardData();
      getWorkingSundays()
    }, []);
  
    if (!dashboardData) return null;
  
    const stats = [
      { label: 'Total Sundays', value: dashboardData.totalSundays, icon: <CalendarMonthIcon />, color: '#e3f2fd' },
      { label: 'Active Sundays', value: dashboardData.activeCount, icon: <CelebrationIcon />, color: '#e8f5e9' },
      { label: 'Inactive Sundays', value: dashboardData.inactiveCount, icon: <DisabledByDefaultIcon />, color: '#fff3e0' },
      { label: 'Upcoming Sundays', value: dashboardData.upcomingCount, icon: <UpcomingIcon />, color: '#f3e5f5' },
      { label: 'Working Sundays', value: dashboardData.workingCount, icon: <WorkIcon />, color: '#ede7f6' },
    ];

    const handleDeleteSunday = async (id) => {
        try {
          await axios.post(`${baseUrl}/v1/api/calender/deleteSunday?id=${id}`, {}, {
            headers: {
              'Content-Type': 'application/json',
              authorization: token,
            },
          });
          getWorkingSundays(); 
        } catch (error) {
          console.error('Error deleting working Sunday:', error);
        }
      };
      
  
    return (
      <Container sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: "space-between", alignContent: "center", my: 3 }}>
          <Typography variant="h5" fontWeight={700}>
            🌞 Sunday Dashboard
          </Typography>
          <Button variant='outlined' size='small' onClick={()=>router.push("/dashboard/holidayDashboard")}>
           Back
          </Button>
        </Box>
  
        <Grid container spacing={3} mb={4}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={stat.label}>
              <Card sx={{ borderRadius: 3, bgcolor: stat.color }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    {stat.icon}
                    <Box>
                      <Typography variant="subtitle2">{stat.label}</Typography>
                      <Typography variant="h5" fontWeight={700}>{stat.value}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
  
    <Card elevation={4} sx={{ borderRadius: 3, mb: 4 }}>
      <CardContent>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            📅 Working Sundays Calendar
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Calendar
            localizer={localizer}
            events={workingSundayEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 400 }}
            views={['month']}
            defaultView="month"
            date={date}
            onNavigate={handleNavigate} 
          />
        </Box>

        <Typography variant="h6" fontWeight={700} gutterBottom>
          📅 Working Sunday List
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {workingSundays.length === 0 ? (
          <Typography>No working Sundays found.</Typography>
        ) : (
          <List>
            {workingSundays.map((item) => (
              <ListItem
                key={item._id}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteSunday(item._id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={format(new Date(item.date), 'dd MMM yyyy')}
                  secondary={item.reason}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>

      </Container>
    );
  }
  
