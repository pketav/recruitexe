'use client'

import { useState } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import NotesBoards from './notesBoards/'
import NotesList from './notesList'
import { GiNotebook } from 'react-icons/gi'
import { LuBookOpenText } from 'react-icons/lu'
import { IoShareSocialSharp } from 'react-icons/io5'
import { FaRegClock } from 'react-icons/fa'
import SharedWithMe from './sharedWithMe'
import { FaPlus } from 'react-icons/fa6'
import ReminderNotesList from './reminderNotesList'

const Notes = () => {
  const [activeTab, setActiveTab] = useState('notes')

  return (
    <Box>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          borderBottom: '1px solid #00000014',
          paddingBottom: '15px'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4,marginBottom:'0' }}>
          <Typography variant='h4' fontWeight='bold' style={{ marginRight: '10px' }}>
            Notes
          </Typography>
        </Box>
<Box style={{display:'flex',    background: 'rgb(234 233 233)',
    alignItems: 'center',
    padding: '8px',borderRadius: '5px',}}>
        <Box
          onClick={() => setActiveTab('notes')}
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            marginRight: '21px',
            color: '#1D3066',
            fontWeight: '600',
          padding: '8px',
    borderRadius: '5px',

             background: activeTab === 'notes' ? 'white' : ''
          }}
        >
          <GiNotebook style={{ marginRight: '3px' }} />
          All Notes
        </Box>
        <Box
          onClick={() => setActiveTab('board')}
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            marginRight: '21px',
            color: '#1D3066',
            fontWeight: '600',
            padding: '8px',
    borderRadius: '5px',
            background: activeTab === 'board' ? 'white' : ''
          }}
        >
          <LuBookOpenText style={{ marginRight: '3px' }} />
          Note Boards
        </Box>

        <Box
          onClick={() => setActiveTab('shared')}
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            marginRight: '21px',
            color: '#1D3066',
            fontWeight: '600',
            padding: '8px',
    borderRadius: '5px',

             background: activeTab === 'shared' ? 'white' : ''
          }}
        >
          <IoShareSocialSharp style={{ marginRight: '3px' }} />
          Share With Me
        </Box>
        <Box
          onClick={() => setActiveTab('reminders')}
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            marginRight: '21px',
            color: '#1D3066',
            fontWeight: '600',
            padding: '8px',
    borderRadius: '5px',

             background: activeTab === 'reminders' ? 'white' : ''
          }}
        >
          <FaRegClock  />
          Reminders
        </Box>
        </Box>
        {/* <IconButton>
          <FaPlus />
        </IconButton> */}
      </Box>

      {/* Render components based on active tab */}
      {activeTab === 'notes' && <NotesList />}
      {activeTab === 'board' && <NotesBoards />}
      {activeTab === 'shared' && <SharedWithMe />}
      {activeTab === 'reminders' && <ReminderNotesList />}
    </Box>
  )
}

export default Notes
