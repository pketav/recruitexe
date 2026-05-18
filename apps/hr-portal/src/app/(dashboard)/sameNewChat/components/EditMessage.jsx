import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Popover
} from '@mui/material';

function EditMessage({ anchorEl, open, onClose, onEditMessage, selectedMessage }) {
  const [editText, setEditText] = useState('');

  useEffect(() => {
    if (selectedMessage?.type === 'text') {
      setEditText(selectedMessage?.content?.text || '');
    } else {
      setEditText('');
    }
  }, [selectedMessage]);

  const handleSave = () => {
    if (editText.trim() && onEditMessage) {
      const updatedContent = {
        ...selectedMessage.content,
        text: editText
      };

      onEditMessage( updatedContent.text);
      onClose();
    }
  };

  const isText = selectedMessage?.type === 'text';

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      PaperProps={{ sx: { p: 2, width: 300, borderRadius: 2 } }}
    >
      <Typography fontWeight={600} fontSize={16}>
        Edit Message
      </Typography>

      {isText ? (
        <>
          <TextField
            fullWidth
            multiline
            minRows={2}
            maxRows={5}
            value={editText}
            onChange={e => setEditText(e.target.value)}
            sx={{ mt: 2 }}
          />

          <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={onClose} size="small" variant="outlined" color="inherit">
              Cancel
            </Button>
            <Button onClick={handleSave} size="small" variant="contained">
              Save
            </Button>
          </Box>
        </>
      ) : (
        <Box mt={2}>
          <Typography sx={{ color: 'gray', mb: 1 }}>
            Media editing is not supported yet.
          </Typography>
          <Box
            sx={{
              border: '1px solid #ddd',
              borderRadius: 2,
              p: 1,
              textAlign: 'center',
              background: '#fafafa'
            }}
          >
            <Typography fontSize={14} color="text.secondary">
              {selectedMessage?.type === 'image' && '🖼️ Image'}
              {selectedMessage?.type === 'video' && '🎥 Video'}
              {selectedMessage?.type === 'file' && '📄 File'}
              {selectedMessage?.type === 'structured' && '📦 Structured Message'}
              {!selectedMessage?.type && '❓ Unknown Message Type'}
            </Typography>
          </Box>
        </Box>
      )}
    </Popover>
  );
}

export default EditMessage;
