import React, { Suspense, useState } from 'react';
import { Fab, Box, CircularProgress, Zoom, Tooltip } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

export const LazyChatbot = React.lazy(() => import('./Chatbot'));

export default function ChatbotLoader() {
  // const { isOpen, toggleChat } = useChatbot();
  const [isActive, setIsActive] = useState(false);

  // If chatbot is not open, show just the fab button
  if (!isActive) {
    return (
      <Tooltip
        title="Chat with EVE"
        placement="top-end"
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: '#c71585',
              color: 'white',
              boxShadow: '0 4px 20px rgba(199, 21, 133, 0.25)',
            },
          },
        }}>
        <Box
          sx={{
            position: 'fixed',
            bottom: 35,
            '@media(max-width: 600px)': {
              bottom: 25,
            },
            right: '6%',
            zIndex: 1400,
          }}>
          <Zoom in={true}>
            <Fab
              onClick={() => setIsActive(!isActive)}
              aria-label="open chat"
              sx={{
                bgcolor: '#c71585',
                color: 'white',
                '&:hover': {
                  bgcolor: '#a01269',
                },
                boxShadow: '0 4px 20px rgba(199, 21, 133, 0.25)',
              }}>
              <ChatIcon />
            </Fab>
          </Zoom>
        </Box>
      </Tooltip>
    );
  }
  return (
    <>
      <Suspense fallback={<CircularProgress />}>
        {isActive && (
          <LazyChatbot
            isOpen={isActive}
            onOpen={setIsActive}
          />
        )}
      </Suspense>
    </>
  );
}
