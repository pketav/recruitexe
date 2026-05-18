'use client';

import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Box, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, IconButton, MenuItem, Select, InputLabel, FormControl, Grid
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { useRouter } from 'next/navigation';


export default function HolidaySetup() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [holidays, setHolidays] = useState([]);
  const [open, setOpen] = useState(false);
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: '',
    type: 'Company',
    status: 'active',
  });

  const getHolidays = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/calender/holidays/check-or-list?year=${year}`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      });
      setHolidays(res.data.items.holidays || []);
    } catch (error) {
      console.error('Error fetching holidays:', error);
    }
  };

  const handleAddHoliday = async () => {
    try {
      await axios.post(`${baseUrl}/v1/api/calender/addholiday`, formData, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      });
      setOpen(false);
      setFormData({ title: '', date: '', description: '', type: 'Company', status: 'active' });
      getHolidays();
    } catch (error) {
      console.error('Error adding holiday:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.post(`${baseUrl}/v1/api/calender/holidays/deleteHoliday/${id}`,{}, {
        headers: {
            'Content-Type': 'application/json',
            authorization: token,
          },
      });
      getHolidays();
    } catch (error) {
      console.error('Error deleting holiday:', error);
    }
  };

  useEffect(() => {
    getHolidays();
  }, [year]);

  const columns = [
    { field: 'title', headerName: 'Title', width:200},
    {
        field: 'date',
        headerName: 'Date',
        width: 130,
        renderCell: (params) => {
          const rawDate = params.row?.date;
          if (!rawDate) return '';
      
          const dateObj = new Date(rawDate);
          const day = String(dateObj.getUTCDate()).padStart(2, '0');
          const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0'); 
          const year = dateObj.getUTCFullYear();
      
          return <span>{`${day}-${month}-${year}`}</span>;
        }
    },           
    { field: 'type', headerName: 'Type', width:130},
    { field: 'description', headerName: 'Description', width:500},
    {
      field: 'actions',
      headerName: 'Actions',
      align:"center",
      headerAlign:"center",
      width:150,
      renderCell: (params) => (
        <IconButton onClick={() => handleDelete(params.row._id)}>
          <DeleteIcon color="error" />
        </IconButton>
      ),
    },
  ];

  return (
    <Container maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={4} mb={2}>
        <Typography fontSize={18} fontWeight={600}>Holiday Setup</Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <FormControl size="small">
            <InputLabel>Year</InputLabel>
            <Select value={year} label="Year" onChange={(e) => setYear(e.target.value)}>
              {[...Array(5)].map((_, i) => {
                const y = currentYear - 2 + i;
                return <MenuItem key={y} value={y}>{y}</MenuItem>;
              })}
            </Select>
          </FormControl>
          <Button variant="contained" size="smalls" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            Add Holiday
          </Button>
         <Button variant='outlined'size='small' onClick={()=>router.push("/dashboard/holidayDashboard")}>Back</Button>  
        </Box>
      </Box>

      <DataGrid
        rows={holidays}
        columns={columns}
        getRowId={(row) => row._id}
        autoHeight
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
      />

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Holiday</DialogTitle>
        <DialogContent>
            <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
        <TextField
            label="Title"
            fullWidth
            margin="dense"
            size='small'
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} md={4}>
        <TextField
        label="Date"
        type="date"
        fullWidth
        margin="dense"
        size="small"
        InputLabelProps={{ shrink: true }}
        value={formData.date} 
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
      </Grid>
        <Grid item xs={12} md={4}>

       <FormControl fullWidth variant='outlined' required size='small' margin='dense'>
            <InputLabel>Holiday Type</InputLabel>
            <Select name='type' value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} label='Holiday Type'>
            <MenuItem value='Company'>Company Holiday</MenuItem>
            <MenuItem value='National'>National Holiday</MenuItem>
            <MenuItem value='Religious'>Religious Holiday</MenuItem>
            <MenuItem value="Optional">Optional Holiday</MenuItem>
            </Select>
        </FormControl>
        </Grid>
        <Grid item xs={12} >
        <TextField
            label="Description"
            fullWidth
            margin="dense"
            multiline
            rows={2}
            size='small'
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
         </Grid>
    </Grid>
      </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddHoliday}>Add</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
