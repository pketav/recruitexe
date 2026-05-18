'use client';

import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Typography,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  Edit,
  Call,
  MailOutline,
  LocationOn,
  LinkedIn,
  GitHub,
  School,
  Link as LinkIcon,
  Home,
  Business,
  PictureAsPdf, Wc
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';

const LabelPair = ({ label, value }) => (
  <Box mb={6}>
    <Typography fontSize={14} color="#8E8E93" mb={2}>
      {label}
    </Typography>
    <Typography fontSize={15} fontWeight={500} color="#101828">
      {value}
    </Typography>
  </Box>
);


const SectionCard = ({ icon, title, children }) => (
  <Card variant="outlined" sx={{ borderRadius: 3 }}>
    <CardContent sx={{ p: 2 }}>
      <Box display="flex" alignItems="center" mb={1}>
        {icon}
        <Typography fontSize={14} fontWeight={600} ml={1}>{title}</Typography>
      </Box>
      {children}
    </CardContent>
  </Card>
);

export default function ExactProfileReplica() {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [profileData, setProfileData] = useState({});
  const token = typeof window !== 'undefined' ? window.localStorage.getItem("authToken") : null;

  const getCandidateProfile = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/Auth/viewprofile`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        }
      });
      if (res.data.status) setProfileData(res.data.items);
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    getCandidateProfile();
  }, []);

  const formatDate = (date) => {
    const parsed = new Date(date);
    return isNaN(parsed) ? '—' : parsed.toISOString().split('T')[0];
  };

  const {
    profilePicture, userName, email, mobileNumber, profile_Info = {},
    jobPreferences = {}, skills = [], languagesKnown = [],
    currentCTC, expectedSalary, summary, professional_Experience = [],
    education = [], resume, profileCompletionPercentage = 0
  } = profileData;

  return (
    <Container maxWidth="xl" sx={{ my: 4 }}>
      <Card
        sx={{
          borderRadius: 5,
          boxShadow: 2,
          p: 3,
        }}
      >
        <Grid container alignItems="center" spacing={2}>
          {/* Profile Picture */}
          <Grid item xs={12} sm={2} display="flex" justifyContent="center">
            <Avatar
              src={profilePicture}
              sx={{ width: 100, height: 100, borderRadius: 2 }}
            />
          </Grid>

          {/* User Info */}
          <Grid item xs={12} sm={3}>
            <Typography fontSize={18} fontWeight={700} color="#101828">
              {userName}
            </Typography>
            <Typography fontSize={14} color="#9E9E9E" mt={0.5}>
              UI/UX Designer
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <Wc fontSize="small" sx={{ color: "#3F51B5" }} />
              <Typography fontSize={14} color="#3F51B5">
                {profile_Info.gender}
              </Typography>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={4}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Call fontSize="small" sx={{ color: "#9E9E9E" }} />
              <Typography fontSize={14} color="#9E9E9E">
                {mobileNumber}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <MailOutline fontSize="small" sx={{ color: "#9E9E9E" }} />
              <Typography fontSize={14} color="#9E9E9E">
                {email}
              </Typography>
            </Box>
            <Box display="flex" alignItems="flex-start" gap={1}>
              <LocationOn fontSize="small" sx={{ color: "#9E9E9E", mt: "2px" }} />
              <Typography fontSize={14} color="#9E9E9E">
                {profile_Info.address1}, {profile_Info.city}
              </Typography>
            </Box>
          </Grid>

          {/* Blue Progress Box */}
          <Grid item xs={12} sm={3}>
            <Box
              sx={{
                backgroundColor: "#1A237E",
                borderRadius: 2,
                color: "#fff",
                px: 3,
                py: 2,
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography fontSize={13} fontWeight={600} sx={{ color: "#fff" }}>
                  Almost There! Update Your Profile
                </Typography>
                <EditIcon sx={{ color: "#fff", fontSize: 18 }} />
              </Box>
              <Box display="flex" alignItems="center" gap={2} mt={1}>
                <LinearProgress
                  variant="determinate"
                  value={profileCompletionPercentage}
                  sx={{
                    height: 6,
                    flex: 1,
                    borderRadius: 5,
                    backgroundColor: "rgba(255,255,255,0.3)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#00B8D4",
                    },
                  }}
                />
                <Typography fontSize={14} fontWeight={600} color="#00B8D4">
                  {Math.round(profileCompletionPercentage)}%
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Card>



      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 4, p: 6 }}>
            {/* Section Header */}
            <Box display="flex" alignItems="center" gap={4} mb={2}>
              <Box
                sx={{
                  backgroundColor: "rgba(63,81,181,0.08)",
                  borderRadius: 2,
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 1,
                }}
              >
                <School fontSize="large" sx={{ color: "#1A237E" }} />
              </Box>
              <Typography fontWeight={500} fontSize={17} color="#1A237E">
                Academic Details
              </Typography>
            </Box>

            {/* Education Details */}
            {education.length > 0 && (
              <Grid container spacing={7}>
                {/* Left Column */}
                <Grid item xs={6}>
                  <LabelPair label="Education Type" value={education[0].educationType} />
                  <LabelPair label="Degree" value={education[0].degree} />
                  <LabelPair label="Description" value={education[0].description} />
                  <LabelPair label="University" value={education[0].university} />
                  <LabelPair label="Percentage/CGPA" value={`${education[0].finalScore}%`} />
                </Grid>

                {/* Right Column */}
                <Grid item xs={6}>
                  <Typography fontWeight={600} fontSize={15} color="#101828" mb={2}>
                    Timeline & Location
                  </Typography>
                  <LabelPair label="Country" value={education[0].country} />
                  <LabelPair label="State" value={education[0].state} />
                  <LabelPair label="City" value={education[0].city} />
                  <LabelPair label="Year Of Passing" value={education[0].yearOfPassing} />
                  <LabelPair label="Start Date" value={formatDate(education[0].startDate)} />
                  <LabelPair label="End Date" value={formatDate(education[0].endDate)} />
                </Grid>
              </Grid>
            )}
          </Card>
        </Grid>


        <Grid item xs={12} md={6.5}>
          <Card variant="outlined" sx={{ borderRadius: 3, height: "72px" }}>
            <CardContent sx={{ p: 4, display: "flex", justifyContent: "space-between" }}>
              <Box display="flex" alignItems="center" gap={4}>
                <Box
                  sx={{
                    backgroundColor: "rgba(63,81,181,0.08)",
                    borderRadius: 2,
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 1,
                  }}
                >
                  <LinkIcon fontSize="medium" sx={{ color: "#1A237E" }} />
                </Box>
                <Typography fontWeight={500} fontSize={16} color="#1A237E">
                  Social Media Links
                </Typography>
              </Box>
              <Box display="flex" gap={3}><LinkedIn fontSize="large" sx={{ color: '#00B8D4' }} /><GitHub fontSize="large" sx={{ color: "black" }} /></Box>
            </CardContent>
          </Card>
          <Box mt={3}>
            <Card variant="outlined" sx={{ borderRadius: 3, height: "72px" }}>
              <CardContent sx={{ p: 4, display: "flex", justifyContent: "space-between" }}>
                <Box display="flex" alignItems="center" gap={4}>
                  <Box
                    sx={{
                      backgroundColor: "rgba(63,81,181,0.08)",
                      borderRadius: 2,
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 1,
                    }}
                  >
                    <Home fontSize="medium" sx={{ color: "#1A237E" }} />
                  </Box>
                  <Typography fontWeight={500} fontSize={16} color="#1A237E">
                    Address Details
                  </Typography>
                </Box>

                <LabelPair label="Address Line 01" value={profile_Info.address1} />
                <LabelPair label="Address Line 02" value={profile_Info.address2} />
                <LabelPair label="Country" value={profile_Info.country} />
                <LabelPair label="City" value={profile_Info.city} />
                <LabelPair label="State" value={profile_Info.state} />
                <LabelPair label="Pin code" value={profile_Info.pincode} />

              </CardContent>
            </Card>
          </Box>

        </Grid>

        <Grid item xs={12} md={4}>
          <SectionCard icon={<Business fontSize="small" />} title="Job Details">
            {professional_Experience.length > 0 && (
              <>
                <LabelPair label="Current Employer" value={professional_Experience[0].title} />
                <LabelPair label="Organization" value={professional_Experience[0].organization} />
                <Divider sx={{ my: 1 }} />
                <Typography fontWeight={600} fontSize={13} mb={1}>Timeline & Location</Typography>
                <LabelPair label="Country" value={professional_Experience[0].country} />
                <LabelPair label="State" value={professional_Experience[0].state} />
              </>
            )}
          </SectionCard>
        </Grid>
      </Grid>

      {resume && (
        <Box mt={4} display="flex" alignItems="center" gap={1} onClick={() => window.open(resume, '_blank')} sx={{ cursor: 'pointer' }}>
          <Typography fontSize={16} fontWeight={700}>Resume:</Typography>
          <PictureAsPdf color="error" fontSize="large" />
        </Box>
      )}
    </Container>
  );
}