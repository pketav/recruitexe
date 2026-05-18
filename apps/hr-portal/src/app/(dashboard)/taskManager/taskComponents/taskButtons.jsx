'use client';

import React, { useState, useEffect, useCallback } from 'react';

import { useRouter } from 'next/navigation';  // Correct import for useRouter
import Link from 'next/link';

import { Box, Button, Card, Tooltip, Typography, Badge } from '@mui/material';
import { BiTask } from 'react-icons/bi';
import { format } from 'date-fns';
import { IoIosNotifications } from 'react-icons/io';

import { FaCalendarAlt, FaTasks } from 'react-icons/fa';
import { HiMiniUserGroup } from 'react-icons/hi2';
import { GiTeamIdea } from 'react-icons/gi';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const TaskButtons = () => {
  const today = new Date();
  const currentDateString = format(today, 'yyyy-MM-dd');
  const [isReportingManager, setIsReportingManager] = useState(false);
  const [unseenCount, setUnseenCount] = useState(0);
  const [prevCount, setPrevCount] = useState(0);
  const [audioContext, setAudioContext] = useState(null);
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // Function to initialize audio context
  const initAudioContext = () => {
    if (typeof window !== 'undefined' && !audioContext) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;

      if (AudioContext) {
        const newContext = new AudioContext();

        setAudioContext(newContext);
      }
    }
  };

  // Function to play notification sound
  const playNotificationSound = useCallback(() => {
    try {
      if (!audioContext) return; // Don't play if context isn't initialized

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 440; // A4 note
      gainNode.gain.value = 0.1; // Lower volume

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1); // Short beep
    } catch (error) {
      console.error('Error playing notification:', error);
    }
  }, [audioContext]);

  // Fetch unseen message count
  const fetchUnseenCount = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/v1/api/task/getGroupUnseenMessageCount`, {
        headers: {
          token: localStorage.getItem('authToken')
        }
      });

      if (!response.ok) throw new Error('Failed to fetch unseen count');

      const data = await response.json();

      if (data.status && data.items) {
        const newCount = data.items.totalUnseenMessageCount;

        // Play sound if count increased and audio context exists
        if (newCount > prevCount && audioContext) {
          playNotificationSound();
        }

        setPrevCount(newCount);
        setUnseenCount(newCount);
      }
    } catch (error) {
      console.error('Error fetching unseen count:', error);
    }
  }, [baseUrl, prevCount, playNotificationSound, audioContext]);

  // Set up polling for unseen message count
  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchUnseenCount();
      const intervalId = setInterval(fetchUnseenCount, 5000); // Check every 5 seconds

      return () => {
        clearInterval(intervalId);

        // Cleanup audio context if it exists
        if (audioContext) {
          audioContext.close();
        }
      };
    }
  }, [fetchUnseenCount, audioContext]);

  // Check if user is reporting manager
  useEffect(() => {
    const checkReportingManagerStatus = async () => {
      if (typeof window !== 'undefined') {
        try {
          const response = await fetch(`${baseUrl}/v1/api/hrms/getIfReportingManager`, {
            headers: {
              token: localStorage.getItem('authToken')
            }
          });

          const data = await response.json();

          if (data.status && data.subCode === 200) {
            setIsReportingManager(data.items.isReportingManager === "yes");
          }
        } catch (error) {
          console.error('Error checking reporting manager status:', error);
        }
      }
    };

    checkReportingManagerStatus();
  }, [baseUrl]);

  const navigateTo = (path) => {
    initAudioContext();
    router.push(path);
  };

  return (
    <Card sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CalendarMonthIcon color='primary' sx={{ mr: 1 }} />
          <Typography variant='h6'>{currentDateString}</Typography>
        </Box>
        <Box>
          <Tooltip title="All Tasks" arrow placement="bottom">
            <Link href="/taskManagement">
              <FaTasks
                onClick={() => initAudioContext()}
                style={{
                  cursor: 'pointer',
                  fontSize: '20px',
                  marginRight: '19px'
                }}
              />
            </Link>
          </Tooltip>

          <Tooltip title="Group Tasks" arrow placement="bottom">
            <Badge badgeContent={unseenCount} color="success" sx={{ mr: 2 }}>
              <GiTeamIdea
                onClick={() => navigateTo('/taskManagement')}
                style={{
                  cursor: 'pointer',
                  fontSize: '20px'
                }}
              />
            </Badge>
          </Tooltip>

          {isReportingManager && (
            <Tooltip title="Your Team" arrow placement="bottom">
              <HiMiniUserGroup
                style={{
                  cursor: 'pointer',
                  fontSize: '20px',
                  marginRight: '19px'
                }}
                onClick={() => navigateTo('/taskManagement')}
              />
            </Tooltip>
          )}

          <Tooltip title="Calendar" arrow placement="bottom">
            <FaCalendarAlt
              onClick={() => navigateTo('/taskManagement')}
              style={{
                cursor: 'pointer',
                fontSize: '20px',
                marginRight: '19px'
              }}
            />
          </Tooltip>

          <Tooltip title="Notifications" arrow placement="bottom">
            <IoIosNotifications
              style={{
                cursor: 'pointer',
                fontSize: '22px',
                marginRight: '19px'
              }}
            />
          </Tooltip>

          <Tooltip title="Tasks" arrow placement="bottom">
            <Box
              style={{
                cursor: 'pointer',
                fontSize: '22px'
              }}
              onClick={() => navigateTo('/taskManagement')}
            />
          </Tooltip>
        </Box>
      </Box>
    </Card>
  );
};

export default TaskButtons;
