'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Grid,
  Button,
  MenuItem,
  Box
} from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const dateFormats = ['YYYYMM', 'YYMM', 'YYYY-MM', 'YY-MM'];

export default function IDSetup() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [empId, setEmpID] = useState({
    employeIdPrefix: '',
    employeIdSuffix: '',
    employeIdCounter: 0,
    employeIdUseDate: false,
    employeIdDateFormat: 'YYYYMM',
    employeIdUseRandom: false,
    employeIdRandomLength: 3,
    employeIdPadLength: 5,
  });
  const router = useRouter()

  const getEmpIdSetup = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/setting/get`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      });
      setEmpID(res.data.items);
    } catch (error) {
      console.error('Error fetching ID setup:', error);
    }
  };

  const handleUpdate = async () => {
    try {
        const { _id, __v, ...sanitizedPayload } = empId;

      await axios.post(`${baseUrl}/v1/api/setting/update`, sanitizedPayload , {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      });
     getEmpIdSetup()
    } catch (error) {
      console.error('Error updating ID setup:', error);
      alert('Failed to update settings.');
    }
  };

  useEffect(() => {
    getEmpIdSetup();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card>
        <CardContent>
            <Box sx={{display:"flex", justifyContent:"space-between", mb:4}}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
            Employee ID Setup
          </Typography>
         <Button variant='outlined'size='small' onClick={()=>router.push("/employeeSetup")}>Back</Button>
            </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prefix"
                value={empId.employeIdPrefix}
                onChange={(e) => setEmpID({ ...empId, employeIdPrefix: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Suffix"
                value={empId.employeIdSuffix}
                onChange={(e) => setEmpID({ ...empId, employeIdSuffix: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Starting Counter"
                value={empId.employeIdCounter}
                onChange={(e) =>
                  setEmpID({ ...empId, employeIdCounter: Number(e.target.value) })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Pad Length"
                value={empId.employeIdPadLength}
                onChange={(e) =>
                  setEmpID({ ...empId, employeIdPadLength: Number(e.target.value) })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={empId.employeIdUseDate}
                    onChange={(e) =>
                      setEmpID({ ...empId, employeIdUseDate: e.target.checked })
                    }
                  />
                }
                label="Use Date in ID"
              />
            </Grid>
            {empId.employeIdUseDate && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Date Format"
                  value={empId.employeIdDateFormat}
                  onChange={(e) =>
                    setEmpID({ ...empId, employeIdDateFormat: e.target.value })
                  }
                >
                  {dateFormats.map((format) => (
                    <MenuItem key={format} value={format}>
                      {format}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={empId.employeIdUseRandom}
                    onChange={(e) =>
                      setEmpID({ ...empId, employeIdUseRandom: e.target.checked })
                    }
                  />
                }
                label="Use Random Numbers"
              />
            </Grid>
            {empId.employeIdUseRandom && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Random Length"
                  value={empId.employeIdRandomLength}
                  onChange={(e) =>
                    setEmpID({ ...empId, employeIdRandomLength: Number(e.target.value) })
                  }
                />
              </Grid>
            )}
          </Grid>

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={handleUpdate}
          >
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
