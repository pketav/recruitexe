"use client"
import { useState, useRef, useEffect } from "react"
import { Box, IconButton, Typography, Chip, useTheme, useMediaQuery, Fade } from "@mui/material"
import { ChevronLeft, ChevronRight, PlayArrow, Pause, FiberManualRecord } from "@mui/icons-material"
import RecruiterCard from "./RecruiterCard"

const RecruiterSlider = ({ recruiters, onRecruiterClick, title = "Featured Recruiters" }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const sliderRef = useRef(null)
  const autoPlayRef = useRef(null)

  // Responsive cards per view
  const getCardsPerView = () => {
    if (isMobile) return 1
    if (isTablet) return 2
    return 3
  }

  const cardsPerView = getCardsPerView()
  const totalSlides = Math.ceil(recruiters.length / cardsPerView)
  const maxIndex = totalSlides - 1

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlay && !isHovered) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
      }, 4000)
    } else {
      clearInterval(autoPlayRef.current)
    }
    return () => clearInterval(autoPlayRef.current)
  }, [isAutoPlay, isHovered, maxIndex])

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const handleDotClick = (index) => {
    setCurrentIndex(index)
  }

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay)
  }

  const getCurrentCards = () => {
    const startIndex = currentIndex * cardsPerView
    return recruiters.slice(startIndex, startIndex + cardsPerView)
  }

  if (recruiters.length === 0) return null

  return (
    <Box sx={{ position: "relative", mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#1e293b",
              mb: 0.5,
              background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Swipe or use arrows to navigate through recruiters
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            label={`${currentIndex + 1} of ${totalSlides}`}
            size="small"
            sx={{
              backgroundColor: "#f1f5f9",
              color: "#475569",
              fontWeight: 600,
            }}
          />
          <IconButton
            onClick={toggleAutoPlay}
            sx={{
              backgroundColor: isAutoPlay ? "#3b82f6" : "#f1f5f9",
              color: isAutoPlay ? "white" : "#64748b",
              width: 36,
              height: 36,
              "&:hover": {
                backgroundColor: isAutoPlay ? "#2563eb" : "#e2e8f0",
              },
            }}
          >
            {isAutoPlay ? <Pause sx={{ fontSize: 18 }} /> : <PlayArrow sx={{ fontSize: 18 }} />}
          </IconButton>
        </Box>
      </Box>

      {/* Slider Container */}
      <Box
        ref={sliderRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 3,
          backgroundColor: "transparent",
        }}
      >
        {/* Navigation Arrows */}
        <IconButton
          onClick={handlePrevious}
          sx={{
            position: "absolute",
            left: -20,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            backgroundColor: "#ffffff",
            border: "2px solid #e2e8f0",
            width: 48,
            height: 48,
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
            opacity: isHovered ? 1 : 0.7,
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#3b82f6",
              borderColor: "#3b82f6",
              color: "white",
              transform: "translateY(-50%) scale(1.1)",
            },
          }}
        >
          <ChevronLeft sx={{ fontSize: 24 }} />
        </IconButton>
        <IconButton
          onClick={handleNext}
          sx={{
            position: "absolute",
            right: -20,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            backgroundColor: "#ffffff",
            border: "2px solid #e2e8f0",
            width: 48,
            height: 48,
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
            opacity: isHovered ? 1 : 0.7,
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#3b82f6",
              borderColor: "#3b82f6",
              color: "white",
              transform: "translateY(-50%) scale(1.1)",
            },
          }}
        >
          <ChevronRight sx={{ fontSize: 24 }} />
        </IconButton>

        {/* Cards Container */}
        <Box
          sx={{
            display: "flex",
            transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: `translateX(-${currentIndex * 100}%)`,
            gap: 3,
            px: 1,
          }}
        >
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <Box
              key={slideIndex}
              sx={{
                display: "flex",
                gap: 3,
                minWidth: "100%",
                justifyContent: cardsPerView === 1 ? "center" : "flex-start",
              }}
            >
              {recruiters
                .slice(slideIndex * cardsPerView, (slideIndex + 1) * cardsPerView)
                .map((recruiter, cardIndex) => (
                  <Box
                    key={recruiter.recruiterId}
                    sx={{
                      flex:
                        cardsPerView === 1
                          ? "0 0 90%"
                          : `0 0 calc(${100 / cardsPerView}% - ${(3 * (cardsPerView - 1)) / cardsPerView}rem)`,
                      maxWidth: cardsPerView === 1 ? 400 : "none",
                    }}
                  >
                    <Fade in timeout={300 + cardIndex * 100}>
                      <Box>
                        <RecruiterCard
                          recruiter={recruiter}
                          onClick={onRecruiterClick}
                          index={slideIndex * cardsPerView + cardIndex}
                        />
                      </Box>
                    </Fade>
                  </Box>
                ))}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Dot Indicators */}
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 3, gap: 1 }}>
        {Array.from({ length: totalSlides }).map((_, index) => (
          <IconButton
            key={index}
            onClick={() => handleDotClick(index)}
            sx={{
              width: 12,
              height: 12,
              minWidth: 12,
              p: 0,
              color: index === currentIndex ? "#3b82f6" : "#cbd5e1",
              transition: "all 0.3s ease",
              "&:hover": {
                color: "#3b82f6",
                transform: "scale(1.2)",
              },
            }}
          >
            <FiberManualRecord sx={{ fontSize: 12 }} />
          </IconButton>
        ))}
      </Box>

      {/* Progress Bar */}
      <Box
        sx={{
          position: "absolute",
          bottom: -8,
          left: 0,
          right: 0,
          height: 3,
          backgroundColor: "#e2e8f0",
          borderRadius: 1.5,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: "100%",
            backgroundColor: "#3b82f6",
            borderRadius: 1.5,
            transition: "width 0.6s ease",
            width: `${((currentIndex + 1) / totalSlides) * 100}%`,
          }}
        />
      </Box>
    </Box>
  )
}

export default RecruiterSlider
