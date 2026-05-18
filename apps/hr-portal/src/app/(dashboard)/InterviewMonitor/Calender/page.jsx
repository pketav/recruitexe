'use client';

import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth';
import {
  Box,
  useMediaQuery,
  useTheme,
  GlobalStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';

const toTitleCase = (str = '') =>
  str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());

const getSlotStart = (date) => {
  const d = new Date(date);
  d.setSeconds(0);
  d.setMilliseconds(0);

  const minutes = d.getMinutes();
  const slotSize = 30;
  const slotStart = Math.floor(minutes / slotSize) * slotSize;

  d.setMinutes(slotStart);
  return d;
};

const renderInterviewSummary = (arg, onClickDetails) => {
  const count = arg.event.extendedProps.count || 1;
  const label = count === 1 ? 'Interview' : `${count} Interviews`;

  return {
    domNodes: [
      (() => {
        const container = document.createElement('div');
        container.style.backgroundColor = '#E8EAF6';
        container.style.border = '1px solid #3F51B5';
        container.style.borderRadius = '6px';
        container.style.padding = '7px';
        container.style.color = '#1A237E';
        container.style.fontWeight = '600';
        container.style.cursor = 'pointer';
        container.innerText = label;

        container.addEventListener('click', () => {
          onClickDetails(arg.event);
        });

        return container;
      })(),
    ],
  };
};

export default function CalendarComponent({ allCandidates }) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formattedCandidates, setFormattedCandidates] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogData, setDialogData] = useState([]);
  const [currentView, setCurrentView] = useState('timeGridWeek');

  const handleOpenDialog = (event) => {
    setDialogData(event.extendedProps);
    setOpenDialog(true);
  };

  const groupCandidates = (candidates, viewType) => {
    const grouped = {};

    candidates.forEach((item) => {
      const start = new Date(item.scheduleDate);

      let key;
      if (viewType === 'dayGridMonth' || viewType === 'multiMonthYear') {
        key = start.toISOString().split('T')[0]; // group by day
      } else {
        const slotStart = getSlotStart(start);
        key = slotStart.toISOString(); // group by 30-min slot
      }

      const slotEnd = new Date(key);
      slotEnd.setMinutes(slotEnd.getMinutes() + 30);

      if (!grouped[key]) {
        grouped[key] = {
          id: key,
          title: 'Interviews',
          start: key,
          end: slotEnd.toISOString(),
          candidates: [],
        };
      }

      grouped[key].candidates.push({
        name: toTitleCase(item?.candidateId?.name),
        round: `Round ${item?.roundNumber} - ${toTitleCase(item?.roundName)}`,
        duration: item?.durationMinutes,
        id: item?.candidateId?._id,
        time: start.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
        originalDate: start,
      });
    });

    return Object.values(grouped).map((event) => ({
      ...event,
      extendedProps: {
        count: event.candidates.length,
        candidates: event.candidates,
        start: event.start,
        end: event.end,
      },
    }));
  };

  useEffect(() => {
    setFormattedCandidates(groupCandidates(allCandidates, currentView));
  }, [allCandidates, currentView]);

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto', px: isMobile ? 1 : 3 }}>
      <GlobalStyles
        styles={{
          '.fc-timegrid-slot': { height: '40px !important' },
          '.fc': { fontSize: isMobile ? '12px' : '14px' },
          '.fc-toolbar': {
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: '0.5rem',
          },
          '.fc-header-toolbar .fc-button': {
            padding: isMobile ? '2px 6px' : '6px 12px',
            fontSize: isMobile ? '12px' : '14px',
          },
        }}
      />

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, multiMonthPlugin]}
        initialView="timeGridWeek"
        datesSet={(info) => setCurrentView(info.view.type)}
        headerToolbar={{
          left: 'today prev,next',
          center: 'title',
          right: 'timeGridDay,timeGridWeek,dayGridMonth',
        }}
        buttonText={{
          today: 'Today',
          month: 'Month',
          week: 'Week',
          day: 'Day',
          list: 'List',
          multiMonthYear: 'Year',
        }}
        editable={false}
        selectable={false}
        events={formattedCandidates}
        slotDuration="00:30:00"
        allDaySlot={false}
        displayEventTime={false}
        slotLabelInterval="00:30:00"
        eventContent={(arg) => renderInterviewSummary(arg, handleOpenDialog)}
        slotMinTime="05:00:00"
        slotMaxTime="20:00:00"
        eventOrder="start"
        eventDisplay="block"
        eventOverlap={false}
        dayMaxEvents={false}
        dayMaxEventRows={false}
        eventMaxStack={1}
        eventMinHeight={40}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Interview Candidates</DialogTitle>
        <DialogContent>
          {dialogData?.candidates?.map((c, index) => (
            <Box
              key={index}
              onClick={() => router.push(`/InterviewMonitor/CandidateProfile?id=${c.id}`)}
              sx={{
                cursor: 'pointer',
                mb: 3,
                p: 2,
                borderRadius: 1,
                backgroundColor: '#EEF4FF',
                border: '1px solid rgb(57, 148, 239)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
              }}
            >
              <Typography variant="h6" fontWeight={600} color="#1D2939">
                🧑 {c.name}
              </Typography>
              <Typography variant="body2" color="#475467">
                📋 <strong>Round:</strong> {c.round}
              </Typography>
              <Typography variant="body2" color="#475467">
                ⏱️ <strong>Time:</strong>{' '}
                {new Date(c.originalDate).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
                &nbsp;-&nbsp;
                {new Date(new Date(c.originalDate).getTime() + c.duration * 60000).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </Typography>
              <Typography variant="body2" color="#475467">
                ⏱️ <strong>Duration:</strong> {c.duration} min
              </Typography>
            </Box>
          ))}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
