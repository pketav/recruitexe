'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Container, Typography,Grid, Button, TextField, Divider, MenuItem, Box,Card, CardContent, CardMedia,Snackbar, Alert  } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { PictureAsPdf } from '@mui/icons-material'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { useAuth } from '../../../context/AuthContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { IconButton, InputAdornment, CircularProgress } from '@mui/material';

export default function EmployeeUpdate() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const [empData, setEmpData] = useState({})
    const { userData } =  useAuth();
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
      })
    const [submitted, setSubmitted] = useState(false)
    const [panVerified, setPanVerified] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [bankVerified, setBankVerified] = useState(false);
    const [verifyingBank, setVerifyingBank] = useState(false);
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

      const handlePanVerification = async () => {
        const pan = formData.panNo.toUpperCase();
      
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
          alert("Enter a valid PAN format.");
          return;
        }
        setVerifying(true);
        try {
          const response = await axios.post(`${baseUrl}/v1/api/verifyDocs/verifyDocument?employeeId=${userData?.empID}`,{ 
            type:"panverification",
            pan_number: pan,
            consent: "Y"
           },
          { headers: {
            'Content-Type': 'application/json',
            authorization: token,
          }})
           
          if(response.data.status) {
            setPanVerified(true);
          } else {
            setPanVerified(false);
          }
        } catch (error) {
          console.error("PAN verification error:", error);
        } finally {
          setVerifying(false);
        }
      };

      const handleBankVerification = async () => {
        const { bankAccount, ifscCode } = formData;
      
        if (!bankAccount || !ifscCode) {
          alert("Please enter both account number and IFSC.");
          return;
        }
      
        setVerifyingBank(true);
        try {
          const response = await axios.post(
            `${baseUrl}/v1/api/verifyDocs/verifyDocument?employeeId=${userData?.empID}`,
            {
              type: "bankverification",
              account_number:bankAccount,
              ifsc:ifscCode,
              consent: "Y"
            },
            {
              headers: {
                'Content-Type': 'application/json',
                authorization: token
              }
            }
          );
      
          if (response.data.status) {
            setBankVerified(true);
            alert("✅ Bank details verified successfully.");
          } else {
            setBankVerified(false);
            alert("❌ Bank verification failed.");
          }
        } catch (error) {
          console.error("Bank verification error:", error);
          alert("⚠️ Error verifying bank details. Please try again.");
        } finally {
          setVerifyingBank(false);
        }
      };
      
      
      
      
     const getEmpDetail = async () => {
        try {
          const res = await axios.get(`${baseUrl}/v1/api/Auth/getEmployeeById/${userData?.empID}`, {
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
            workEmail: empData.workEmail,
            currentAddress: empData.currentAddress || '',
            permanentAddress: empData.permanentAddress || '',
            employeementHistory: empData.employeementHistory && empData.employeementHistory.length > 0 ? empData.employeementHistory : [{ jobTitle: '', company: '', startDate: '', endDate: '' }],
            educationDetails: empData.educationDetails && empData.educationDetails.length > 0 ? empData.educationDetails : [{ education: '', nameOfBoard: '', marksObtained: '', passingYear: '', stream: '', grade: '' }],
            branch: empData.branchId?.name || '',
            dateOfBirth:empData.dateOfBirth || "",
            joiningDate: empData.joiningDate || ""
          }));
          setEmpData(empData)
        } catch (error) {
          console.error('Error fetching ID setup:', error);
        }
      };
    
    const [documentsRequired, setDocumentsRequired] = useState([]);
    const [verificationsRequired, setVerificationRequired] = useState([])
    const [isPanVerificationRequired, setIsPanVerificationRequired] = useState(false);
    const [isBankVerificationRequired, setIsBankVerificationRequired] = useState(false);
    
    const getVerificationAndDocument = async () => {
      try {
        const res = await axios.get(`${baseUrl}/v1/api/verifyDocs/stage`, {
          headers: {
            'Content-Type': 'application/json',
            authorization: token,
          },
        });
    
        const selectedItem = res.data.items.find(i => i._id === "681f3c00831dd57310ea9e9b");
    
        setDocumentsRequired(selectedItem?.Document || []);
        setVerificationRequired(selectedItem?.api_connection || []);
    
        const apiConnections = selectedItem?.api_connection || [];
    
        setIsPanVerificationRequired(
          apiConnections.some(v => v.apiName === "panverification")
        );
    
        setIsBankVerificationRequired(
          apiConnections.some(v => v.apiName === "bankverification")
        );
    
      } catch (error) {
        console.error('Error fetching verification/documents:', error);
      }
    };
    
      useEffect(()=>{
        getEmpDetail();
        getVerificationAndDocument()      
      },[userData?.empID])
   

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
        setFormData((prevState) => ({
          ...prevState,
          educationDetails: [
            ...prevState.educationDetails,
            { education: '', nameOfBoard: '', marksObtained: '', passingYear: '', stream: '', grade: '' }
          ]
        }));
      };
      
      const handleRemoveEducation = (index) => {
        setFormData((prevState) => ({
          ...prevState,
          educationDetails: prevState.educationDetails.filter((_, i) => i !== index)
        }));
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

    
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }
      
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

      const handleEmployeeTargetChange = (index, field, value) => {
        const updatedTargets = [...formData.employeeTarget];
        updatedTargets[index][field] = value;
        setFormData((prev) => ({
          ...prev,
          employeeTarget: updatedTargets,
        }));
      };
      
      const addEmployeeTarget = () => {
        setFormData((prev) => ({
          ...prev,
          employeeTarget: [...prev.employeeTarget, { title: '', value: '' }],
        }));
      };
      
      const removeEmployeeTarget = (index) => {
        const updatedTargets = [...formData.employeeTarget];
        updatedTargets.splice(index, 1);
        setFormData((prev) => ({
          ...prev,
          employeeTarget: updatedTargets,
        }));
      };



      const handleSubmit = async () => {
        setSubmitted(true);

        const requiredFields = [
          'mobileNo', 'emergencyNumber', 'identityMark', 'height', 'caste', 'category', 'religion',
          'bloodGroup', 'homeDistrict', 'homeState', 'nearestRailwaySt', 'joiningDate', 'dateOfBirth',
          'fatherName', 'motherName', 'fathersOccupation', 'fathersMobileNo', 'mothersMobileNo',
          'familyIncome', 'gender', 'salutation', 'maritalStatus', 'nameAsPerBank',
          'bankName', 'bankAccount', 'ifscCode', 'highestQualification', 'university',
          'aadhaarNo', 'panNo', 'currentAddress', 'currentAddressCity', 'currentAddressState',
          'currentAddressPincode', 'permanentAddress', 'permanentAddressCity', 'permanentAddressState',
          'permanentAddressPincode'
        ];
      
        const missingFields = requiredFields.filter((key) => !formData[key]);

        if (isBankVerificationRequired && !bankVerified) {
            alert("Please verify bank details before submitting the form.");
            return;
          }


        if (isPanVerificationRequired && !panVerified) {
            alert("Please verify bank details before submitting the form.");
            return;
          }
          
      
        const requiredDocs = [
          'employeePhoto', 'resume', 'aadhar', 'panCard', 'educationCertification',
          'experienceLetter', 'employmentProof', 'bankDetails', 'offerLetter'
        ];
        const missingDocs = requiredDocs.filter((doc) => !formData[doc]);
      
        console.log("missingDocs",missingDocs)

        const isNomineeInvalid = formData.nominee.some((nom) =>
          !nom.nomineeName || !nom.relationWithEmployee || !nom.nominationType ||
          !nom.nominationAge || !nom.nomineeAddress || !nom.nomineeState ||
          !nom.nomineeDistrict || !nom.nomineeblock || !nom.nomineePanchayat ||
          !nom.nomineePincode || !nom.nomineePhoneNumber
        );
      

        const isEmploymentInvalid = formData.employeementHistory.some((job) =>
          !job.currentDesignation || !job.lastOrganization || !job.startDate ||
          !job.endDate || !job.totalExperience || !job.currentCTC
        );
      

        const isEducationInvalid = formData.educationDetails.some((edu) =>
          !edu.education || !edu.nameOfBoard || !edu.marksObtained ||
          !edu.passingYear || !edu.stream || !edu.grade
        );

      
        const isLocationInvalid = !formData.location.coordinates[0] || !formData.location.coordinates[1];
      
        if (
          missingFields.length > 0 ||
          missingDocs.length > 0 ||
          isNomineeInvalid ||
          isEmploymentInvalid ||
          isEducationInvalid ||
          isLocationInvalid
        ) {
            setSnackbar({
                open: true,
                message: 'Please fill all required fields and upload necessary documents before submitting.',
                severity: 'error'
              })
          return;
        }
      
        try {
            const res = await axios.post(`${baseUrl}/v1/api/Auth/emplyee/updateEmployeeById/${userData?.empID}`, {
                headers: {
              'Content-Type': 'application/json',
              authorization: token,
            },
          });
      
          if (res.data.status) {
            console.log('Submission successful!');
            // You can add a success toast or redirect here
          }
        } catch (err) {
          console.error('Submission error:', err);
        }
      };
      
      
