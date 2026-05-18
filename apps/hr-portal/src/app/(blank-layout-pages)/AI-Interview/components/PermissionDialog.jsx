"use client"
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Grid, Paper } from "@mui/material"
import { Videocam, Mic } from "@mui/icons-material"

export default function PermissionDialog({ open, onRequestPermissions }) {
  return (
    <Dialog open={open} disableEscapeKeyDown maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: "center", pt: 3, bgcolor: "white" }}>
        <Videocam color="primary" sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant="h5" fontWeight="bold" color="text.primary">
          Camera & Microphone Access Required
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ textAlign: "center", pb: 2, bgcolor: "white" }}>
        <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
          RecruitExe AI needs access to your camera and microphone to conduct the interview effectively.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#f1f5f9", border: "1px solid #e2e8f0" }}>
              <Videocam color="primary" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="subtitle2" color="text.primary">
                Video Recording
              </Typography>
              <Typography variant="caption" color="text.secondary">
                For visual assessment
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#f1f5f9", border: "1px solid #e2e8f0" }}>
              <Mic color="primary" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="subtitle2" color="text.primary">
                Voice Input
              </Typography>
              <Typography variant="caption" color="text.secondary">
                For voice responses
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 3, bgcolor: "white" }}>
        <Button variant="contained" size="large" onClick={onRequestPermissions} sx={{ px: 4 }}>
          Allow Access & Continue
        </Button>
      </DialogActions>
    </Dialog>
  )
}
