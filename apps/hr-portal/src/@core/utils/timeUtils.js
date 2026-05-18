export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

export const formatTimeUntilStart = (totalMinutes) => {
  if (totalMinutes <= 0) return "Now"
  if (totalMinutes > 525600) {
    return "Invalid time calculation"
  }

  const days = Math.floor(totalMinutes / (24 * 60))
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60)
  const minutes = totalMinutes % 60

  if (days > 0) {
    if (hours > 0) {
      return `${days}d ${hours}h ${minutes}m`
    }
    return `${days}d ${minutes}m`
  }
  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
  }
  return `${minutes}m`
}

export const parseScheduleDate = (dateString) => {
  if (!dateString) return null

  try {
    const dateWithoutZ = dateString.replace("Z", "")
    const [datePart, timePart] = dateWithoutZ.split("T")
    const [year, month, day] = datePart.split("-").map(Number)
    const [hours, minutes, seconds] = timePart.split(":").map(Number)
    const istDate = new Date(year, month - 1, day, hours, minutes, seconds || 0)

    if (isNaN(istDate.getTime())) {
      console.error("Invalid date after parsing:", dateString)
      return null
    }
    return istDate
  } catch (error) {
    console.error("Date parsing error:", error, "for date:", dateString)
    return null
  }
}

export const getTimeStatus = (scheduledTime) => {
  const scheduled = parseScheduleDate(scheduledTime)

  if (!scheduled) {
    return {
      isValid: false,
      message: "Invalid schedule date format. Please contact support.",
      canStart: false,
      timeUntilStart: 0,
      scheduledTime: null,
    }
  }

  const nowLocal = new Date()
  const timeDiffMs = scheduled.getTime() - nowLocal.getTime()
  const totalMinutes = Math.round(timeDiffMs / (1000 * 60))

  const formatScheduledTime = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    let hours = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const ampm = hours >= 12 ? "PM" : "AM"
    hours = hours % 12
    hours = hours ? hours : 12
    return `${day}/${month}/${year}, ${String(hours).padStart(2, "0")}:${minutes} ${ampm} IST`
  }

  const formattedScheduledTime = formatScheduledTime(scheduled)

  // More than 15 minutes late - interview time has passed
  if (totalMinutes < -15) {
    const minutesLate = Math.abs(totalMinutes)
    return {
      isValid: false,
      message: `Interview was scheduled for ${formattedScheduledTime}. You are ${minutesLate} minutes late. Please contact HR or administrator to reschedule your interview.`,
      canStart: false,
      timeUntilStart: 0,
      scheduledTime: scheduled,
      isLate: true,
      minutesLate: minutesLate,
    }
  }

  // Exactly at scheduled time or within 15 minutes after - can start
  if (totalMinutes <= 0 && totalMinutes >= -15) {
    if (totalMinutes === 0) {
      return {
        isValid: true,
        message: `Interview starts at ${formattedScheduledTime}. You can begin now.`,
        canStart: true,
        timeUntilStart: 0,
        scheduledTime: scheduled,
      }
    } else {
      const minutesLate = Math.abs(totalMinutes)
      return {
        isValid: true,
        message: `Interview was scheduled for ${formattedScheduledTime}. You are ${minutesLate} minutes late, but you can still start the interview.`,
        canStart: true,
        timeUntilStart: 0,
        scheduledTime: scheduled,
        isLate: true,
        minutesLate: minutesLate,
      }
    }
  }

  // Before scheduled time - must wait
  if (totalMinutes > 0) {
    return {
      isValid: true,
      message: `Interview is scheduled for ${formattedScheduledTime}. Please wait until the scheduled time.`,
      canStart: false,
      timeUntilStart: totalMinutes,
      scheduledTime: scheduled,
      isEarly: true,
    }
  }
}
