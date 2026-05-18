'use client'

import { useState, useEffect } from 'react'
import { CalendarView } from './calender/page'
import { NewPostForm } from './newposts/page'
import { DraftsList } from './draft/page'
import   {ScheduledPosts}  from './schedule/page'
import { useSearchParams } from 'next/navigation'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Paper,
  Stack,
  Avatar,
  Tabs,
  Tab,
  Chip,
  Grid,
  CircularProgress,
  Fade,
  Zoom,
  Badge
} from '@mui/material'
import { styled, keyframes } from '@mui/material/styles'
import { Edit, FileText, Calendar, Clock, TrendingUp, MessageSquare, Share2, PenTool } from 'lucide-react'

const pulseGlow = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(46, 226, 94, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(46, 226, 94, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(46, 226, 94, 0);
  }
`

const slideInFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`

const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
`

// Styled components
const GradientBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#f8fafc',
  minHeight: '100vh',
  padding: theme.spacing(3)
}))

const EnhancedContainer = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  borderRadius: '20px',
  padding: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)'
  },
  animation: `${slideInFromLeft} 0.6s ease-out`
}))

const AnimatedAvatar = styled(Avatar)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgb(111, 241, 239) 0%, rgb(46, 226, 94) 100%)',
  width: 48,
  height: 48,
  boxShadow: '0 8px 25px rgba(46, 226, 94, 0.3)',
  animation: `${pulseGlow} 2s infinite, ${floatAnimation} 3s ease-in-out infinite`,
  transition: 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
  '&:hover': {
    transform: 'scale(1.1) translateY(-2px)',
    boxShadow: '0 12px 35px rgba(46, 226, 94, 0.4)'
  }
}))

const TabsContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(0.5),
  marginBottom: theme.spacing(3)
}))

const StyledTab = styled(Tab)(({ theme }) => ({
  color: 'white',
  fontWeight: 500,
  minHeight: 48,
  '&.Mui-selected': {
    backgroundColor: 'white',
    color: '#2196F3',
    borderRadius: theme.spacing(1)
  },
  '&:hover': {
    color: 'white',
    borderRadius: theme.spacing(1)
  },
  '&.MuiTab-root:hover': {
    color: '#0b0303'
  }
}))

function TabPanel({ children, value, index }) {
  return (
    <div role='tabpanel' hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}
export default function SocialMediaManager() {
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  const router = useSearchParams()
  const tabvalue = router.get('tabvalue')

  useEffect(() => {
    if (tabvalue) {
      console.log('Tab value from query:', tabvalue)
      const tabMap = {
        'new-post': 0,
        drafts: 1,
        scheduled: 2,
        calendar: 3
      }
      setActiveTab(tabMap[tabvalue] || 0)
    }
  }, [tabvalue])

  // Load posts from localStorage on mount
  useEffect(() => {
    try {
      const savedPosts = localStorage.getItem('social-media-posts')
      if (savedPosts) {
        setPosts(JSON.parse(savedPosts))
      }
    } catch (error) {
      console.error('Error loading posts:', error)
    }
    setIsLoaded(true)
  }, [])

  // Save posts to localStorage whenever posts change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('social-media-posts', JSON.stringify(posts))
      } catch (error) {
        console.error('Error saving posts:', error)
      }
    }
  }, [posts, isLoaded])

  const drafts = posts.filter(post => post.status === 'draft')
  const scheduled = posts.filter(post => post.status === 'scheduled')

  const addPost = post => {
    const newPost = {
      ...post,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setPosts(prev => [...prev, newPost])
  }

  const updatePost = (id, updates) => {
    setPosts(prev =>
      prev.map(post => (post.id === id ? { ...post, ...updates, updatedAt: new Date().toISOString() } : post))
    )
  }

  const deletePost = id => {
    setPosts(prev => prev.filter(post => post.id !== id))
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  if (!isLoaded) {
    return (
      <GradientBox>
        <Container maxWidth='xl'>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress />
          </Box>
        </Container>
      </GradientBox>
    )
  }

  return (
    <GradientBox>
      <Container maxWidth='2xl'>
        {/* Header */}
          <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ mb: 2 }}>
            <Stack direction='row' alignItems='center' spacing={2}>
              <Stack direction='row' alignItems='center' spacing={1}>
                <Zoom in timeout={100}>
                  <Badge
                    sx={
                      {
                        // '& .MuiBadge-badge': {
                        //   // top: -8,
                        //   // right: -12,
                        //   background: 'transparent',
                        //   boxShadow: 'none'
                        // }
                      }
                    }
                  >
                    <AnimatedAvatar>
                      <MessageSquare size={24} />
                    </AnimatedAvatar>
                  </Badge>
                </Zoom>
                <Typography
                  variant='h3'
                  sx={{
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  LinkedIn Post Manager
                </Typography>
              </Stack>
            
            </Stack>
    
          </Stack>

        <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 5 }}>
          <Share2 size={16} />
          <Typography variant='body1' color='text.secondary'>
            Seamlessly manage LinkedIn job postings — draft, schedule, or publish.
          </Typography>
        </Stack>

        {/* Navigation Tabs */}
        <TabsContainer>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant='fullWidth'
            TabIndicatorProps={{ style: { display: 'none' } }}
          >
            <StyledTab icon={<PenTool size={16} />} label='New Post' iconPosition='start' />
            <StyledTab icon={<FileText size={16} />} label='Drafts' iconPosition='start' />
            <StyledTab icon={<Clock size={16} />} label='Scheduled' iconPosition='start' />
            <StyledTab icon={<Calendar size={16} />} label='Calendar' iconPosition='start' />
          </Tabs>
        </TabsContainer>

        {/* Tab Content */}
        <EnhancedContainer elevation={0}>
          <TabPanel value={activeTab} index={0}>
            <Fade in timeout={600}>
              <Box>
                <Stack direction='row' alignItems='center' spacing={2} sx={{ mb: 4 }}>
                  <Avatar sx={{ bgcolor: '#E3F2FD', color: '#1976D2' }}>
                    <PenTool size={20} />
                  </Avatar>
                  <Box>
                    <Typography variant='h5' fontWeight='bold'>
                      Create New Post
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Write and schedule your LinkedIn content
                    </Typography>
                  </Box>
                </Stack>
                <NewPostForm onSubmit={addPost} />
              </Box>
            </Fade>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Fade in timeout={600}>
              <Box>
                <Stack direction='row' alignItems='center' spacing={2} sx={{ mb: 4 }}>
                  <Avatar sx={{ bgcolor: '#FFF3E0', color: '#F57C00' }}>
                    <FileText size={20} />
                  </Avatar>
                  <Box>
                    <Typography variant='h5' fontWeight='bold'>
                      Draft Posts
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Your saved drafts ready to be published
                    </Typography>
                  </Box>
                </Stack>
                <DraftsList drafts={drafts} onEdit={updatePost} onDelete={deletePost} />
              </Box>
            </Fade>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Fade in timeout={600}>
              <Box>
                <Stack direction='row' alignItems='center' spacing={2} sx={{ mb: 4 }}>
                  <Avatar sx={{ bgcolor: '#E8F5E8', color: '#2E7D32' }}>
                    <Clock size={20} />
                  </Avatar>
                  <Box>
                    <Typography variant='h5' fontWeight='bold'>
                      Scheduled Posts
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Posts scheduled for future publication
                    </Typography>
                  </Box>
                </Stack>
                <ScheduledPosts posts={scheduled} onEdit={updatePost} onDelete={deletePost} />
              </Box>
            </Fade>
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <Fade in timeout={600}>
              <Box>
                <Stack direction='row' alignItems='center' spacing={2} sx={{ mb: 4 }}>
                  <Avatar sx={{ bgcolor: '#F3E5F5', color: '#7B1FA2' }}>
                    <Calendar size={20} />
                  </Avatar>
                  <Box>
                    <Typography variant='h5' fontWeight='bold'>
                      Calendar View
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Visual overview of your scheduled content
                    </Typography>
                  </Box>
                </Stack>
                <CalendarView posts={scheduled} onEdit={updatePost} onDelete={deletePost} />
              </Box>
            </Fade>
          </TabPanel>
        </EnhancedContainer>
      </Container>
    </GradientBox>
  )
}
