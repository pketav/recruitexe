// Enhanced MasterDropDownList with professional UI tweaks
'use client';

import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Modal,
  TextField,
  Grid,
  IconButton,
  Switch,
  Stack,
  Collapse,
  Divider,
  Snackbar,
  Alert,
  MenuItem
} from '@mui/material';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  EditOutlined as EditIcon,
  Delete as DeleteIcon,
  ArrowRight,
} from '@mui/icons-material';
import Animation from "./animation.json"
import Lottie from 'lottie-react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

const MasterDropDownList = () => {
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [addDD, setAddDD] = useState(false);
  const [dropDownName, setDropDown] = useState('');
  const [dropDownOptions, setDropDownOptions] = useState([]);
  const [addOptionModalOpen, setAddOptionModalOpen] = useState(false);
  const [editOptionModalOpen, setEditOptionModalOpen] = useState(false);
  const [newOptionName, setNewOptionName] = useState('');
  const [editOptionData, setEditOptionData] = useState(null);
  const [editId, setEditID] = useState('');
  const [dropdownStatus, setDropDownStatus] = useState("active")

  const token = typeof window !== 'undefined' ? window.localStorage.getItem('authToken') : '';
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const handleActivity = async (id, isActive) => {
    if (!token) return;
    try {
      const res = await axios.post(
        `${baseUrl}/v1/api/masterDropDown/activeAndInactive?id=${id}&status=${isActive === true ? "active" : "inactive"}`,
        {},
        { headers: { 'Content-Type': 'application/json', authorization: token } }
      );
      if (res.data.status) {
        setSnackbar({
          message: res.data.message,
          severity: "success",
          open: true
        })
        fetchData();
        setSelectedRow(null)
      }
      else {
        setSnackbar({
          message: res.data.message,
          severity: "error",
          open: true
        })
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setSnackbar({
        message: error.message,
        severity: "error",
        open: true
      })
    }
  };



  const fetchData = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${baseUrl}/v1/api/masterDropDown/list?status=active`, {
        headers: { 'Content-Type': 'application/json', authorization: token },
      });
      setRows(res.data.items.map(i => ({
        ...i,
        status: i.status === "active" ? true : false
      })));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleSubmit = async () => {
    if (!token) return;
    try {
      if (editId) {
        const res = await axios.post(`${baseUrl}/v1/api/masterDropDown/update`,
          { name: dropDownName, id: editId },
          { headers: { 'Content-Type': 'application/json', authorization: token } }
        );
        if (res.data.status) {
          setSnackbar({
            message: res.data.message,
            severity: "success",
            open: true
          })
          fetchData();
        }
        else {
          setSnackbar({
            message: res.data.message,
            severity: "error",
            open: true
          })
        }
      } else {
        const res = await axios.post(`${baseUrl}/v1/api/masterDropDown/add`,
          { name: dropDownName },
          { headers: { 'Content-Type': 'application/json', authorization: token } }
        );
        if (res.data.status) {
          setSnackbar({
            message: res.data.message,
            severity: "success",
            open: true
          })
          fetchData();
        }
        else {
          setSnackbar({
            message: res.data.message,
            severity: "error",
            open: true
          })
        }
      }

    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        message: error.message,
        severity: "error",
        open: true
      })
    } finally {
      setAddDD(false);
      setDropDown('');
      setEditID('');
    }
  };

  const fetchDropOptions = async () => {
    if (!token || !selectedRow) return;
    try {
      const res = await axios.get(
        `${baseUrl}/v1/api/masterDropDown/subDropDown/getList?status=${dropdownStatus}&name=${selectedRow.name}`,
        { headers: { 'Content-Type': 'application/json', authorization: token } }
      );
      setDropDownOptions(res.data.items?.map(i => ({
        ...i,
        status: i.status === "active" ? true : false
      })));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleOptionActivity = async (id, isActive) => {
    if (!token) return;
    try {
      const res = await axios.post(
        `${baseUrl}/v1/api/masterDropDown/subDropDown/activeAndInactive?id=${id}&status=${isActive === true ? "active" : "inactive"}`,
        {},
        { headers: { 'Content-Type': 'application/json', authorization: token } }
      );
      if (res.data.status) {
        setSnackbar({
          message: res.data.message,
          severity: "success",
          open: true
        })
        fetchDropOptions()
      }
      else {
        setSnackbar({
          message: res.data.message,
          severity: "error",
          open: true
        })
      }

    } catch (error) {
      console.error('Error updating status:', error);
      setSnackbar({
        message: error.message,
        severity: "error",
        open: true
      })
    }
  };

  useEffect(() => {
    if (selectedRow) fetchDropOptions();
  }, [selectedRow, token, dropdownStatus]);

  const handleEdit = (row) => {
    setDropDown(row.name);
    setAddDD(true);
    setEditID(row._id);
  };

  const handleAddOption = async () => {
    if (!token || !selectedRow) return;
    try {
      const payload = { dropDownId: selectedRow._id, name: newOptionName.trim() };
      const res = await axios.post(`${baseUrl}/v1/api/masterDropDown/subDropDown/add`, payload,
        { headers: { 'Content-Type': 'application/json', authorization: token } });
      if (res.data.status) {
        setSnackbar({
          message: res.data.message,
          severity: "success",
          open: true
        })
        fetchDropOptions();
        setAddOptionModalOpen(false);
        setNewOptionName('');
      }
      else {
        setSnackbar({
          message: res.data.message,
          severity: "error",
          open: true
        })
      }
    } catch (error) {
      setSnackbar({
        message: error.message,
        severity: "error",
        open: true
      })
      console.error('Error adding option:', error);
    }
  };

  const handleEditOption = (option) => {
    setEditOptionData(option);
    setEditOptionModalOpen(true);
  };

  const handleUpdateOption = async () => {
    if (!token || !selectedRow || !editOptionData) return;
    try {
      await axios.post(`${baseUrl}/v1/api/masterDropDown/subDropDown/update`,
        {
          dropDownId: selectedRow._id,
          name: editOptionData.name,
          subDropDownId: editOptionData._id,
        },
        { headers: { 'Content-Type': 'application/json', authorization: token } });
      if (res.data.status) {
        setSnackbar({
          message: res.data.message,
          severity: "success",
          open: true
        })
        fetchDropOptions();
        setEditOptionModalOpen(false);
        setEditOptionData(null);
      }
      else {
        setSnackbar({
          message: res.data.message,
          severity: "error",
          open: true
        })
      }

    } catch (error) {
      setSnackbar({
        message: error.message,
        severity: "error",
        open: true
      })
      console.error('Error updating option:', error);
    }
  };

  const handleDeleteOption = async (optionId) => {
    if (!token) return;
    try {
      await axios.delete(`${baseUrl}/v1/api/masterDropDown/subDropDown/delete/${optionId}`,
        { headers: { 'Content-Type': 'application/json', authorization: token } });
      fetchDropOptions();
    } catch (error) {
      console.error('Error deleting option:', error);
    }
  };

  const columns = [
    {
      field: 'id',
      headerName: 'No.',
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%", justifyContent: "center" }}>
          <Typography fontSize={14}>
            {params.api.getAllRowIds().indexOf(params.id) + 1}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'name',
      headerName: 'Drop-Down Name',
      width: 280,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%", justifyContent: "center" }}>
          <Typography
            sx={{ textTransform: 'capitalize' }}
          >
            {params.row.name}
          </Typography>
        </Box>
      ),
    }

  ];

  return (
    <Container maxWidth="xl">


      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        {/* Animated Background */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: '200px',
            height: '200px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-20px)' }
            }
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* <DashboardIcon sx={{ fontSize: 40, color: "white" }} /> */}
              <ExpandMoreIcon sx={{ fontSize: 32, color: 'white' }} />
            </Box>
            <Box>
              <Typography fontSize={19} color='white' fontWeight='bold' gutterBottom mt={1}>
                Master Drop-Down
              </Typography>

            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>

            <Button
              sx={{ borderRadius: '25px' }}
              color='white'
              variant='outlined'
              onClick={() => router.push('/employeeSetup')}
            >
              <KeyboardBackspaceIcon />
            </Button>
          </Box>
        </Box>
      </Paper>


      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Paper sx={{ flexGrow: 1, minWidth: 0 }}>
              <DataGrid
                rows={rows}
                columns={columns}
                autoHeight
                getRowId={(row) => row._id}
                onRowClick={(params) => setSelectedRow(params.row)}
                disableRowSelectionOnClick
                sx={{
                  '& .MuiDataGrid-cell': { py: 1, fontSize: 13 },
                  '& .MuiDataGrid-row:hover': { backgroundColor: '#f5f5f5' },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f0f0f0',
                    fontWeight: 'bold',
                  },
                  border: 'none',
                  fontFamily: 'Inter, sans-serif',
                }}
              />
            </Paper>
          </Box>
        </Grid>

        <Grid item xs={12} md={1} display="flex" justifyContent="center" alignItems="center">
          <ArrowRight sx={{ fontSize: 40 }} />
        </Grid>



        <Grid item xs={12} md={6}>
          {selectedRow ? (
            <Collapse in={!!selectedRow} timeout={400} unmountOnExit>
              <Paper elevation={3} sx={{ p: 8, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    {selectedRow?.name?.toUpperCase()}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    {/* <IconButton color="primary" onClick={() => handleEdit(selectedRow)}>
   <EditIcon />
 </IconButton> */}
                    <Switch
                      checked={selectedRow?.status ?? false}
                      onChange={(e) => handleActivity(selectedRow._id, e.target.checked)}
                      color="primary"
                    />
                    <Button variant="contained" size="small" onClick={() => setAddOptionModalOpen(true)}>
                      Add Option
                    </Button>
                  </Box>

                </Box>

                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 2 }}>
                  <Typography variant="body1" fontWeight={500} gutterBottom>
                    Drop-Down Options
                  </Typography>
                  <TextField
                    select
                    label="Status"
                    size="small"
                    value={dropdownStatus}
                    onChange={(e) =>
                      setDropDownStatus(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        width: 200,
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

                    <MenuItem value="active">
                      Active
                    </MenuItem>
                    <MenuItem value="inactive">
                      In-Active
                    </MenuItem>

                  </TextField>
                </Box>

                {dropDownOptions?.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">No options available.</Typography>
                ) : (
                  <Stack spacing={1} mt={1}>
                    {dropDownOptions?.map((option) => (
                      <Box key={option._id} display="flex" justifyContent="space-between" alignItems="center">
                        <Typography fontSize={15}>{option.name}</Typography>
                        <Box>
                          <IconButton onClick={() => handleEditOption(option)} color="primary" size="small">
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <Switch
                            checked={option?.status ?? false}
                            onChange={(e) => handleOptionActivity(option._id, e.target.checked)}
                            color="primary"
                          />
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Paper>
            </Collapse>
          ) : (
            <Paper
              elevation={2}
              sx={{
                p: { xs: 4, sm: 6, md: 8 },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                minHeight: 300,
              }}
            >
              <Box mb={2} mt={{ xs: 10, sm: 15, md: 20 }}>
                <Lottie animationData={Animation} style={{ height: 200 }} />
              </Box>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                Select a drop-down from the list
              </Typography>
              <Typography variant="h6" color="text.disabled">
                You'll see the associated options here once you select a drop-down.
              </Typography>
            </Paper>

          )}
        </Grid>
      </Grid>

      {/* Add/Edit Drop-Down Modal */}
      <Modal open={addDD} onClose={() => setAddDD(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>{editId ? 'Edit Drop-Down' : 'Add Drop-Down'}</Typography>
          <TextField fullWidth size="small" label="Drop-Down Name" value={dropDownName} onChange={(e) => setDropDown(e.target.value)} />
          <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
            <Button variant="contained" onClick={handleSubmit} disabled={!dropDownName.trim()}>{editId ? 'Update' : 'Add'}</Button>
            <Button variant="outlined" onClick={() => setAddDD(false)}>Cancel</Button>
          </Box>
        </Box>
      </Modal>

      {/* Add Option Modal */}
      <Modal open={addOptionModalOpen} onClose={() => setAddOptionModalOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>Add Option</Typography>
          <TextField fullWidth size="small" label="Option Name" value={newOptionName} onChange={(e) => setNewOptionName(e.target.value)} />
          <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
            <Button variant="contained" onClick={handleAddOption} disabled={!newOptionName.trim()}>Add</Button>
            <Button variant="outlined" onClick={() => setAddOptionModalOpen(false)}>Cancel</Button>
          </Box>
        </Box>
      </Modal>

      {/* Edit Option Modal */}
      <Modal open={editOptionModalOpen} onClose={() => setEditOptionModalOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>Edit Option</Typography>
          <TextField fullWidth size="small" label="Option Name" value={editOptionData?.name || ''} onChange={(e) => setEditOptionData(prev => ({ ...prev, name: e.target.value }))} />
          <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
            <Button variant="contained" onClick={handleUpdateOption} disabled={!editOptionData?.name.trim()}>Update</Button>
            <Button variant="outlined" onClick={() => setEditOptionModalOpen(false)}>Cancel</Button>
          </Box>
        </Box>
      </Modal>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MasterDropDownList;

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};