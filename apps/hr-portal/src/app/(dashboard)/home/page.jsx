'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  IconButton,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
// import {
//   Group as GroupIcon,
//   Apartment as ApartmentIcon,
//   CalendarToday as CalendarTodayIcon,
//   AddCircleOutline as AddCircleOutlineIcon,
//   Dashboard as DashboardIcon,
//   People as PeopleIcon,
//   Event as EventIcon,
//   Work as WorkIcon,
//   AssignmentTurnedIn as AssignmentIcon
// } from '@mui/icons-material';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
 import JobApplication  from '../JobApplications/page';


export default function ZohoLikeDashboard() {
  // const router = useRouter();
  // const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  // const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // const [employees, setEmployees] = useState([]);
  // const [newJoinee, setNewJoinee] = useState([])
  // const [tab, setTab] = useState(0);

  // const getAllEmployees = async () => {
  //   try {
  //     const res = await axios.get(`${baseUrl}/v1/api/Auth/getAllEmployee`, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         authorization: token
  //       }
  //     });

  //     const formatted = res.data.items.employees.map(emp => ({
  //       ...emp,
  //       branchName: emp.branchId?.name || '',
  //       roleNames: emp.roleId?.map(role => role.roleName).join(', '),
  //       reportingManagerName: emp.reportingManagerId?.employeName || '',
  //       departmentName: emp.departmentId?.name || '',
  //       designationName: emp.designationId?.name || '',
  //       workLocationName: emp.workLocationId?.name || '',
  //       employmentType: emp.employementTypeId?.title || '',
  //       employeeType: emp.employeeTypeId?.title || '',
  //     }));
  //     setEmployees(formatted);
  //   } catch (error) {
  //     console.error('error', error);
  //   }
  // };

  // const getAllNewEmployees = async () => {
  //   try {
  //     const res = await axios.get(`${baseUrl}/v1/api/Auth/newjoinee?onboardingStatus=joining`, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         authorization: token
  //       }
  //     });

  //     const formatted = res.data.items.employees.map(emp => ({
  //       ...emp,
  //       branchName: emp.branchId?.name || '',
  //       roleNames: emp.roleId?.map(role => role.roleName).join(', '),
  //       reportingManagerName: emp.reportingManagerId?.employeName || '',
  //       departmentName: emp.departmentId?.name || '',
  //       designationName: emp.designationId?.name || '',
  //       workLocationName: emp.workLocationId?.name || '',
  //       employmentType: emp.employementTypeId?.title || '',
  //       employeeType: emp.employeeTypeId?.title || '',
  //     }));
  //     setNewJoinee(formatted);
  //   } catch (error) {
  //     console.error('error', error);
  //   }
  // };

  // useEffect(() => {
  //   getAllEmployees();
  //   getAllNewEmployees()
  // }, []);

  // const getColumns = (showPhoto = true) => {
  //   const baseColumns = [
  //     { field: 'employeUniqueId', headerName: 'Emp ID', width: 120 },
  //     showPhoto && {
  //       field: 'employeePhoto',
  //       headerName: 'Photo',
  //       width: 100,
  //       renderCell: params => (
  //         <img
  //           src={params.value}
  //           alt="emp"
  //           style={{ width: 40, height: 40, borderRadius: '50%' }}
  //         />
  //       ),
  //     },
  //     { field: 'employeName', headerName: 'Name', width: 180 },
  //     { field: 'reportingManagerName', headerName: 'Manager', width: 150 },
  //     { field: 'company', headerName: 'Company', width: 200 },
  //     { field: 'branchName', headerName: 'Branch', width: 150 },
  //     { field: 'departmentName', headerName: 'Department', width: 150 },
  //     { field: 'designationName', headerName: 'Designation', width: 150 },
  //     { field: 'workLocationName', headerName: 'Work Location', width: 150 },
  //     {
  //       field: 'update',
  //       headerName: 'Update',
  //       width: 100,
  //       renderCell: (params) => (
  //         <Button
  //           size='small'
  //           variant="outlined"
  //           color="primary"
  //           onClick={() => router.push(`/home/employeeUpdate?id=${params.row._id}`)}
  //         >
  //           Update
  //         </Button>
  //       ),
  //     },
  //   ];

  //   return baseColumns.filter(Boolean);
  // };


  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      {/* <Box display="flex" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            HR Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage people, attendance, events and more.
          </Typography>
        </Box>
        <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56 }}>
          <IconButton onClick={() => router.push('/employeeSetup')}>
            <DashboardIcon sx={{ color: 'white' }} />
          </IconButton>
        </Avatar>
      </Box> */}


      {/* Summary Widgets */}
      {/* <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
            <GroupIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h6">Total Employees</Typography>
              <Typography variant="h5">{employees.length}</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
            <AssignmentIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h6">New Hires</Typography>
              <Typography variant="h5">{newJoinee.length}</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
            <CalendarTodayIcon color="error" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h6">On Leave Today</Typography>
              <Typography variant="h5">3</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
            <EventIcon color="secondary" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h6">Events</Typography>
              <Typography variant="h5">2</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid> */}

      {/* Tabs for Employee Categories */}
      {/* <Box mt={3}>
        <Tabs value={tab} onChange={(e, val) => setTab(val)}>
          <Tab label="All Employees" />
          <Tab label="New Hires" />
          <Tab label="On Leave" />
          <Tab label="Ex-Employees" />
        </Tabs>
        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography variant="h6" mb={2}>
            {tab === 0 && 'All Employees'}
            {tab === 1 && 'New Hires'}
            {tab === 2 && 'On Leave'}
            {tab === 3 && 'Ex-Employees'}
          </Typography>
          <Box style={{ height: 450, width: '100%', marginTop: 10 }}>
            <DataGrid
              rows={
                tab === 0
                  ? employees
                  : tab === 1
                    ? newJoinee
                    : []
              }
              columns={getColumns(tab === 0)}
              pageSize={5}
              rowsPerPageOptions={[5]}
              getRowId={(row) => row._id}
              components={{ Toolbar: GridToolbar }}
            />
          </Box>


        </Box>

      </Box> */}
      <JobApplication/>
    </Container>
  );
}