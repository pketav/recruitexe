"use client"
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  Button,
  LinearProgress,
  Paper,
  Stack,
  Divider,
} from "@mui/material"
import {
  BusinessCenter,
  People,
  TrendingUp,
  TrendingDown,
  Visibility,
  Star,
  Assignment,
  Schedule,
} from "@mui/icons-material"

const RecruiterCard = ({ recruiter, onClick, index = 0 }) => {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatNumber = (num) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return num?.toString() || "0"
  }

  // Extract REAL data from API structure
  const overview = recruiter.items?.overview || {}
  const summary = recruiter.summary || {}
  const totalPosts = overview.totalPosts || summary.totalPosts || 0
  const activePosts = overview.activePosts || summary.activePosts || 0
  const pendingPosts = overview.pendingPosts || 0
  const inactivePosts = overview.inactivePosts || 0
  const rejectedPosts = overview.rejectedPosts || 0
  const expiredPosts = overview.expiredPosts || 0
  const totalApplicants = overview.totalApplicants || summary.totalApplicants || 0
  const totalPositions = overview.totalPositions || summary.totalPositions || 0
  const successRate = overview.successRate || 0
  const avgApplicantsPerPost = overview.avgApplicantsPerPost || 0
  const hrId = `HR${recruiter.recruiterId?.slice(-3) || "001"}`

  // Performance indicators
  const isHighPerformer = successRate > 70
  const isGoodPerformer = successRate > 40
  const performanceLevel = isHighPerformer ? "Excellent" : isGoodPerformer ? "Good" : "Needs Improvement"
  const performanceColor = isHighPerformer ? "#4caf50" : isGoodPerformer ? "#ff9800" : "#f44336"
  const PerformanceIcon = successRate > 50 ? TrendingUp : TrendingDown

  return (
    <Card
      sx={{
        height: { xs: 480, sm: 520 }, // Responsive height
        cursor: "pointer",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        border: "1px solid #e2e8f0",
        borderRadius: 3,
        backgroundColor: "#ffffff",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
          borderColor: "#3b82f6",
          "& .card-header": {
            background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
          },
          "& .view-button": {
            backgroundColor: "#3b82f6",
            borderColor: "#3b82f6",
            color: "white",
            transform: "translateY(-2px)",
          },
        },
      }}
      onClick={() => onClick?.(recruiter)}
    >
      {/* Header Section with Gradient */}
      <Box
        className="card-header"
        sx={{
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          p: { xs: 2, sm: 2.5 },
          pb: 2,
          transition: "all 0.4s ease",
          flexShrink: 0,
        }}
      >
        {/* HR ID and Performance Badge */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Typography
            variant="caption"
            sx={{
              color: "#64748b",
              fontSize: { xs: "10px", sm: "11px" },
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
            }}
          >
            {/* {hrId} */}
          </Typography>
          <Chip
            icon={<PerformanceIcon sx={{ fontSize: { xs: 12, sm: 14 } }} />}
            label={`${successRate.toFixed(1)}%`}
            size="small"
            sx={{
              backgroundColor: performanceColor,
              color: "white",
              fontWeight: 700,
              fontSize: { xs: "10px", sm: "11px" },
              height: { xs: 20, sm: 24 },
              "& .MuiChip-icon": {
                color: "white",
              },
            }}
          />
        </Box>

        {/* Profile Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, sm: 2 } }}>
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={recruiter.recruiterImage}
              sx={{
                width: { xs: 44, sm: 52 },
                height: { xs: 44, sm: 52 },
                background: recruiter.recruiterImage
                  ? "transparent"
                  : "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                fontSize: { xs: "14px", sm: "16px" },
                fontWeight: 700,
                color: "#ffffff",
                border: "3px solid #ffffff",
                boxShadow: "0 6px 16px rgba(59, 130, 246, 0.3)",
              }}
            >
              {!recruiter.recruiterImage && getInitials(recruiter.recruiterName)}
            </Avatar>
            {/* Status indicator */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: { xs: 12, sm: 14 },
                height: { xs: 12, sm: 14 },
                backgroundColor: activePosts > 0 ? "#4caf50" : "#94a3b8",
                border: "2px solid #ffffff",
                borderRadius: "50%",
              }}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "14px", sm: "15px" },
                fontWeight: 700,
                color: "#1e293b",
                lineHeight: 1.3,
                mb: 0.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {recruiter.recruiterName}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontSize: { xs: "10px", sm: "11px" },
                mb: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {recruiter.recruiterEmail || "Recruitment Specialist"}
            </Typography>
            <Stack direction="row" spacing={0.5}>
              {recruiter.roles?.slice(0, 2).map((role, idx) => (
                <Chip
                  key={idx}
                  label={role}
                  size="small"
                  sx={{
                    fontSize: { xs: "7px", sm: "8px" },
                    height: { xs: 14, sm: 16 },
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    color: "#3b82f6",
                    fontWeight: 600,
                    "& .MuiChip-label": { px: 0.8 },
                  }}
                />
              ))}
            </Stack>
          </Box>
        </Box>
      </Box>

      <CardContent
        sx={{
          p: { xs: 2, sm: 2.5 },
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Key Metrics */}
        <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
          <Box
            sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: { xs: 1, sm: 1.5 }, mb: { xs: 2, sm: 2.5 } }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 1, sm: 1.5 },
                textAlign: "center",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#f1f5f9",
                  transform: "translateY(-1px)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, mb: 0.5 }}>
                <BusinessCenter sx={{ fontSize: { xs: 14, sm: 16 }, color: "#3b82f6" }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, color: "#1e293b", fontSize: { xs: "16px", sm: "18px" } }}
                >
                  {totalPosts}
                </Typography>
              </Box>
              <Typography
                variant="caption"
                sx={{ color: "#64748b", fontWeight: 600, fontSize: { xs: "9px", sm: "10px" } }}
              >
                Job Posts
              </Typography>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", fontSize: { xs: "7px", sm: "8px" }, mt: 0.5 }}
              >
                <Typography variant="caption" sx={{ color: "#4caf50", fontSize: { xs: "7px", sm: "8px" } }}>
                  {activePosts} Active
                </Typography>
                <Typography variant="caption" sx={{ color: "#ff9800", fontSize: { xs: "7px", sm: "8px" } }}>
                  {pendingPosts} Pending
                </Typography>
              </Box>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: { xs: 1, sm: 1.5 },
                textAlign: "center",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#f1f5f9",
                  transform: "translateY(-1px)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, mb: 0.5 }}>
                <People sx={{ fontSize: { xs: 14, sm: 16 }, color: "#8b5cf6" }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, color: "#1e293b", fontSize: { xs: "16px", sm: "18px" } }}
                >
                  {formatNumber(totalApplicants)}
                </Typography>
              </Box>
              <Typography
                variant="caption"
                sx={{ color: "#64748b", fontWeight: 600, fontSize: { xs: "9px", sm: "10px" } }}
              >
                Applications
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#8b5cf6", fontSize: { xs: "7px", sm: "8px" }, display: "block", mt: 0.5 }}
              >
                {avgApplicantsPerPost.toFixed(1)} avg/post
              </Typography>
            </Paper>
          </Box>

          {/* Performance Level */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 1, sm: 1.5 },
              backgroundColor: `${performanceColor}08`,
              border: `1px solid ${performanceColor}20`,
              borderRadius: 2,
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "#1e293b", fontSize: { xs: "11px", sm: "12px" } }}
              >
                Performance Level
              </Typography>
              <Star sx={{ fontSize: { xs: 12, sm: 14 }, color: performanceColor }} />
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: performanceColor,
                fontWeight: 700,
                fontSize: { xs: "10px", sm: "11px" },
                mb: 1,
              }}
            >
              {performanceLevel}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={successRate}
              sx={{
                height: { xs: 4, sm: 5 },
                borderRadius: 3,
                backgroundColor: `${performanceColor}20`,
                "& .MuiLinearProgress-bar": {
                  backgroundColor: performanceColor,
                  borderRadius: 3,
                },
              }}
            />
          </Paper>
        </Box>

        {/* Job Post Status Breakdown */}
        <Box sx={{ mb: 2, flex: 1 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: "#1e293b", mb: 1.5, fontSize: { xs: "11px", sm: "12px" } }}
          >
            Job Post Status
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Assignment sx={{ fontSize: { xs: 12, sm: 14 }, color: "#4caf50" }} />
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "#64748b", fontSize: { xs: "10px", sm: "11px" } }}
              >
                Active
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{ fontWeight: 800, color: "#4caf50", fontSize: { xs: "13px", sm: "14px" } }}
            >
              {activePosts}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Schedule sx={{ fontSize: { xs: 12, sm: 14 }, color: "#ff9800" }} />
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "#64748b", fontSize: { xs: "10px", sm: "11px" } }}
              >
                Pending
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{ fontWeight: 800, color: "#ff9800", fontSize: { xs: "13px", sm: "14px" } }}
            >
              {pendingPosts}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <BusinessCenter sx={{ fontSize: { xs: 12, sm: 14 }, color: "#64748b" }} />
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "#64748b", fontSize: { xs: "10px", sm: "11px" } }}
              >
                Inactive
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{ fontWeight: 800, color: "#64748b", fontSize: { xs: "13px", sm: "14px" } }}
            >
              {inactivePosts}
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={totalPosts > 0 ? (activePosts / totalPosts) * 100 : 0}
            sx={{
              height: { xs: 5, sm: 6 },
              borderRadius: 3,
              backgroundColor: "#e2e8f0",
              "& .MuiLinearProgress-bar": {
                background: "linear-gradient(90deg, #4caf50 0%, #66bb6a 100%)",
                borderRadius: 3,
              },
            }}
          />
        </Box>

        <Divider sx={{ mb: 1.5 }} />

        {/* Action Button */}
        <Button
          className="view-button"
          variant="outlined"
          fullWidth
          startIcon={<Visibility sx={{ fontSize: { xs: 14, sm: 16 } }} />}
          sx={{
            borderColor: "#e2e8f0",
            color: "#64748b",
            fontWeight: 700,
            textTransform: "none",
            borderRadius: 2,
            py: { xs: 1, sm: 1.2 },
            fontSize: { xs: "11px", sm: "12px" },
            transition: "all 0.3s ease",
            flexShrink: 0,
            "&:hover": {
              backgroundColor: "#3b82f6",
              borderColor: "#3b82f6",
              color: "white",
              transform: "translateY(-2px)",
            },
          }}
        >
          View Performance Dashboard
        </Button>
      </CardContent>
    </Card>
  )
}

export default RecruiterCard
