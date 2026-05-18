"use client"

import { Dialog, DialogContent, Typography, Box, Avatar, CircularProgress } from "@mui/material"
import { Security as SecurityIcon } from "@mui/icons-material"

const TransactionProcessingDialog = ({ open, onClose, message = "Processing your transaction..." }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          borderRadius: "20px",
          background: "#ffffff",
        },
      }}
    >
      <DialogContent sx={{ p: 4, textAlign: "center" }}>
        <Avatar
          sx={{
            width: 64,
            height: 64,
            background: "linear-gradient(135deg, #2563eb, #3b82f6)",
            mx: "auto",
            mb: 3,
          }}
        >
          <CircularProgress size={32} sx={{ color: "white" }} />
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b", mb: 1 }}>
          Transaction in Progress
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748b", mb: 2 }}>
          {message}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
          <SecurityIcon sx={{ fontSize: 16, color: "#10b981" }} />
          <Typography variant="caption" sx={{ color: "#64748b" }}>
            Secure payment processing
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default TransactionProcessingDialog
