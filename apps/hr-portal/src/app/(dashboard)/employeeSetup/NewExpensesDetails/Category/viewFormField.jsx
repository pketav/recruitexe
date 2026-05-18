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

// // View-only Form Field Component
// const ViewFormField = ({ field }) => {
//   const {
//     fieldName,
//     fieldType,
//     label,
//     placeholder,
//     isRequired,
//     options,
//     defaultValue,
//     helpText,
//     validation
//   } = field;

//   const renderFieldPreview = () => {
//     switch (fieldType) {
//       case 'text':
//       case 'email':
//       case 'phone':
//         return (
//           <TextField
//             fullWidth
//             label={label}
//             placeholder={placeholder}
//             value={defaultValue || ''}
//             required={isRequired}
//             helperText={helpText}
//             variant="outlined"
//             size="small"
//             InputProps={{ readOnly: true }}
//             sx={{ backgroundColor: '#f5f5f5' }}
//           />
//         );

//       case 'number':
//       case 'currency':
//         return (
//           <TextField
//             fullWidth
//             type="number"
//             label={label}
//             placeholder={placeholder}
//             value={defaultValue || ''}
//             required={isRequired}
//             helperText={helpText}
//             variant="outlined"
//             size="small"
//             InputProps={{ 
//               readOnly: true,
//               startAdornment: fieldType === 'currency' ? <Typography variant="body2">₹</Typography> : null
//             }}
//             sx={{ backgroundColor: '#f5f5f5' }}
//           />
//         );

//       case 'textarea':
//         return (
//           <TextField
//             fullWidth
//             multiline
//             rows={4}
//             label={label}
//             placeholder={placeholder}
//             value={defaultValue || ''}
//             required={isRequired}
//             helperText={helpText}
//             variant="outlined"
//             size="small"
//             InputProps={{ readOnly: true }}
//             sx={{ backgroundColor: '#f5f5f5' }}
//           />
//         );

//       case 'date':
//         return (
//           <TextField
//             fullWidth
//             label={label}
//             value={defaultValue || ''}
//             required={isRequired}
//             helperText={helpText}
//             variant="outlined"
//             size="small"
//             InputProps={{ readOnly: true }}
//             sx={{ backgroundColor: '#f5f5f5' }}
//           />
//         );

//       case 'datetime':
//         return (
//           <TextField
//             fullWidth
//             label={label}
//             value={defaultValue || ''}
//             required={isRequired}
//             helperText={helpText}
//             variant="outlined"
//             size="small"
//             InputProps={{ readOnly: true }}
//             sx={{ backgroundColor: '#f5f5f5' }}
//           />
//         );

//       case 'select':
//         return (
//           <FormControl fullWidth required={isRequired} size="small">
//             <InputLabel>{label}</InputLabel>
//             <Select
//               value={defaultValue || ''}
//               label={label}
//               readOnly
//               sx={{ backgroundColor: '#f5f5f5' }}
//             >
//               {options?.map((option) => (
//                 <MenuItem key={option.value} value={option.value}>
//                   {option.label}
//                 </MenuItem>
//               ))}
//             </Select>
//             {helpText && <FormHelperText>{helpText}</FormHelperText>}
//           </FormControl>
//         );

//       case 'multiselect':
//         return (
//           <FormControl fullWidth required={isRequired} size="small">
//             <InputLabel>{label}</InputLabel>
//             <Select
//               multiple
//               value={defaultValue || []}
//               input={<OutlinedInput label={label} />}
//               readOnly
//               sx={{ backgroundColor: '#f5f5f5' }}
//               renderValue={(selected) => (
//                 <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                   {selected.map((val) => {
//                     const option = options?.find(opt => opt.value === val);
//                     return (
//                       <Chip key={val} label={option?.label || val} size="small" />
//                     );
//                   })}
//                 </Box>
//               )}
//             >
//               {options?.map((option) => (
//                 <MenuItem key={option.value} value={option.value}>
//                   {option.label}
//                 </MenuItem>
//               ))}
//             </Select>
//             {helpText && <FormHelperText>{helpText}</FormHelperText>}
//           </FormControl>
//         );

//       case 'radio':
//         return (
//           <FormControl required={isRequired}>
//             <FormLabel>{label}</FormLabel>
//             <RadioGroup value={defaultValue || ''} row>
//               {options?.map((option) => (
//                 <FormControlLabel
//                   key={option.value}
//                   value={option.value}
//                   control={<Radio size="small" disabled />}
//                   label={option.label}
//                 />
//               ))}
//             </RadioGroup>
//             {helpText && <FormHelperText>{helpText}</FormHelperText>}
//           </FormControl>
//         );

