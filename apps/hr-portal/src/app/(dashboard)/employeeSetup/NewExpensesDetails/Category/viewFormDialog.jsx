// import React, { useState, useEffect } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   FormControlLabel,
//   Checkbox,
//   Radio,
//   RadioGroup,
//   FormLabel,
//   Box,
//   Typography,
//   Chip,
//   OutlinedInput,
//   FormHelperText,
//   IconButton,
//   CircularProgress,
//   Alert,
//   Paper,
//   Divider
// } from '@mui/material';
// import { Close, Visibility } from '@mui/icons-material';
// import axios from 'axios';
// import ViewFormField from './viewFormField';


// const ViewFormDialog = ({ open, onClose, formId, baseUrl, token }) => {
//   const [formData, setFormData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (open && formId) {
//       fetchFormData();
//     }
//   }, [open, formId]);

//   const fetchFormData = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const response = await axios.get(`${baseUrl}/v1/api/dynamicForm/${formId}`, {
//         headers: {
//           'Content-Type': 'application/json',
//           authorization: token,
//         },
//       });

//       console.log('Fetched view Form Data:', response.data);

//       const form = response.data?.items;
//       if (form) {
//         setFormData(form);
//       }
//     } catch (err) {
//       setError('Failed to load form data');
//       console.error('Error fetching form data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     setFormData(null);
//     setError('');
//     onClose();
//   };

//   const getActiveFields = () => {
//     if (!formData?.fields) return [];
    
//     return formData.fields
//       .filter(field => field.isActive)
//       .sort((a, b) => a.displayOrder - b.displayOrder);
//   };

//   if (loading) {
//     return (
//       <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
//         <DialogContent>
//           <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
//             <CircularProgress />
//           </Box>
//         </DialogContent>
//       </Dialog>
//     );
//   }

//   return (
//     <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
//       <DialogTitle>
//         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//           <Box>
//             <Typography variant="h5">
//               {formData?.name || 'Form Preview'}
//             </Typography>
//             <Typography variant="caption" color="text.secondary">
//               Form ID: {formData?.formId} | Version: {formData?.version}
//             </Typography>
//           </Box>
//           <IconButton onClick={handleClose} size="small">
//             <Close />
//           </IconButton>
//         </Box>
//       </DialogTitle>
      
//       <DialogContent dividers>
//         {error && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {error}
//           </Alert>
//         )}
        
//         {formData?.description && (
//           <Alert severity="info" sx={{ mb: 3 }}>
//             <Typography variant="body2">
//               <strong>Description:</strong> {formData.description}
//             </Typography>
//           </Alert>
//         )}

//         <Box sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
//           <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
//             Form Fields Preview ({getActiveFields().length} fields)
//           </Typography>
          
//           {getActiveFields().map((field, index) => (
//             <ViewFormField key={field.fieldId} field={field} />
//           ))}
          
//           {getActiveFields().length === 0 && (
//             <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
//               No active fields found in this form.
//             </Typography>
//           )}
//         </Box>
//       </DialogContent>
      
//       <DialogActions>
//         <Button onClick={handleClose} variant="contained">
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default ViewFormDialog;

"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  Typography,
  Box,
} from "@mui/material"
import { Close } from "@mui/icons-material"
import axios from "axios"
import ViewFormField from "./viewFormField"

const ViewFormDialog = ({ open, onClose, formId, baseUrl, token }) => {
  const [formData, setFormData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (open && formId) {
      fetchFormData()
    }
  }, [open, formId])

  const fetchFormData = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await axios.get(`${baseUrl}/v1/api/dynamicForm/${formId}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      console.log("Fetched view Form Data:", response.data)
      const form = response.data?.items
      if (form) {
        setFormData(form)
      }
    } catch (err) {
      setError("Failed to load form data")
      console.error("Error fetching form data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData(null)
    setError("")
    onClose()
  }

  const getActiveFields = () => {
    if (!formData?.fields) return []

    return formData.fields.filter((field) => field.isActive).sort((a, b) => a.displayOrder - b.displayOrder)
  }

  if (loading) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogContent>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h5" component="h2">
              {formData?.name || "Form Preview"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Form ID: {formData?.formId} | Version: {formData?.version}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ maxHeight: "70vh", overflowY: "auto" }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {formData?.description && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Description:</strong> {formData.description}
            </Typography>
          </Alert>
        )}

        <Box component="form" sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {getActiveFields().map((field, index) => (
              <ViewFormField key={field.fieldId} field={field} />
            ))}

            {getActiveFields().length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                No active fields found in this form.
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>

      <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", borderTop: "1px solid #e0e0e0" }}>
        <Button onClick={handleClose} variant="contained" sx={{ px: 4 }}>
          Close
        </Button>
      </Box>
    </Dialog>
  )
}

export default ViewFormDialog
