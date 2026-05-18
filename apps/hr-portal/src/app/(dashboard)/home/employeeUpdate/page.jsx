'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Container, Typography,Grid, Button, TextField, Divider, MenuItem, Box,Card, CardContent, CardMedia, Snackbar, Alert } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { PictureAsPdf } from '@mui/icons-material'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

export default function EmployeeUpdate() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const [empData, setEmpData] = useState({})
    const router = useRouter()
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
        })
    const [submitted, setSubmitted] = useState(false)
    const [formData, setFormData] = useState({
        mobileNo: '',        
        emergencyNumber: '',     
        identityMark: '',       
        height: '',         
        caste: '',        
        category: '',       
        religion: '',       
        bloodGroup: '',        
        homeDistrict: '',        
        homeState: '',          
        nearestRailwaySt: '',     
        joiningDate: '', 
        dateOfBirth: '',           
        fatherName: '',             
        motherName: '',              
        fathersOccupation: '',        
        fathersMobileNo: '', 
        mothersMobileNo: '', 
        familyIncome: '', 
        gender: '',    
        salutation: '',    
        maritalStatus: '',      
        package: '',
        nameAsPerBank: '',      
        bankName: '',        
        bankAccount: '',     
        ifscCode: '',         
        highestQualification: '',       
        university: '',           
        employeePhoto: '',         
        resume: '',       
        aadhar: '',       
        panCard: '',       
        educationCertification: '',     
        experienceLetter: '',         
        employmentProof: '',        
        bankDetails: '',          
        offerLetter: '',         
        aadhaarNo: '',        
        panNo: '',          
        currentAddress: '',          
        currentAddressCity: '',        
        currentAddressState: '',        
        currentAddressPincode: '',    
        permanentAddress: '',
        permanentAddressCity: '',        
        permanentAddressState: '',
        permanentAddressPincode: '',       
        description: '',              
        company: '',         
        location: {   
          type: 'Point',     
          coordinates: ['', '']      
        },              
        websiteListing: '',
        onboardingStatus: 'joining',     
        letter: '',
        appoinmentLetter: '',
        employeementHistory: [       
          {
            currentDesignation: '',
            lastOrganization: '',
            startDate: '',
            endDate: '',
            totalExperience: '',
            currentCTC: ''
          }
        ],
        educationDetails: [      
          {
            education: '',
            nameOfBoard: '',
            marksObtained: '',
            passingYear: '',
            stream: '',
            grade: ''
          }
        ],
        nominee: [       
          {
            nomineeName: '',
            relationWithEmployee: '',
            nominationType: '',
            nominationAge: '',
            nomineeAddress: '',
            nomineeState: '',
            nomineeDistrict: '',
            nomineeblock: '',
            nomineePanchayat: '',
            nomineePincode: '',
            nomineePhoneNumber: ''
          }
        ],
        employeeTarget: [
          {
            title: '',
            value: ''
          }
        ]
      });      
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
     const getEmpDetail = async () => {
        try {
          const res = await axios.get(`${baseUrl}/v1/api/Auth/getEmployeeById/${id}`, {
            headers: {
              'Content-Type': 'application/json',
              authorization: token,
            },
          });
          const empData = res.data.items;
    
          setFormData(prevFormData => ({
            ...prevFormData,
            mobileNo: empData.mobileNo,
            company: empData.company,
            employeePhoto: empData.employeePhoto,
            onboardingStatus: empData.onboardingStatus,
            workEmail: empData.workEmail,
            currentAddress: empData.currentAddress || '',
            permanentAddress: empData.permanentAddress || '',
            employeementHistory: empData.employeementHistory && empData.employeementHistory.length > 0 ? empData.employeementHistory : [{ jobTitle: '', company: '', startDate: '', endDate: '' }],
            educationDetails: empData.educationDetails && empData.educationDetails.length > 0 ? empData.educationDetails : [{ education: '', nameOfBoard: '', marksObtained: '', passingYear: '', stream: '', grade: '' }],
          }));
        } catch (error) {
          console.error('Error fetching ID setup:', error);
        }
      };
      const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false })
      }
    
    const [companies, setCompanies] = useState([]);
      const getCompany = async () => {
        try {
          const res = await axios.get(`${baseUrl}/v1/api/company/get`, {
            headers: {
              'Content-Type': 'application/json',
              authorization: token
            }
          });
          setCompanies(res.data.items);
        } catch (error) {
          console.error('Error fetching companies:', error);
        }
      };
    
    
      useEffect(()=>{
        getEmpDetail();
        getCompany()
      },[id])

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: value
        }));
      };

      const handleLocationChange = (index, value) => {
        const updatedCoords = [...formData.location.coordinates];
        updatedCoords[index] = value;
        setFormData((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            coordinates: updatedCoords,
          },
        }));
      };      

      const handleEducationChange = (index, field, value) => {
        const updated = [...formData.educationDetails];
        updated[index][field] = value;
        setFormData({ ...formData, educationDetails: updated });
      };
      
      const handleAddEducation = () => {
        setFormData({
          ...formData,
          educationDetails: [
            ...formData.educationDetails,
            {
              education: '',
              nameOfBoard: '',
              marksObtained: '',
              passingYear: '',
              stream: '',
              grade: '',
            },
          ],
        });
      };

    const handleRemoveEducation = (index) => {
        const updated = formData.educationDetails.filter((_, i) => i !== index);
        setFormData({ ...formData, educationDetails: updated });
    };

    const handleEmploymentChange = (index, field, value) => {
        const updated = [...formData.employeementHistory];
        updated[index][field] = value;
        setFormData({ ...formData, employeementHistory: updated });
      };
      
      const handleAddEmployment = () => {
        setFormData({
          ...formData,
          employeementHistory: [
            ...formData.employeementHistory,
            {
              currentDesignation: '',
              lastOrganization: '',
              startDate: '',
              endDate: '',
              totalExperience: '',
              currentCTC: '',
            },
          ],
        });
      };
      
      const handleRemoveEmployment = (index) => {
        const updated = formData.employeementHistory.filter((_, i) => i !== index);
        setFormData({ ...formData, employeementHistory: updated });
      };

      const handleNomineeChange = (index, field, value) => {
        const updated = [...formData.nominee];
        updated[index][field] = value;
        setFormData({ ...formData, nominee: updated });
      };
      
      const handleAddNominee = () => {
        setFormData({
          ...formData,
          nominee: [
            ...formData.nominee,
            {
              nomineeName: '',
              relationWithEmployee: '',
              nominationType: '',
              nominationAge: '',
              nomineeAddress: '',
              nomineeState: '',
              nomineeDistrict: '',
              nomineeblock: '',
              nomineePanchayat: '',
              nomineePincode: '',
              nomineePhoneNumber: ''
            },
          ],
        });
      };
      
      const handleRemoveNominee = (index) => {
        const updated = formData.nominee.filter((_, i) => i !== index);
        setFormData({ ...formData, nominee: updated });
      };
      

      const handleFileUpload = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;
      
        const formDataObj = new FormData();
        formDataObj.append('file', file);
      
        try {
          const res = await axios.post(`${baseUrl}/v1/api/upload/uploadSingle`, formDataObj, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
      
          const { url } = res.data;
      
          if (url) {
            setFormData((prev) => ({
              ...prev,
              [field]: url,
            }));
          } else {
            console.error('No URL returned from upload');
          }
        } catch (err) {
          console.error('File upload error:', err);
        }
      };
      
      
      const handleSubmit = async () => {
        setSubmitted(true)
        const isLocationInvalid = !formData.location.coordinates[0] || !formData.location.coordinates[1];
        if (isLocationInvalid) {
              setSnackbar({
                  open: true,
                  message: 'Please fill all required fields and upload necessary documents before submitting.',
                  severity: 'error'
                })
            return;
          }
      
        try {
          const res = await axios.post(`${baseUrl}/v1/api/Auth/emplyee/updateEmployeeById/${id}`, {
            ...formData,
            _id:id
          }, {
            headers: {
              'Content-Type': 'application/json',
              authorization: token,
            },
          });
      
          if (res.data.status) {
            setSnackbar({
                open: true,
                message: res.data.message,
                severity: 'success'
              })
          }
        } catch (err) {
          console.error('Submission error:', err);
        }
      };

  return (
    <Container maxWidth='xl'>
        <Box sx={{display:'flex', justifyContent:"space-between"}}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <AssignmentIndIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h5" fontWeight={700} color="primary">
            Update Employee
        </Typography>        </Box>
        <Button variant='outlined' size='small' onClick={()=>router.push("/home")}>Back</Button></Box>

        <Grid container spacing={3} sx={{mt:2}}>
        <Grid item xs={12} sx={{mt:2}}><Typography fontSize={16} color="black" fontWeight={600}>Employee Basic Details</Typography><Divider /></Grid>
        <Grid item xs={12} sm={6} md={4}><TextField label="Aadhar Number" size='small' type='number' name="aadhaarNo" value={formData.aadhaarNo} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={12} sm={6} md={4}><TextField label="Pan Number" size='small' name="panNo" value={formData.panNo} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={12} sm={6} md={4}><TextField label="Name as per Bank" size='small' name="nameAsPerBank" value={formData.nameAsPerBank} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={12} sm={6} md={4}>
        <TextField
            label="Salutation"
            fullWidth
            select
            size="small"
            name="salutation"
            value={formData.salutation}
            onChange={handleChange}
            >
            {['Mr.','Mrs.','Miss'].map(i=>
            <MenuItem key={i} value={i}>{i}</MenuItem>
            )}
        </TextField>            
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
        <TextField
            label="Gender"
            fullWidth
            select
            size="small"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            >
            {['Male','Female','Other'].map(i=>
            <MenuItem key={i} value={i}>{i}</MenuItem>
            )}
        </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
            <TextField label="Marital Status" size="small" name="maritalStatus" select value={formData.maritalStatus} onChange={handleChange} fullWidth>
            {['Single','Married'].map(i=>
            <MenuItem key={i} value={i}>{i}</MenuItem>
            )}
        </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={4}><TextField label="Mobile Number" size='small' name="mobileNo" value={formData.mobileNo} onChange={handleChange} fullWidth /></Grid>
            <Grid item xs={12} sm={6} md={4}><TextField label="Emergency Contact" size='small' name="emergencyNumber" value={formData.emergencyNumber} onChange={handleChange} fullWidth /></Grid>
            <Grid item xs={12} sm={6} md={4}><TextField size='small' select label="Highest Qualification" name="highestQualification"  value={formData.highestQualification} onChange={handleChange} fullWidth>
            {[
                "Ph.D",
                "Post Graduation",
                "Graduation",
                "Higher Secondary",
                "Secondary Education",
                "Diploma",
              ].map(i=>
            <MenuItem key={i} value={i}>{i}</MenuItem>
            )}
        </TextField></Grid>
        <Grid item xs={12} sm={6} md={4}><TextField label="University" size='small' name="university" value={formData.university} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={12} sx={{mt:2, display:"flex", alignItems:"center"}}><ArrowRightIcon sx={{ fontSize: 24, mr: 1 }} /><Typography fontSize={15} fontWeight={500}>
        Identity and Background</Typography></Grid>
        <Grid item xs={12} sm={6} md={4}><TextField label="Identity Mark" size='small' name="identityMark" value={formData.identityMark} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={12} sm={6} md={4}><TextField label="Height" size='small' name="height" value={formData.height} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={12} sm={6} md={4}><TextField label="Caste" size='small' name="caste" value={formData.caste} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={12} sm={6} md={4}><TextField size='small' select label="Category" name="category"  value={formData.category} onChange={handleChange} fullWidth>
        {[
            "General",
            "OBC",
            "SC",
            "ST"
            ].map(i=>
        <MenuItem key={i} value={i}>{i}</MenuItem>
        )}
        </TextField></Grid>
        <Grid item xs={12} sm={6} md={4}><TextField size='small' select label="Religion" name="religion"  value={formData.religion} onChange={handleChange} fullWidth>
            {[
                "Hindu",
                "Muslim",
                "Christian",
                "Sikh",
                "Other"
              ].map(i=>
            <MenuItem key={i} value={i}>{i}</MenuItem>
            )}
        </TextField></Grid>
        <Grid item xs={12} sm={6} md={4}><TextField size='small' select label="Blood Group" name="bloodGroup"  value={formData.bloodGroup} onChange={handleChange} fullWidth>
            {[
                "A+",
                "A-",
                "B+",
                "B-",
                "AB+",
                "AB-",
                "O+",
                "O-"
              ].map(i=>
            <MenuItem key={i} value={i}>{i}</MenuItem>
            )}
        </TextField></Grid>
        <Grid item xs={12} sm={6} md={4}><TextField label="Home District" size='small' name="homeDistrict" value={formData.homeDistrict} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={12} sm={6} md={4}><TextField label="Home State" size='small' name="homeState" value={formData.homeState} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={12} sm={6} md={4}><TextField label="Nearest Railway Station" size='small' name="nearestRailwaySt" value={formData.nearestRailwaySt} onChange={handleChange} fullWidth /></Grid>



        <Grid item xs={12} sx={{mt:2}}><Typography fontSize={16} color="black" fontWeight={600}>Address Details</Typography><Divider /></Grid>
        <Grid item xs={12} sx={{mt:2, display:"flex", alignItems:"center"}}><ArrowRightIcon sx={{ fontSize: 24, mr: 1 }} /><Typography fontSize={15} fontWeight={500}>Current Address</Typography></Grid>
        <Grid item xs={12} sm={6} md={4}><TextField label="Current Address" size='small' name="currentAddress" value={formData.currentAddress} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={12} sm={6} md={4}><TextField label="City" size='small' name="currentAddressCity" value={formData.currentAddressCity} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={12} sm={6} md={4}><TextField label="State" size='small' name="currentAddressState" value={formData.currentAddressState} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={12} sm={6} md={4}><TextField label="Pincode" size='small' name="currentAddressPincode" value={formData.currentAddressPincode} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={12} sx={{mt:2, display:"flex", alignItems:"center"}}><ArrowRightIcon sx={{ fontSize: 24, mr: 1 }} /><Typography fontSize={15} fontWeight={500}>Permanent Address</Typography></Grid>
        <Grid item xs={12} sm={6} md={4}><TextField label="Permanent Address" size='small' name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={12} sm={6} md={4}><TextField label="City" size='small' name="permanentAddressCity" value={formData.permanentAddressCity} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={12} sm={6} md={4}><TextField label="State" size='small' name="permanentAddressState" value={formData.permanentAddressState} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={12} sm={6} md={4}><TextField label="Pincode" size='small' name="permanentAddressPincode" value={formData.permanentAddressPincode} onChange={handleChange} fullWidth /></Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Latitude"
          size="small"
          name="latitude"
          value={formData.location.coordinates[0]}
          onChange={(e) => handleLocationChange(0, e.target.value)}
          fullWidth
          required
          error={submitted && !/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/.test(formData.location.coordinates[0])}
          helperText={submitted && !/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/.test(formData.location.coordinates[0]) ? "Enter valid latitude" : ""}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Longitude"
          size="small"
          name="longitude"
          value={formData.location.coordinates[1]}
          onChange={(e) => handleLocationChange(1, e.target.value)}
          fullWidth
          required
          error={submitted && !/^[-+]?(180(\.0+)?|(?:1[0-7][0-9]|[1-9]?[0-9])(\.\d+)?)$/.test(formData.location.coordinates[1])}
          helperText={submitted && !/^[-+]?(180(\.0+)?|(?:1[0-7][0-9]|[1-9]?[0-9])(\.\d+)?)$/.test(formData.location.coordinates[1]) ? "Enter valid longitude" : ""}
        />
      </Grid>

        <Grid item xs={12} sx={{mt:2}}><Typography fontSize={16} color="black" fontWeight={600}>Family Information</Typography><Divider /></Grid>
        <Grid item xs={12} sm={6} md={4}><TextField label="Father's Name" size='small' name="fatherName" value={formData.fatherName} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={12} sm={6} md={4}><TextField label="Father's Occupation" size='small' name="fathersOccupation" value={formData.fathersOccupation} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={12} sm={6} md={4}><TextField label="Father's Mobile No" size='small' name="fathersMobileNo" value={formData.fathersMobileNo} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={12} sm={6} md={4}><TextField label="Mother's Name" size='small' name="motherName" value={formData.motherName} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={12} sm={6} md={4}><TextField label="Mother's Mobile No" size='small' name="mothersMobileNo" value={formData.mothersMobileNo} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={12} sm={6} md={4}><TextField label="Family Income" size='small' name="familyIncome" value={formData.familyIncome} onChange={handleChange} fullWidth /></Grid>

        <Grid item xs={12} sx={{mt:2}}><Typography fontSize={16} color="black" fontWeight={600}>Bank Details</Typography><Divider /></Grid>
        <Grid item xs={12} sm={6} md={4}><TextField label="Name As Per Bank" size='small' name="nameAsPerBank" value={formData.nameAsPerBank} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={12} sm={6} md={4}><TextField label="Bank Name" name="bankName"  size='small' value={formData.bankName} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={12} sm={6} md={4}><TextField label="Bank Account" name="bankAccount" type='number'  size='small' value={formData.bankAccount} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={12} sm={6} md={4}><TextField label="IFSC Code" name="ifscCode"  size='small' value={formData.ifscCode} onChange={handleChange} fullWidth /></Grid>

        <Grid item xs={12} sx={{ mt: 2 }}>
        <Typography fontSize={16} fontWeight={600} color="black">Education Details</Typography>
        <Divider />
        </Grid>

        {formData.educationDetails.map((edu, index) => (
        <React.Fragment key={index}>
               <Grid item xs={12} sx={{ mt: 2, display:"flex", alignItems:"center" }}>
               <ArrowRightIcon sx={{ fontSize: 24, mr: 1 }} />  <Typography fontSize={15}>Education Details {index + 1}</Typography>
               </Grid>
            <Grid item xs={12} sm={6} md={4}>
            <TextField
                label="Education"
                name={`educationDetails[${index}].education`}
                size="small"
                value={edu.education}
                onChange={(e) => handleEducationChange(index, 'education', e.target.value)}
                fullWidth
            />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
            <TextField
                label="Name of Board"
                name={`educationDetails[${index}].nameOfBoard`}
                size="small"
                value={edu.nameOfBoard}
                onChange={(e) => handleEducationChange(index, 'nameOfBoard', e.target.value)}
                fullWidth
            />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
            <TextField
                label="Marks Obtained"
                name={`educationDetails[${index}].marksObtained`}
                size="small"
                value={edu.marksObtained}
                onChange={(e) => handleEducationChange(index, 'marksObtained', e.target.value)}
                fullWidth
            />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
            <TextField
                label="Passing Year"
                name={`educationDetails[${index}].passingYear`}
                size="small"
                value={edu.passingYear}
                onChange={(e) => handleEducationChange(index, 'passingYear', e.target.value)}
                fullWidth
            />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
            <TextField
                label="Stream"
                name={`educationDetails[${index}].stream`}
                size="small"
                value={edu.stream}
                onChange={(e) => handleEducationChange(index, 'stream', e.target.value)}
                fullWidth
            />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
            <TextField
                label="Grade"
                name={`educationDetails[${index}].grade`}
                size="small"
                select
                value={edu.grade}
                onChange={(e) => handleEducationChange(index, 'grade', e.target.value)}
                fullWidth
                >
                {[
                   "A+",
                   "A",
                   "B+",
                   "B",
                   "C",
                   "D"
                   ].map(i=>
               <MenuItem key={i} value={i}>{i}</MenuItem>
               )}
               </TextField>
            </Grid>
        {index>0 && <Grid item xs={12}>
            <Button
                variant="outlined"
                color="error"
                size='small'
                onClick={() => handleRemoveEducation(index)}
                sx={{ mt: 1 }}
            >
                Remove
            </Button>
            </Grid>}
        </React.Fragment>
        ))}

        <Grid item xs={12} sx={{display:'flex', justifyContent:"flex-end"}}>
        <Button variant="outlined" size='small' onClick={handleAddEducation}>+ Add More</Button>
        </Grid>

        <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography fontSize={16} fontWeight={600} color='black'>Employment History</Typography>
            <Divider />
            </Grid>

            {formData.employeementHistory.map((history, index) => (
            <React.Fragment key={index}>
                       <Grid item xs={12} sx={{ mt: 2, display:"flex", alignItems:"center" }}>
                 <ArrowRightIcon sx={{ fontSize: 24, mr: 1 }} /> <Typography fontSize={15}>Employement Details {index + 1}</Typography>
               </Grid>
                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Current Designation"
                    size="small"
                    value={history.currentDesignation}
                    onChange={(e) => handleEmploymentChange(index, 'currentDesignation', e.target.value)}
                    fullWidth
                />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Last Organization"
                    size="small"
                    value={history.lastOrganization}
                    onChange={(e) => handleEmploymentChange(index, 'lastOrganization', e.target.value)}
                    fullWidth
                />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Start Date"
                    type="date"
                    size="small"
                    value={history.startDate}
                    onChange={(e) => handleEmploymentChange(index, 'startDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="End Date"
                    type="date"
                    size="small"
                    value={history.endDate}
                    onChange={(e) => handleEmploymentChange(index, 'endDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Total Experience"
                    size="small"
                    value={history.totalExperience}
                    onChange={(e) => handleEmploymentChange(index, 'totalExperience', e.target.value)}
                    fullWidth
                />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Current CTC"
                    size="small"
                    value={history.currentCTC}
                    onChange={(e) => handleEmploymentChange(index, 'currentCTC', e.target.value)}
                    fullWidth
                />
                </Grid>
               {index>0 && <Grid item xs={12}>
                <Button
                    variant="outlined"
                    color="error"
                       size='small'
                    onClick={() => handleRemoveEmployment(index)}
                    sx={{ mt: 1 }}
                >
                    Remove
                </Button>
                </Grid>}
            </React.Fragment>
            ))}

        <Grid item xs={12} sx={{display:'flex', justifyContent:"flex-end"}}>
            <Button variant="outlined" size='small' onClick={handleAddEmployment}>+ Add More</Button>
            </Grid>


            <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography fontSize={16} fontWeight={600}>Nominee Details</Typography>
            <Divider />
            </Grid>

            {formData.nominee.map((nom, index) => (
            <React.Fragment key={index}>
                    <Grid item xs={12} sx={{ mt: 2, display:"flex", alignItems:"center" }}>
                 <ArrowRightIcon sx={{ fontSize: 24, mr: 1 }} />  <Typography fontSize={15}>Nominee Details {index + 1}</Typography>
               </Grid>
                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Nominee Name"
                    size="small"
                    value={nom.nomineeName}
                    onChange={(e) => handleNomineeChange(index, 'nomineeName', e.target.value)}
                    fullWidth
                />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Relation With Employee"
                    size="small"
                    value={nom.relationWithEmployee}
                    onChange={(e) => handleNomineeChange(index, 'relationWithEmployee', e.target.value)}
                    fullWidth
                />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Nomination Type"
                    size="small"
                    select
                    value={nom.nominationType}
                    onChange={(e) => handleNomineeChange(index, 'nominationType', e.target.value)}
                    fullWidth
                >
                     {[
                        "Primary",
                        "Secondary"
                        ].map(i=>
                    <MenuItem key={i} value={i}>{i}</MenuItem>
                    )}
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Nomination Age"
                    size="small"
                    type="number"
                    value={nom.nominationAge}
                    onChange={(e) => handleNomineeChange(index, 'nominationAge', e.target.value)}
                    fullWidth
                />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Nominee Address"
                    size="small"
                    value={nom.nomineeAddress}
                    onChange={(e) => handleNomineeChange(index, 'nomineeAddress', e.target.value)}
                    fullWidth
                />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Nominee State"
                    size="small"
                    value={nom.nomineeState}
                    onChange={(e) => handleNomineeChange(index, 'nomineeState', e.target.value)}
                    fullWidth
                />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Nominee District"
                    size="small"
                    value={nom.nomineeDistrict}
                    onChange={(e) => handleNomineeChange(index, 'nomineeDistrict', e.target.value)}
                    fullWidth
                />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Nominee Block"
                    size="small"
                    value={nom.nomineeblock}
                    onChange={(e) => handleNomineeChange(index, 'nomineeblock', e.target.value)}
                    fullWidth
                />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Nominee Panchayat"
                    size="small"
                    value={nom.nomineePanchayat}
                    onChange={(e) => handleNomineeChange(index, 'nomineePanchayat', e.target.value)}
                    fullWidth
                />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Nominee Pincode"
                    size="small"
                    value={nom.nomineePincode}
                    onChange={(e) => handleNomineeChange(index, 'nomineePincode', e.target.value)}
                    fullWidth
                />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Nominee Phone Number"
                    size="small"
                    value={nom.nomineePhoneNumber}
                    onChange={(e) => handleNomineeChange(index, 'nomineePhoneNumber', e.target.value)}
                    fullWidth
                />
                </Grid>
           { index>0  &&  <Grid item xs={12}>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleRemoveNominee(index)}
                    sx={{ mt: 1 }}
                    size='small'
                >
                    Remove
                </Button>
                </Grid>}
            </React.Fragment>
            ))}

           <Grid item xs={12} sx={{display:'flex', justifyContent:"flex-end"}}>
            <Button variant="outlined" size='small' onClick={handleAddNominee}>+ Add More</Button>
            </Grid>


            <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography fontSize={16} fontWeight={600} color='black'>Document Uploads</Typography>
            <Divider />
            </Grid>

            {[
            { label: 'Employee Photo', name: 'employeePhoto' },
            { label: 'Resume', name: 'resume' },
            { label: 'Aadhar', name: 'aadhar' },
            { label: 'PAN Card', name: 'panCard' },
            { label: 'Education Certificate', name: 'educationCertification' },
            { label: 'Experience Letter', name: 'experienceLetter' },
            { label: 'Employment Proof', name: 'employmentProof' },
            { label: 'Bank Details', name: 'bankDetails' },
            { label: 'Offer Letter', name: 'offerLetter' },
            ].map((doc) => (
            <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: 3, p: 2, height:"200px" }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography fontSize={14} fontWeight={500} mb={1} textAlign="center">
                    {doc.label}
                </Typography>

                {formData[doc.name] ? (
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                    {formData[doc.name].endsWith('.pdf') ? (
                      
                        <Button
                        variant="text"
                        onClick={() => window.open(formData[doc.name], '_blank')}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            borderRadius: 1,
                            padding: 1,
                            backgroundColor: '#f5f5f5',
                        }}
                        >
                        <PictureAsPdf sx={{ marginRight: 1 }} />
                        <Typography variant="body2">Open PDF</Typography>
                        </Button>
                    ) : (
                      
                        <CardMedia
                        component="img"
                        src={formData[doc.name]}
                        alt={doc.label}
                        sx={{ width: '100%', height: '100px', maxWidth: '150px', borderRadius: 1 }}
                        />
                    )}
                    </Box>
                ) : (
                    <Typography variant="body2" color="text.secondary" mb={1}>
                    No file uploaded
                    </Typography>
                )}

                <Button
                    variant="outlined"
                    component="label"
                    size="small"
                    fullWidth
                    sx={{ borderRadius: 2 }}
                >
                    Upload {doc.label}
                    <input
                    type="file"
                    hidden
                    onChange={(e) => handleFileUpload(e, doc.name)}
                    />
                </Button>
                </CardContent>
            </Card>
            </Grid>
            ))}

            <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography fontSize={16} fontWeight={600}>Other Details</Typography>

            <Divider />
            </Grid> 
            <Grid item xs={12} sm={6} md={4}><TextField size='small' select label="Company" name="company" value={formData.company} onChange={handleChange} fullWidth required>
        {companies.map(i=>
        <MenuItem key={i._id} value={i.companyName}>{i.companyName}</MenuItem>
        )}
        </TextField></Grid>
        <Grid item xs={12} sm={6} md={4}><TextField label="Onboarding Status" select size='small' name="onboardingStatus" value={formData.onboardingStatus} onChange={handleChange} fullWidth required  >
        {[ "enrolled","joining"].map(i=><MenuItem key={i} value={i}>{i.toUpperCase()}</MenuItem>)}</TextField></Grid>
        <Grid item xs={12} sm={6} md={4}><TextField label="Description" multiline rows={2} size='small' name="description" value={formData.description} onChange={handleChange} fullWidth required /></Grid>

        <Grid item xs={12}><Button onClick={handleSubmit} variant="contained">Submit</Button></Grid>
      </Grid>
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
  )
}