//       case 'checkbox':
//         return (
//           <FormControl>
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={defaultValue || false}
//                   size="small"
//                   disabled
//                 />
//               }
//               label={label}
//               required={isRequired}
//             />
//             {helpText && <FormHelperText>{helpText}</FormHelperText>}
//           </FormControl>
//         );

//       case 'file':
//         return (
//           <Box>
//             <Typography variant="body2" sx={{ mb: 1 }}>
//               {label} {isRequired && <span style={{ color: 'red' }}>*</span>}
//             </Typography>
//             <TextField
//               fullWidth
//               type="file"
//               required={isRequired}
//               helperText={helpText}
//               variant="outlined"
//               size="small"
//               InputProps={{ readOnly: true }}
//               sx={{ backgroundColor: '#f5f5f5' }}
//             />
//           </Box>
//         );

//       default:
//         return (
//           <TextField
//             fullWidth
//             label={label}
//             placeholder={placeholder}
//             value={defaultValue || ''}
//             required={isRequired}
//             helperText={helpText}
//             variant="outlined"
//             size="small"
//             InputProps={{ readOnly: true }}
//             sx={{ backgroundColor: '#f5f5f5' }}
//           />
//         );
//     }
//   };

//   return (
//     <Paper elevation={1} sx={{ p: 2, mb: 2, border: '1px solid #e0e0e0' }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
//         <Typography variant="subtitle2" color="primary">
//           Field Type: {fieldType.toUpperCase()}
//         </Typography>
//         <Typography variant="caption" color="text.secondary">
//           Order: {field.displayOrder}
//         </Typography>
//       </Box>
      
//       {renderFieldPreview()}
      
//       {/* Field Details */}
//       <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid #f0f0f0' }}>
//         <Typography variant="caption" color="text.secondary">
//           Field Name: {fieldName} | Required: {isRequired ? 'Yes' : 'No'}
//         </Typography>
        
//         {validation && (
//           <Box sx={{ mt: 1 }}>
//             <Typography variant="caption" color="text.secondary">
//               Validation: 
//               {validation.minLength && ` Min Length: ${validation.minLength}`}
//               {validation.maxLength && ` Max Length: ${validation.maxLength}`}
//               {validation.min && ` Min: ${validation.min}`}
//               {validation.max && ` Max: ${validation.max}`}
//               {validation.pattern && ` Pattern: ${validation.pattern}`}
//             </Typography>
//           </Box>
//         )}
        
//         {field.conditionalLogic && (
//           <Box sx={{ mt: 1 }}>
//             <Typography variant="caption" color="warning.main">
//               Conditional: Show if field at position {field.conditionalLogic.showIf?.displayOrder} {field.conditionalLogic.showIf?.operator} "{field.conditionalLogic.showIf?.value}"
//             </Typography>
//           </Box>
//         )}
//       </Box>
//     </Paper>
//   );
// };

// export default ViewFormField;

"use client"

import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormLabel,
  Box,
  Typography,
  Chip,
  OutlinedInput,
  FormHelperText,
  Paper,
} from "@mui/material"