console.log("formdata",formData)


  return (
    <Container maxWidth='xl'>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <AssignmentIndIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h5" fontWeight={700} color="primary">
            Joining Form
        </Typography>
        </Box>
        <Divider/>
        <Grid container spacing={3} sx={{mt:2}}>
        <Grid item xs={12} sx={{mt:2}}><Typography fontSize={16} color="black" fontWeight={600}>Employee Basic Details</Typography><Divider /></Grid>
        <Grid item xs={12} sm={6} md={4}>
        <TextField
        label="Aadhar Number"
        size="small"
        name="aadhaarNo"
        value={formData.aadhaarNo}
        onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,12}$/.test(value)) {
            handleChange(e);
            }
        }}
        fullWidth
        required
        inputProps={{
            maxLength: 12,
            inputMode: "numeric",
            pattern: "\\d{12}",
        }}
        error={submitted && !formData.aadhaarNo && !/^\d{12}$/.test(formData.aadhaarNo)}
        helperText={submitted && 
            !formData.aadhaarNo && !/^\d{12}$/.test(formData.aadhaarNo)
            ? "Aadhaar number must be exactly 12 digits"
            : ""
        }
        />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
  <TextField
    label="PAN Number"
    size="small"
    name="panNo"
    value={formData.panNo.toUpperCase()}
    onChange={(e) => {
      const value = e.target.value.toUpperCase();
      if (value.length <= 10) {
        handleChange({ target: { name: "panNo", value } });
        setPanVerified(false); // Reset verification if present
      }
    }}
    fullWidth
    required
    inputProps={{
      maxLength: 10,
      pattern: "[A-Z]{5}[0-9]{4}[A-Z]{1}",
    }}
    error={
      submitted &&
      (!formData.panNo ||
        !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNo) ||
        (isPanVerificationRequired && !panVerified))
    }
    helperText={
      submitted &&
      (!formData.panNo || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNo))
        ? "PAN must be 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)"
        : isPanVerificationRequired && submitted && !panVerified
        ? "Please verify your PAN before submission."
        : ""
    }
    InputProps={{
      endAdornment: isPanVerificationRequired && (
        <InputAdornment position="end">
          <IconButton onClick={handlePanVerification} disabled={verifying}>
            {verifying ? (
              <CircularProgress size={20} />
            ) : panVerified ? (
              <CheckCircleIcon color="success" />
            ) : (
              <CheckCircleIcon />
            )}
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
</Grid>



        <Grid item xs={12} sm={6} md={4}>
        <TextField
            label="Name as per Bank"
            size="small"
            name="nameAsPerBank"
            value={formData.nameAsPerBank}
            onChange={handleChange}
            fullWidth
            required
            error={submitted && !formData.nameAsPerBank}
            helperText={submitted && !formData.nameAsPerBank ? "Name as per bank is required" : ""}
        />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
        <TextField
            label="Salutation"
            fullWidth
            required
            select
            size="small"
            name="salutation"
            value={formData.salutation}
            onChange={handleChange}
            error={submitted && !formData.salutation}
            helperText={submitted &&!formData.salutation ? "Salutation is required" : ""}
        >
            {['Mr.', 'Mrs.', 'Miss'].map((i) => (
            <MenuItem key={i} value={i}>{i}</MenuItem>
            ))}
        </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
        <TextField
            label="Date Of Birth"
            type="date"
            name="dateOfBirth"
            size="small"
            value={formData.dateOfBirth ? formData.dateOfBirth.slice(0, 10) : ''}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
            error={submitted && !formData.dateOfBirth}
            helperText={submitted && !formData.dateOfBirth ? "Date of birth is required" : ""}
        />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
        <TextField
            label="Gender"
            fullWidth
            required
            select
            size="small"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            error={submitted && !formData.gender}
            helperText={submitted && !formData.gender ? "Gender is required" : ""}
        >
            {['Male', 'Female', 'Other'].map((i) => (
            <MenuItem key={i} value={i}>{i}</MenuItem>
            ))}
        </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
        <TextField
            label="Marital Status"
            size="small"
            name="maritalStatus"
            select
            value={formData.maritalStatus}
            onChange={handleChange}
            fullWidth
            required
            error={submitted && !formData.maritalStatus}
            helperText={submitted && !formData.maritalStatus ? "Marital status is required" : ""}
        >
            {['Single', 'Married'].map((i) => (
            <MenuItem key={i} value={i}>{i}</MenuItem>
            ))}
        </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
        <TextField
        label="Mobile Number"
        size="small"
        name="mobileNo"
        value={formData.mobileNo}
        onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,10}$/.test(value)) {
              handleChange({
                target: {
                  name: e.target.name,
                  value: value,
                }
              });
            }
          }}
        fullWidth
        required
        inputProps={{
            maxLength: 10,
            pattern: "^[6-9]\\d{9}$",
        }}
        error={submitted && !formData.mobileNo && !/^[6-9]\d{9}$/.test(formData.mobileNo)}
        helperText={submitted && 
            !formData.mobileNo && !/^[6-9]\d{9}$/.test(formData.mobileNo)
            ? "Enter valid 10-digit mobile number starting with 6-9"
            : ""
        }
        />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
        <TextField
        label="Emergency Contact"
        size="small"
        name="emergencyNumber"
        value={formData.emergencyNumber}
        onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,10}$/.test(value)) {
              handleChange({
                target: {
                  name: e.target.name,
                  value: value,
                }
              });
            }
          }}
        fullWidth
        required
        inputProps={{
            maxLength: 10,
            pattern: "^[6-9]\\d{9}$",
        }}
        error={submitted && !formData.emergencyNumber && !/^[6-9]\d{9}$/.test(formData.emergencyNumber)}
        helperText={submitted && 
            !formData.emergencyNumber && !/^[6-9]\d{9}$/.test(formData.emergencyNumber)
            ? "Enter valid 10-digit mobile number starting with 6-9"
            : ""
        }
        />                
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
        <TextField
            size='small'
            select
            label="Highest Qualification"
            name="highestQualification"
            value={formData.highestQualification}
            onChange={handleChange}
            fullWidth
            required
            error={submitted && !formData.highestQualification}
            helperText={submitted && !formData.highestQualification ? "Highest qualification is required" : ""}
        >
            {[
            "Ph.D",
            "Post Graduation",
            "Graduation",
            "Higher Secondary",
            "Secondary Education",
            "Diploma",
            ].map(i => (
            <MenuItem key={i} value={i}>
                {i}
            </MenuItem>
            ))}
        </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
        <TextField
            label="University"
            size='small'
            name="university"
            value={formData.university}
            onChange={handleChange}
            fullWidth
            required
            error={submitted && !formData.university}
            helperText={submitted && !formData.university ? "University is required" : ""}
        />
        </Grid>       
         <Grid item xs={12} sx={{mt:2, display:"flex", alignItems:"center"}}><ArrowRightIcon sx={{ fontSize: 24, mr: 1 }} /><Typography fontSize={15} fontWeight={500}>
        Identity and Background</Typography></Grid>
        <Grid item xs={12} sm={6} md={4}>
        <TextField
            label="Identity Mark"
            size='small'
            name="identityMark"
            value={formData.identityMark}
            onChange={handleChange}
            fullWidth
            required
            error={submitted && !formData.identityMark}
            helperText={submitted && !formData.identityMark ? "Identity mark is required" : ""}
        />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
        <TextField
            label="Height (cms)"
            size='small'
            name="height"
            type='number'
            value={formData.height}
            onChange={handleChange}
            fullWidth
            required
            error={submitted && (formData.height === "" || formData.height <= 0)}
            helperText={submitted && (formData.height === "" || formData.height <= 0) ? "Height is required and must be a positive number" : ""}
        />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
        <TextField
            label="Caste"
            size='small'
            name="caste"
            value={formData.caste}
            onChange={handleChange}
            fullWidth
            required
            error={submitted && !formData.caste}
            helperText={submitted && !formData.caste ? "Caste is required" : ""}
        />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
        <TextField
            size='small'
            select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            fullWidth
            required
            error={submitted && !formData.category}
            helperText={submitted && !formData.category ? "Category is required" : ""}
        >
            {["General", "OBC", "SC", "ST"].map(i => (
            <MenuItem key={i} value={i}>
                {i}
            </MenuItem>
            ))}
        </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
        <TextField
            size='small'
            select
            label="Religion"
            name="religion"
            value={formData.religion}
            onChange={handleChange}
            fullWidth
            required
            error={submitted && !formData.religion}
            helperText={submitted && !formData.religion ? "Religion is required" : ""}
        >
            {["Hindu", "Muslim", "Christian", "Sikh", "Other"].map(i => (
            <MenuItem key={i} value={i}>
                {i}
            </MenuItem>
            ))}
        </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
        <TextField
            size='small'
            select
            label="Blood Group"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            fullWidth
            required
            error={submitted && !formData.bloodGroup}
            helperText={submitted && !formData.bloodGroup ? "Blood group is required" : ""}
        >
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(i => (
            <MenuItem key={i} value={i}>
                {i}
            </MenuItem>
            ))}
        </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
        <TextField
            label="Home District"
            size='small'
            name="homeDistrict"
            value={formData.homeDistrict}
            onChange={handleChange}
            fullWidth
            required
            error={submitted && !formData.homeDistrict}
            helperText={submitted && !formData.homeDistrict ? "Home district is required" : ""}
        />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
        <TextField
            label="Home State"
            size='small'
            name="homeState"
            value={formData.homeState}
            onChange={handleChange}
            fullWidth
            required
            error={submitted && !formData.homeState}
            helperText={submitted && !formData.homeState ? "Home state is required" : ""}
        />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
        <TextField
            label="Nearest Railway Station"
            size='small'
            name="nearestRailwaySt"
            value={formData.nearestRailwaySt}
            onChange={handleChange}
            fullWidth
            required
            error={submitted && !formData.nearestRailwaySt}
            helperText={submitted && !formData.nearestRailwaySt ? "Nearest railway station is required" : ""}
        />
        </Grid>


        <Grid item xs={12} sx={{mt:2}}><Typography fontSize={16} color="black" fontWeight={600}>Address Details</Typography><Divider /></Grid>
        <Grid item xs={12} sx={{mt:2, display:"flex", alignItems:"center"}}><ArrowRightIcon sx={{ fontSize: 24, mr: 1 }} /><Typography fontSize={15} fontWeight={500}>Current Address</Typography></Grid>
        <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Current Address"
          size="small"
          name="currentAddress"
          value={formData.currentAddress}
          onChange={handleChange}
          fullWidth
          required
          error={submitted && !formData.currentAddress}
          helperText={submitted && !formData.currentAddress ? "Current address is required" : ""}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="City"
          size="small"
          name="currentAddressCity"
          value={formData.currentAddressCity}
          onChange={handleChange}
          fullWidth
          required
          error={submitted && !formData.currentAddressCity}
          helperText={submitted && !formData.currentAddressCity ? "City is required" : ""}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="State"
          size="small"
          name="currentAddressState"
          value={formData.currentAddressState}
          onChange={handleChange}
          fullWidth
          required
          error={submitted && !formData.currentAddressState}
          helperText={submitted && !formData.currentAddressState ? "State is required" : ""}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Pincode"
          size="small"
          name="currentAddressPincode"
          value={formData.currentAddressPincode}
          onChange={handleChange}
          fullWidth
          required
          error={submitted && !/^\d{6}$/.test(formData.currentAddressPincode)}
          helperText={submitted && !/^\d{6}$/.test(formData.currentAddressPincode) ? "Pincode must be a 6-digit number" : ""}
          inputProps={{
            maxLength: 6,
          }}
        />
      </Grid>
        <Grid item xs={12} sx={{mt:2, display:"flex", alignItems:"center"}}><ArrowRightIcon sx={{ fontSize: 24, mr: 1 }} /><Typography fontSize={15} fontWeight={500}>Permanent Address</Typography></Grid>
        <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Permanent Address"
          size="small"
          name="permanentAddress"
          value={formData.permanentAddress}
          onChange={handleChange}
          fullWidth
          required
          error={submitted && !formData.permanentAddress}
          helperText={submitted && !formData.permanentAddress ? "Permanent address is required" : ""}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="City"
          size="small"
          name="permanentAddressCity"
          value={formData.permanentAddressCity}
          onChange={handleChange}
          fullWidth
          required
          error={submitted && !formData.permanentAddressCity}
          helperText={submitted && !formData.permanentAddressCity ? "City is required" : ""}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="State"
          size="small"
          name="permanentAddressState"
          value={formData.permanentAddressState}
          onChange={handleChange}
          fullWidth
          required
          error={submitted && !formData.permanentAddressState}
          helperText={submitted && !formData.permanentAddressState ? "State is required" : ""}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Pincode"
          size="small"
          name="permanentAddressPincode"
          value={formData.permanentAddressPincode}
          onChange={handleChange}
          fullWidth
          required
          error={submitted && !/^\d{6}$/.test(formData.permanentAddressPincode)}
          helperText={submitted && !/^\d{6}$/.test(formData.permanentAddressPincode) ? "Pincode must be a 6-digit number" : ""}
          inputProps={{
            maxLength: 6,
          }}
        />
      </Grid>

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
        <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Father's Name"
          size="small"
          name="fatherName"
          value={formData.fatherName}
          onChange={handleChange}
          fullWidth
          required
          error={submitted && !formData.fatherName}
          helperText={submitted && !formData.fatherName ? "Father's name is required" : ""}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Father's Occupation"
          size="small"
          name="fathersOccupation"
          value={formData.fathersOccupation}
          onChange={handleChange}
          fullWidth
          required
          error={submitted && !formData.fathersOccupation}
          helperText={submitted && !formData.fathersOccupation ? "Father's occupation is required" : ""}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Father's Mobile No"
          size="small"
          name="fathersMobileNo"
          value={formData.fathersMobileNo}
          onChange={handleChange}
          fullWidth
          required
          error={submitted && !/^\d{10}$/.test(formData.fathersMobileNo)}
          helperText={submitted && !/^\d{10}$/.test(formData.fathersMobileNo) ? "Father's mobile number must be 10 digits" : ""}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Mother's Name"
          size="small"
          name="motherName"
          value={formData.motherName}
          onChange={handleChange}
          fullWidth
          required
          error={submitted && !formData.motherName}
          helperText={submitted && !formData.motherName ? "Mother's name is required" : ""}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Mother's Mobile No"
          size="small"
          name="mothersMobileNo"
          value={formData.mothersMobileNo}
          onChange={handleChange}
          fullWidth
          required
          error={submitted && !/^\d{10}$/.test(formData.mothersMobileNo)}
          helperText={submitted && !/^\d{10}$/.test(formData.mothersMobileNo) ? "Mother's mobile number must be 10 digits" : ""}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Family Income"
          size="small"
          name="familyIncome"
          value={formData.familyIncome}
          onChange={handleChange}
          fullWidth
          required
          error={submitted && !/^\d+(\.\d{1,2})?$/.test(formData.familyIncome)}
          helperText={submitted && !/^\d+(\.\d{1,2})?$/.test(formData.familyIncome) ? "Family income must be a valid number" : ""}
        />
      </Grid>
        <Grid item xs={12} sx={{mt:2}}><Typography fontSize={16} color="black" fontWeight={600}>Bank Details</Typography><Divider /></Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Bank Account"
          name="bankAccount"
          type="number"
          size="small"
          value={formData.bankAccount}
          onChange={handleChange}
          fullWidth
          required
          error={submitted && !/^\d+$/.test(formData.bankAccount)}
          helperText={submitted && !/^\d+$/.test(formData.bankAccount) ? "Bank account must be a valid number" : ""}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="IFSC Code"
          name="ifscCode"
          size="small"
          value={formData.ifscCode}
          onChange={handleChange}
          fullWidth
          required
          error={submitted && !/^[A-Za-z]{4}[0][A-Za-z0-9]{6}$/.test(formData.ifscCode)}
          helperText={submitted && !/^[A-Za-z]{4}[0][A-Za-z0-9]{6}$/.test(formData.ifscCode) ? "IFSC Code is invalid" : ""}
        />
      </Grid>

      {isBankVerificationRequired && (
  <Grid item xs={12} sm={6} md={4}>
    <Button
      variant='outlined'
      size='small'
      onClick={handleBankVerification}
      disabled={verifyingBank}
      endIcon={bankVerified ? <CheckCircleIcon color="success" /> : null}
    >
      {verifyingBank ? <CircularProgress size={18} /> : 'Verify Bank Details'}
    </Button>
  </Grid>
)}

      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Name As Per Bank"
          size="small"
          name="nameAsPerBank"
          value={formData.nameAsPerBank}
          onChange={handleChange}
          fullWidth
          required
          error={submitted && !formData.nameAsPerBank}
          helperText={submitted && !formData.nameAsPerBank ? "Name as per bank is required" : ""}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label="Bank Name"
          name="bankName"
          size="small"
          value={formData.bankName}
          onChange={handleChange}
          fullWidth
          required
          error={submitted && !formData.bankName}
          helperText={submitted && !formData.bankName ? "Bank name is required" : ""}
        />
      </Grid>

      
        <Grid item xs={12} sx={{ mt: 2 }}>
        <Typography fontSize={16} fontWeight={600} color="black">Education Details</Typography>
        <Divider />
        </Grid>

        {formData.educationDetails.map((edu, index) => (
        <React.Fragment key={index}>
            <Grid item xs={12} sx={{ mt: 2, display: "flex", alignItems: "center" }}>
            <ArrowRightIcon sx={{ fontSize: 24, mr: 1 }} />
            <Typography fontSize={15}>Education Details {index + 1}</Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
            <TextField
                label="Education"
                name={`educationDetails[${index}].education`}
                size="small"
                value={edu.education}
                onChange={(e) => handleEducationChange(index, 'education', e.target.value)}
                fullWidth
                required={index === 0} // Required for the first set
                error={submitted && index === 0 && !edu.education} // Show error for the first set if empty
                helperText={submitted && index === 0 && !edu.education ? "Education is required" : ""}
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
                required={index === 0} // Required for the first set
                error={submitted && index === 0 && !edu.nameOfBoard} // Show error for the first set if empty
                helperText={submitted && index === 0 && !edu.nameOfBoard ? "Name of Board is required" : ""}
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
                required={index === 0} // Required for the first set
                error={submitted && index === 0 && !edu.marksObtained} // Show error for the first set if empty
                helperText={submitted && index === 0 && !edu.marksObtained ? "Marks Obtained is required" : ""}
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
                required={index === 0} // Required for the first set
                error={submitted && index === 0 && !edu.passingYear} // Show error for the first set if empty
                helperText={submitted && index === 0 && !edu.passingYear ? "Passing Year is required" : ""}
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
                required={index === 0} // Required for the first set
                error={submitted && index === 0 && !edu.stream} // Show error for the first set if empty
                helperText={submitted && index === 0 && !edu.stream ? "Stream is required" : ""}
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
                required={index === 0} // Required for the first set
            >
                {["A+", "A", "B+", "B", "C", "D"].map((i) => (
                <MenuItem key={i} value={i}>
                    {i}
                </MenuItem>
                ))}
            </TextField>
            </Grid>

            {index > 0 && (
            <Grid item xs={12}>
                <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleRemoveEducation(index)}
                sx={{ mt: 1 }}
                >
                Remove
                </Button>
            </Grid>
            )}
        </React.Fragment>
        ))}

        <Grid item xs={12} sx={{display:'flex', justifyContent:"flex-end"}}>
        <Button variant="outlined" size='small' onClick={handleAddEducation}>+ Add Education Detail</Button>
        </Grid>

        <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography fontSize={16} fontWeight={600} color='black'>Employment History</Typography>
            <Divider />
            </Grid>

            {formData.employeementHistory.map((history, index) => (
            <React.Fragment key={index}>
                <Grid item xs={12} sx={{ mt: 2, display:"flex", alignItems:"center" }}>
                <ArrowRightIcon sx={{ fontSize: 24, mr: 1 }} />  
                <Typography fontSize={15}>Employment Details {index + 1}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Current Designation"
                    size="small"
                    value={history.currentDesignation}
                    onChange={(e) => handleEmploymentChange(index, 'currentDesignation', e.target.value)}
                    fullWidth
                    required
                    error={submitted && !history.currentDesignation}
                    helperText={submitted && !history.currentDesignation ? "Current designation is required" : ""}
                />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Last Organization"
                    size="small"
                    value={history.lastOrganization}
                    onChange={(e) => handleEmploymentChange(index, 'lastOrganization', e.target.value)}
                    fullWidth
                    required
                    error={submitted && !history.lastOrganization}
                    helperText={submitted && !history.lastOrganization ? "Last organization is required" : ""}
                />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Start Date"
                    type="date"
                    size="small"
                    value={history.startDate ? history.startDate.slice(0, 10) : ''}
                    onChange={(e) => handleEmploymentChange(index, 'startDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    required
                    error={submitted && !history.startDate}
                    helperText={submitted && !history.startDate ? "Start date is required" : ""}
                />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="End Date"
                    type="date"
                    size="small"
                    value={history.endDate ? history.endDate.slice(0, 10) : ''}
                    onChange={(e) => handleEmploymentChange(index, 'endDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    required
                    error={submitted && !history.endDate}
                    helperText={submitted && !history.endDate ? "End date is required" : ""}
                />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Total Experience"
                    size="small"
                    value={history.totalExperience}
                    onChange={(e) => handleEmploymentChange(index, 'totalExperience', e.target.value)}
                    fullWidth
                    required
                    error={submitted && !history.totalExperience}
                    helperText={submitted && !history.totalExperience ? "Total experience is required" : ""}
                />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Current CTC"
                    size="small"
                    value={history.currentCTC}
                    onChange={(e) => handleEmploymentChange(index, 'currentCTC', e.target.value)}
                    fullWidth
                    required
                    error={submitted && !history.currentCTC}
                    helperText={submitted && !history.currentCTC ? "Current CTC is required" : ""}
                />
                </Grid>

                {index > 0 && (
                <Grid item xs={12}>
                    <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleRemoveEmployment(index)}
                    sx={{ mt: 1 }}
                    >
                    Remove
                    </Button>
                </Grid>
                )}
            </React.Fragment>
            ))}


        <Grid item xs={12} sx={{display:'flex', justifyContent:"flex-end"}}>
            <Button variant="outlined" size='small' onClick={handleAddEmployment}>+ Add Employment Detail</Button>
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography fontSize={16} fontWeight={600}>Nominee Details</Typography>
            <Divider />
            </Grid>
            {formData.nominee.map((nom, index) => (
            <React.Fragment key={index}>
                <Grid item xs={12} sx={{ mt: 2, display:"flex", alignItems:"center" }}>
                <ArrowRightIcon sx={{ fontSize: 24, mr: 1 }} />
                <Typography fontSize={15}>Nominee Details {index + 1}</Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Nominee Name"
                    size="small"
                    value={nom.nomineeName}
                    onChange={(e) => handleNomineeChange(index, 'nomineeName', e.target.value)}
                    fullWidth
                    required
                    error={submitted && !nom.nomineeName}
                    helperText={submitted && !nom.nomineeName ? "Nominee name is required" : ""}
                />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Relation With Employee"
                    size="small"
                    value={nom.relationWithEmployee}
                    onChange={(e) => handleNomineeChange(index, 'relationWithEmployee', e.target.value)}
                    fullWidth
                    required
                    error={submitted && !nom.relationWithEmployee}
                    helperText={submitted && !nom.relationWithEmployee ? "Relation is required" : ""}
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
                    required
                    error={submitted && !nom.nominationType}
                    helperText={submitted && !nom.nominationType ? "Nomination type is required" : ""}
                >
                    {["Primary", "Secondary"].map(i =>
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
                    required
                    error={submitted && !nom.nominationAge}
                    helperText={submitted && !nom.nominationAge ? "Age is required" : ""}
                />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Nominee Address"
                    size="small"
                    value={nom.nomineeAddress}
                    onChange={(e) => handleNomineeChange(index, 'nomineeAddress', e.target.value)}
                    fullWidth
                    required
                    error={submitted && !nom.nomineeAddress}
                    helperText={submitted && !nom.nomineeAddress ? "Address is required" : ""}
                />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Nominee State"
                    size="small"
                    value={nom.nomineeState}
                    onChange={(e) => handleNomineeChange(index, 'nomineeState', e.target.value)}
                    fullWidth
                    required
                    error={submitted && !nom.nomineeState}
                    helperText={submitted && !nom.nomineeState ? "State is required" : ""}
                />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Nominee District"
                    size="small"
                    value={nom.nomineeDistrict}
                    onChange={(e) => handleNomineeChange(index, 'nomineeDistrict', e.target.value)}
                    fullWidth
                    required
                    error={submitted && !nom.nomineeDistrict}
                    helperText={submitted && !nom.nomineeDistrict ? "District is required" : ""}
                />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Nominee Block"
                    size="small"
                    value={nom.nomineeblock}
                    onChange={(e) => handleNomineeChange(index, 'nomineeblock', e.target.value)}
                    fullWidth
                    required
                    error={submitted && !nom.nomineeblock}
                    helperText={submitted && !nom.nomineeblock ? "Block is required" : ""}
                />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Nominee Panchayat"
                    size="small"
                    value={nom.nomineePanchayat}
                    onChange={(e) => handleNomineeChange(index, 'nomineePanchayat', e.target.value)}
                    fullWidth
                    required
                    error={submitted && !nom.nomineePanchayat}
                    helperText={submitted && !nom.nomineePanchayat ? "Panchayat is required" : ""}
                />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Nominee Pincode"
                    size="small"
                    type='number'
                    value={nom.nomineePincode}
                    onChange={(e) => handleNomineeChange(index, 'nomineePincode', e.target.value)}
                    fullWidth
                    required
                    error={submitted && !nom.nomineePincode}
                    helperText={submitted && !nom.nomineePincode ? "Pincode is required" : ""}
                />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Nominee Phone Number"
                    size="small"
                    value={nom.nomineePhoneNumber}
                    onChange={(e) => handleNomineeChange(index, 'nomineePhoneNumber', e.target.value)}
                    fullWidth
                    required
                    error={
                    submitted && (
                        !nom.nomineePhoneNumber ||
                        !/^[6-9]\d{9}$/.test(nom.nomineePhoneNumber)
                    )
                    }
                    helperText={
                    submitted && !nom.nomineePhoneNumber
                        ? "Phone number is required"
                        : submitted && !/^[6-9]\d{9}$/.test(nom.nomineePhoneNumber)
                        ? "Enter a valid 10-digit phone number"
                        : ""
                    }
                />
                </Grid>


                {index > 0 && (
                <Grid item xs={12}>
                    <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleRemoveNominee(index)}
                    sx={{ mt: 1 }}
                    size="small"
                    >
                    Remove
                    </Button>
                </Grid>
                )}
            </React.Fragment>
            ))}


           <Grid item xs={12} sx={{display:'flex', justifyContent:"flex-end"}}>
            <Button variant="outlined" size='small' onClick={handleAddNominee}>+ Add Nominee</Button>
            </Grid>
        
            <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography fontSize={16} fontWeight={600}>Employee Target Details</Typography>
            <Divider sx={{ mb: 2 }} />
            </Grid>

            {formData.employeeTarget.map((target, index) => (
            <React.Fragment key={index}>
            <Grid item xs={12} sx={{ mt: 2, display:"flex", alignItems:"center" }}>
                 <ArrowRightIcon sx={{ fontSize: 24, mr: 1 }} />  <Typography fontSize={15}>Target Detail {index + 1}</Typography>
               </Grid>
                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Target Title"
                    size="small"
                    name="title"
                    value={target.title}
                    onChange={(e) => handleEmployeeTargetChange(index, 'title', e.target.value)}
                    fullWidth 
                />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Target Value"
                    size="small"
                    name="value"
                    value={target.value}
                    onChange={(e) => handleEmployeeTargetChange(index, 'value', e.target.value)}
                    fullWidth 
                />
                </Grid>
              {index>0 && <Grid item xs={12} sm={6} md={2} sx={{ display: 'flex', alignItems: 'center' }}>
                <Button
                    color="error"
                    variant="outlined"
                    onClick={() => removeEmployeeTarget(index)}
                    size="small"
                >
                    Remove
                </Button>
                </Grid>}
            </React.Fragment>
            ))}

            <Grid item xs={12}>
            <Button
                variant="outlined"
                onClick={addEmployeeTarget}
                size="small"
                sx={{ mt: 1 }}
            >
                Add Target
            </Button>
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
            <Grid item xs={12} sm={6} md={3} key={doc.name}>
                <Card sx={{ borderRadius: 2, boxShadow: 3, p: 2, height: '260px' }}>
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

                    {submitted && !formData[doc.name] && (
                    <Typography fontSize={12} sx={{color:'red'}} my={3}>
                        * {doc.label} is required
                    </Typography>
                    )}

                    <Button
                    variant="outlined"
                    component="label"
                    size="small"
                    fullWidth
                    required
                    sx={{ borderRadius: 2 }}
                    >
                    Upload {doc.label}
                    <input type="file" hidden onChange={(e) => handleFileUpload(e, doc.name)} />
                    </Button>
                </CardContent>
                </Card>
            </Grid>
            ))}

        {/* <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography fontSize={16} fontWeight={600}>Other Details</Typography>

            <Divider />
            </Grid> 
            <Grid item xs={12} sm={6} md={4}><TextField size='small' select label="Company" name="company" value={formData.company} onChange={handleChange} fullWidth required>
        {companies.map(i=>
        <MenuItem key={i._id} value={i._id}>{i.companyName}</MenuItem>
        )}
        </TextField></Grid>
        <Grid item xs={12} sm={6} md={4}><TextField label="Description" multiline rows={2} size='small' name="description" value={formData.description} onChange={handleChange} fullWidth required /></Grid>*/}

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
