'use client';

import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Box, Button, Dialog, DialogTitle,
  DialogContent, TextField, DialogActions, Switch, FormControlLabel,
  IconButton
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function LeaveType() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [open, setOpen] = useState(false);
  const router = useRouter()
  const [formData, setFormData] = useState({
    leaveTypeName: '',
    code: '',
    Description: '',
    Valid_from: '',
    ExpiresOn: '',
    maxDaysAllowed: '',
    carryForwardAllowed: false,
    status: 'active'
  });

  const getLeaveType = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/leavetype/get`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      });
      setLeaveTypes(res.data.items || []);
    } catch (error) {
      console.error('Error fetching leave types:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        maxDaysAllowed: Number(formData.maxDaysAllowed),
      };
      const url = formData.id
        ? `${baseUrl}/v1/api/leavetype/update`
        : `${baseUrl}/v1/api/leavetype/add`;

      await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      });

      setOpen(false);
      setFormData({
        leaveTypeName: '',
        code: '',
        Description: '',
        Valid_from: '',
        ExpiresOn: '',
        maxDaysAllowed: '',
        carryForwardAllowed: false,
        status: 'active'
      });
      getLeaveType();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      id: item._id,
      leaveTypeName: item.leaveTypeName,
      code: item.code,
      Description: item.Description,
      Valid_from: item.Valid_from?.slice(0, 10),
      ExpiresOn: item.ExpiresOn?.slice(0, 10),
      maxDaysAllowed: item.maxDaysAllowed,
      carryForwardAllowed: item.carryForwardAllowed,
      status: item.status,
    });
    setOpen(true);
  };

  const columns = [
    { field: 'leaveTypeName', headerName: 'Leave Type Name', width:200},
    { field: 'Description', headerName: 'Description', width:600},
    { field: 'maxDaysAllowed', headerName: 'Max Days', width: 120,align:"center",headerAlign:"center"   },
    {
      field: 'actions',
      headerName: 'Actions',
      align:"center",headerAlign:"center",
      width: 200,
      renderCell: (params) => (
        <IconButton onClick={() => handleEdit(params.row)}>
          <EditIcon color="primary" />
        </IconButton>
      ),
    },
  ];

  useEffect(() => {
    getLeaveType();
  }, []);

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={4} mb={2}>
        <Typography variant="h5">Leave Type Setup</Typography>
        <Box sx={{display:'flex',gap:3}}>
        <Button variant="contained" size='small' onClick={() => setOpen(true)}>Add Leave Type</Button>
        <Button variant='outlined'size='small' onClick={()=>router.push("/employeeSetup")}>Back</Button>
        </Box>
     
      </Box>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={leaveTypes.map((item) => ({ id: item._id, ...item }))}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          disableRowSelectionOnClick
        />
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{formData.id ? 'Update' : 'Add'} Leave Type</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Leave Type Name"
            fullWidth
            value={formData.leaveTypeName}
            onChange={(e) => setFormData({ ...formData, leaveTypeName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Code"
            fullWidth
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            value={formData.Description}
            onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Valid From"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.Valid_from}
            onChange={(e) => setFormData({ ...formData, Valid_from: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Expires On"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.ExpiresOn}
            onChange={(e) => setFormData({ ...formData, ExpiresOn: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Max Days Allowed"
            type="number"
            fullWidth
            value={formData.maxDaysAllowed}
            onChange={(e) => setFormData({ ...formData, maxDaysAllowed: e.target.value })}
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.carryForwardAllowed}
                onChange={(e) => setFormData({ ...formData, carryForwardAllowed: e.target.checked })}
              />
            }
            label="Carry Forward Allowed"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {formData.id ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
