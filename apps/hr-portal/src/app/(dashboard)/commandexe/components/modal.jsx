// import React from 'react';

// import { Grid, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

// import CancelButton from './CancelButton';
// import SubmitButton from './SubmitButton';

// const Modal = ({
//   open,
//   handleClose,
//   handleSubmit,
//   width,
//   maxWidth = 'md',
//   minWidth = '600px', // Define a default minWidth value as a string
//   title,
//   content,
//   children,
//   saveButtonText = 'Save',
//   cancelButtonText = 'Cancel',
//   showButton = true
// }) => {
//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       maxWidth={maxWidth}
//       sx={{
//         '& .MuiDialog-paper': {
//           minWidth: minWidth,
//           width: width,
//           backgroundColor: 'white',
//         },
//         '& .MuiDialogTitle-root': {
//           backgroundColor: 'white',
//           color: 'black',
//           padding: '10px 20px',
//           paddingTop: '22px',
//           fontSize: '16px',
//         },
//         '& .MuiDialogActions-root': {
//           backgroundColor: 'white',
//           padding: '16px',
//         },
//         '& .MuiDialogContent-root': {
//           backgroundColor: 'white',
//           color: 'black',
//           padding: '16px',
//         },
//         '& .MuiInputBase-root': {
//           color: 'black',
//         },
//         '& .MuiOutlinedInput-root': {
//           '& fieldset': { borderColor: 'black' },
//           '&:hover fieldset': { borderColor: 'black' },
//           '&.Mui-focused fieldset': { borderColor: 'black' },
//         },
//         '& .MuiFormLabel-root': { color: 'black' },
//       }}
//       BackdropProps={{
//         style: {
//           backgroundColor: '#00000045', // Semi-transparent black backdrop
//           backdropFilter: 'blur(8px) saturate(100%)',
//         },
//       }}
//     >
//       <DialogTitle />
//       <DialogContent sx={{ backgroundColor: 'white' }}>
//         <Grid item xs={12} padding={'5px 10px'}>
//           <Typography variant="h5">
//             {title}
//           </Typography>
//         </Grid>
//         <Grid item xs={12} padding={'0px 10px'}>
//           <Typography className="text-slate-500">{content}</Typography>
//         </Grid>
//         {children}
//       </DialogContent>
//       {showButton && (
//         <DialogActions>
//           <CancelButton onClick={handleClose} color="secondary">
//             {cancelButtonText}
//           </CancelButton>
//           <SubmitButton onClick={handleSubmit} variant="contained" color="primary">
//             {saveButtonText}
//           </SubmitButton>
//         </DialogActions>
//       )}
//     </Dialog>
//   );
// };

// export default Modal;







import React from 'react';

import { Grid, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

import CancelButton from './CancelButton';
import SubmitButton from './SubmitButton';

const Modal = ({
  open,
  handleClose,
  handleSubmit,
  width,
  maxWidth = 'md',
  fullWidth = true,  // Add fullWidth prop with default value
  title,
  content,
  children,
  saveButtonText = 'Save',
  cancelButtonText = 'Cancel',
  showButton = true
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}  // Pass fullWidth to Dialog
      sx={{
        '& .MuiDialog-paper': {
          width: width,  // Only use width if provided
          backgroundColor: 'white',
        },
        '& .MuiDialogTitle-root': {
          backgroundColor: 'white',
          color: 'black',
          padding: '10px 20px',
          paddingTop: '22px',
          fontSize: '16px',
        },
        '& .MuiDialogActions-root': {
          backgroundColor: 'white',
          padding: '16px',
        },
        '& .MuiDialogContent-root': {
          backgroundColor: 'white',
          color: 'black',
          padding: '16px',
        },
        '& .MuiInputBase-root': {
          color: 'black',
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': { borderColor: 'black' },
          '&:hover fieldset': { borderColor: 'black' },
          '&.Mui-focused fieldset': { borderColor: 'black' },
        },
        '& .MuiFormLabel-root': { color: 'black' },
      }}
      BackdropProps={{
        style: {
          backgroundColor: '#00000045', // Semi-transparent black backdrop
          backdropFilter: 'blur(8px) saturate(100%)',
        },
      }}
    >
      <DialogTitle />
      <DialogContent sx={{ backgroundColor: 'white' }}>
        <Grid item xs={12} padding={'5px 10px'}>
          <Typography variant="h6" className="font-bold">
            {title}
          </Typography>
          <Button className="absolute top-1 right-2" onClick={handleClose}>
            <i className="tabler-x" style={{ fontSize: '20px' }}></i>
          </Button>
        </Grid>
        <Grid item xs={12} padding={'0px 10px'}>
          <Typography className="text-slate-500">{content}</Typography>
        </Grid>
        {children}
      </DialogContent>
      {showButton && (
        <DialogActions>
          <CancelButton onClick={handleClose} color="secondary">
            {cancelButtonText}
          </CancelButton>
          <SubmitButton onClick={handleSubmit} variant="contained" color="primary">
            {saveButtonText}
          </SubmitButton>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default Modal;