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

export default function CandidateIDSetup() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [candidateId, setCandidateID] = useState({
    candidateIdPrefix: '',
    candidateIdSuffix: '',
    candidateIdCounter: 0,
    candidateIdUseDate: false,
    candidateIdDateFormat: 'YYYYMM',
    candidateIdUseRandom: false,
    candidateIdRandomLength: 3,
    candidateIdPadLength: 5,
  });
  const router = useRouter()

  const getCandidateIdSetup = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/setting/getcandidate`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      });
      setCandidateID(res.data.items);
    } catch (error) {
      console.error('Error fetching ID setup:', error);
    }
  };

  const handleUpdate = async () => {
    try {
        const { _id, __v, ...sanitizedPayload } = candidateId;

      await axios.post(`${baseUrl}/v1/api/setting/updatesetting`, sanitizedPayload , {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      });
      getCandidateIdSetup()
    } catch (error) {
      console.error('Error updating ID setup:', error);
      alert('Failed to update settings.');
    }
  };

  useEffect(() => {
    getCandidateIdSetup();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card>
        <CardContent>
            <Box sx={{display:"flex", justifyContent:"space-between", mb:4}}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
            Candidate ID Setup
          </Typography>
         <Button variant='outlined'size='small' onClick={()=>router.push("/employeeSetup")}>Back</Button>
            </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prefix"
                value={candidateId.candidateIdPrefix}
                onChange={(e) => setCandidateID({ ...candidateId, candidateIdPrefix: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Suffix"
                value={candidateId.candidateIdSuffix}
                onChange={(e) => setCandidateID({ ...candidateId, candidateIdSuffix: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Starting Counter"
                value={candidateId.candidateIdCounter}
                onChange={(e) =>
                  setCandidateID({ ...candidateId, candidateIdCounter: Number(e.target.value) })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Pad Length"
                value={candidateId.candidateIdPadLength}
                onChange={(e) =>
                  setCandidateID({ ...candidateId, candidateIdPadLength: Number(e.target.value) })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={candidateId.candidateIdUseDate}
                    onChange={(e) =>
                      setCandidateID({ ...candidateId, candidateIdUseDate: e.target.checked })
                    }
                  />
                }
                label="Use Date in ID"
              />
            </Grid>
            {candidateId.candidateIdUseDate && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Date Format"
                  value={candidateId.candidateIdDateFormat}
                  onChange={(e) =>
                    setCandidateID({ ...candidateId, candidateIdDateFormat: e.target.value })
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
                    checked={candidateId.candidateIdUseRandom}
                    onChange={(e) =>
                      setCandidateID({ ...candidateId, candidateIdUseRandom: e.target.checked })
                    }
                  />
                }
                label="Use Random Numbers"
              />
            </Grid>
            {candidateId.candidateIdUseRandom && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Random Length"
                  value={candidateId.candidateIdRandomLength}
                  onChange={(e) =>
                    setCandidateID({ ...candidateId, candidateIdRandomLength: Number(e.target.value) })
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
