'use client'

import { Container, Box, IconButton, Button, Typography, Modal, TextField, Grid,Snackbar,Alert } from '@mui/material'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { DataGrid } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function CostCenter() {
  const token = window.localStorage.getItem("authToken");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [costCenter, setCostCenter] = useState([]);
  const router = useRouter();
  const [addModal, setAddModal] = useState(false);
  const [typeTitle, setTypeTitle] = useState({ name: "" });
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [snackbar, setSnackbar] = useState({
      open: false,
      message: '',
      severity: 'success'
  })
  const handleCloseSnackbar = () => {
      setSnackbar({ ...snackbar, open: false })
  }

  const getCostCenter = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/costcenter/getAllCostCenter`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      });

      const formatted = res.data.items.map(item => ({
        id: item._id,
        name: item.title,
        createdAt: item.createdAt || "-",
        status: item.status
      }));

      setCostCenter(formatted.filter(i => i.status === "active"));
    } catch (error) {
      console.error("Error fetching cost centers:", error);
    }
  };

  useEffect(() => {
    getCostCenter();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.post(`${baseUrl}/v1/api/costcenter/deleteCostCenter?id=${id}`,{
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      });
      if(res.data.status){
        getCostCenter();
        setSnackbar({
          open:true,
          severity:'success',
          message:res.data.message
        })
      }else{
        setSnackbar({
          open:true,
          severity:'error',
          message:res.data.message
        })
      }

    } catch (error) {
      console.error("Error deleting cost center:", error);
      setSnackbar({
        open:true,
        severity:'error',
        message:error.message
      })
    }
  };

  const handleEdit = (row) => {
    setEditData({
      costCenterId: row.id,
      name: row.name
    });
    setEditModal(true);
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Cost Center Title',
      width: 350,
      align: 'center',
      headerAlign: "center"
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 350,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const dateStr = params.row?.createdAt;
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? "-" : date.toLocaleString('en-IN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 400,
      align: "center",
      headerAlign: 'center',
      renderCell: (params) => (
        <Box>
          <IconButton color='primary' onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color='primary' onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ];

  const handleSubmit = async () => {
    try {
      await axios.post(`${baseUrl}/v1/api/costcenter/costCenterAdd`, {
        title: typeTitle.name,
      }, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      });
      if(res.data.status){
        setSnackbar({
          open:true,
          severity:'success',
          message:res.data.message
        })
      getCostCenter();
      setAddModal(false);
      setTypeTitle({ name: "" });}
      else{
        setSnackbar({
          open:true,
          severity:'error',
          message:res.data.message
        })
      }
    } catch (error) {
      setSnackbar({
        open:true,
        severity:'error',
        message:error.message
      })
      console.error("Error adding cost center:", error);
    }
  };

  const handleSubmitEdit = async () => {
    try {
      await axios.post(`${baseUrl}/v1/api/costcenter/updateCostCenter`, {
        ...editData,
        title: editData.name
      }, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      });
      if(res.data.status){
        setSnackbar({
          open:true,
          severity:'success',
          message:res.data.message
        })
        getCostCenter();
        setEditModal(false);
      }
      else{
        setSnackbar({
          open:true,
          severity:'error',
          message:res.data.message
        })
      }

    } catch (error) {
      setSnackbar({
        open:true,
        severity:'error',
        message:error.message
      })
      console.error("Error updating cost center:", error);
    }
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ mb: 4 }}>
          <Typography fontSize={20} fontWeight={600}>
            Cost Center
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 4 }}>
          <Button variant='contained' size='small' onClick={() => setAddModal(true)}>Add Cost Center</Button>
          <Button variant='outlined' size='small' onClick={() => router.push("/employeeSetup")}>Back</Button>
        </Box>
      </Box>

      <Box style={{ height: 650, width: '100%' }}>
        <DataGrid
          rows={costCenter}
          columns={columns}
          pageSize={5}
          getRowId={(row) => row.id}
          rowsPerPageOptions={[5]}
        />
      </Box>

      {/* Add Modal */}
      <Modal open={addModal} onClose={() => setAddModal(false)}>
        <Box sx={modalStyle}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography fontSize={16} fontWeight={500}>Add Cost Center</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Cost Center Title'
                name='name'
                size='small'
                value={typeTitle.name}
                onChange={(e) => setTypeTitle({ ...typeTitle, name: e.target.value })}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", gap: 3, justifyContent: "flex-end" }}>
              <Button variant='outlined' color='secondary' onClick={() => setAddModal(false)}>Cancel</Button>
              <Button type='submit' variant='contained' color='primary' onClick={handleSubmit}>Submit</Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      {/* Edit Modal */}
      <Modal open={editModal} onClose={() => setEditModal(false)}>
        <Box sx={modalStyle}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography fontSize={16} fontWeight={500}>Edit Cost Center</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Cost Center Title"
                name="name"
                size="small"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", gap: 3, justifyContent: "flex-end" }}>
              <Button variant='outlined' color='secondary' onClick={() => setEditModal(false)}>Cancel</Button>
              <Button type='submit' variant='contained' color='primary' onClick={handleSubmitEdit}>Submit</Button>
            </Grid>
          </Grid>
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
}

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};