const ViewFormField = ({ field }) => {
  const { fieldName, fieldType, label, placeholder, isRequired, options, defaultValue, helpText, validation } = field

  const renderField = () => {
    switch (fieldType) {
      case "text":
      case "email":
      case "phone":
        return (
          <TextField
            fullWidth
            label={label}
            placeholder={placeholder}
            value={defaultValue || ""}
            required={isRequired}
            helperText={helpText}
            variant="outlined"
            type={fieldType === "email" ? "email" : fieldType === "phone" ? "tel" : "text"}
            InputProps={{ readOnly: true }}
            sx={{ backgroundColor: "#fafafa" }}
          />
        )

      case "number":
      case "currency":
        return (
          <TextField
            fullWidth
            type="number"
            label={label}
            placeholder={placeholder}
            value={defaultValue || ""}
            required={isRequired}
            helperText={helpText}
            variant="outlined"
            InputProps={{
              readOnly: true,
              startAdornment: fieldType === "currency" ? <Typography variant="body2">₹</Typography> : null,
            }}
            sx={{ backgroundColor: "#fafafa" }}
          />
        )

      case "textarea":
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            label={label}
            placeholder={placeholder}
            value={defaultValue || ""}
            required={isRequired}
            helperText={helpText}
            variant="outlined"
            InputProps={{ readOnly: true }}
            sx={{ backgroundColor: "#fafafa" }}
          />
        )

      case "date":
        return (
          <TextField
            fullWidth
            type="date"
            label={label}
            value={defaultValue || ""}
            required={isRequired}
            helperText={helpText}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: true }}
            sx={{ backgroundColor: "#fafafa" }}
          />
        )

      case "datetime":
        return (
          <TextField
            fullWidth
            type="datetime-local"
            label={label}
            value={defaultValue || ""}
            required={isRequired}
            helperText={helpText}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: true }}
            sx={{ backgroundColor: "#fafafa" }}
          />
        )

      case "select":
        return (
          <FormControl fullWidth required={isRequired}>
            <InputLabel>{label}</InputLabel>
            <Select value={defaultValue || ""} label={label} readOnly sx={{ backgroundColor: "#fafafa" }}>
              {options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {helpText && <FormHelperText>{helpText}</FormHelperText>}
          </FormControl>
        )

      case "multiselect":
        return (
          <FormControl fullWidth required={isRequired}>
            <InputLabel>{label}</InputLabel>
            <Select
              multiple
              value={defaultValue || []}
              input={<OutlinedInput label={label} />}
              readOnly
              sx={{ backgroundColor: "#fafafa" }}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((val) => {
                    const option = options?.find((opt) => opt.value === val)
                    return <Chip key={val} label={option?.label || val} size="small" />
                  })}
                </Box>
              )}
            >
              {options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {helpText && <FormHelperText>{helpText}</FormHelperText>}
          </FormControl>
        )

      case "radio":
        return (
          <FormControl required={isRequired}>
            <FormLabel>{label}</FormLabel>
            <RadioGroup value={defaultValue || ""} row>
              {options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio disabled />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {helpText && <FormHelperText>{helpText}</FormHelperText>}
          </FormControl>
        )

      case "checkbox":
        return (
          <Box>
            <FormControlLabel
              control={<Checkbox checked={defaultValue || false} disabled />}
              label={label}
              required={isRequired}
            />
            {helpText && <FormHelperText sx={{ ml: 4 }}>{helpText}</FormHelperText>}
          </Box>
        )

      case "file":
        return (
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              {label} {isRequired && <span style={{ color: "red" }}>*</span>}
            </Typography>
            <TextField
              fullWidth
              type="file"
              required={isRequired}
              helperText={helpText}
              variant="outlined"
              InputProps={{ readOnly: true }}
              sx={{ backgroundColor: "#fafafa" }}
            />
          </Box>
        )

      default:
        return (
          <TextField
            fullWidth
            label={label}
            placeholder={placeholder}
            value={defaultValue || ""}
            required={isRequired}
            helperText={helpText}
            variant="outlined"
            InputProps={{ readOnly: true }}
            sx={{ backgroundColor: "#fafafa" }}
          />
        )
    }
  }

  return (
    <Box sx={{ mb: 2 }}>
      {renderField()}

      {/* Optional: Show field metadata in development */}
      {process.env.NODE_ENV === "development" && (
        <Paper
          elevation={0}
          sx={{
            mt: 1,
            p: 1.5,
            backgroundColor: "#f5f5f5",
            border: "1px dashed #ccc",
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
            <strong>Field Type:</strong> {fieldType.toUpperCase()} | <strong>Order:</strong> {field.displayOrder} |{" "}
            <strong>Required:</strong> {isRequired ? "Yes" : "No"}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
            <strong>Field Name:</strong> {fieldName}
          </Typography>

          {validation && (
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
              <strong>Validation:</strong>
              {validation.minLength && ` Min Length: ${validation.minLength}`}
              {validation.maxLength && ` Max Length: ${validation.maxLength}`}
              {validation.min && ` Min: ${validation.min}`}
              {validation.max && ` Max: ${validation.max}`}
              {validation.pattern && ` Pattern: ${validation.pattern}`}
            </Typography>
          )}

          {field.conditionalLogic && (
            <Typography variant="caption" color="warning.main" sx={{ display: "block", mt: 0.5 }}>
              <strong>Conditional:</strong> Show if field at position {field.conditionalLogic.showIf?.displayOrder}{" "}
              {field.conditionalLogic.showIf?.operator} "{field.conditionalLogic.showIf?.value}"
            </Typography>
          )}
        </Paper>
      )}
    </Box>
  )
}   

export default ViewFormField
    