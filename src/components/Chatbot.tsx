import React, { useMemo, useState, useEffect, lazy, Suspense, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
  Button,
  Card,
  CardContent,
  Divider,
  keyframes,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Minimize';
import useChatbot from '../hooks/use-chatbot';
import { IChatbotMessage } from './ChatbotMessage';

interface IChatbot {
  isOpen: boolean;
  onOpen: (open: boolean) => void;
}

interface IConfirmClearDialog {
  onExit: () => void;
  onConfirm: () => void;
  open: boolean;
  anchorEl: HTMLDivElement | null;
}

// Lazy load ChatbotMessage
const ChatMessage = lazy(() => import('./ChatbotMessage'));

// Memoized message component to prevent re-renders
const MemoizedChatMessage = React.memo(({ message, isUser, time }: IChatbotMessage) => (
  <Suspense
    fallback={
      <CircularProgress
        size={20}
        color="secondary"
      />
    }>
    <ChatMessage
      message={message}
      isUser={isUser}
      time={time}
    />
  </Suspense>
));

// Define the keyframes for the dot animation
const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.0);
    opacity: 1;
  }
`;

export default function Chatbot({ isOpen, onOpen }: IChatbot) {
  const {
    messages,
    input,
    setInput,
    isLoading,
    isTyping,
    handleSubmit,
    messagesEndRef,
    inputRef,
    clearSession,
  } = useChatbot();

  const [confirmClear, setConfirmClear] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

  const cardRef = useRef(null);

  const handleExitChat = () => {
    setConfirmClear(true);
    if (cardRef.current) setAnchorEl(cardRef.current);
  };

  const handleClear = () => {
    clearSession();
    onOpen(false);
    setConfirmClear(false);
    setAnchorEl(null);
  };

  useEffect(() => {
    let timeout: number | NodeJS.Timeout | undefined;
    if (isOpen) {
      timeout = setTimeout(() => {
        inputRef.current?.focus();
        console.log('Chat open state changed:', isOpen);
      }, 100);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isOpen]);

  const renderMessages = useMemo(() => {
    return messages.map((msg, index) => (
      <Box
        key={`${msg.role}-${index}-${msg.timestamp.getTime()}`}
        sx={{
          display: 'flex',
          justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
          mb: 1.5,
        }}>
        <MemoizedChatMessage
          message={msg.content}
          isUser={msg.role === 'user'}
          time={msg.timestamp
            .toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
            .toLowerCase()}
        />
      </Box>
    ));
  }, [messages]);

  return (
    <Card
      sx={{
        position: 'fixed',
        right: 0,
        bottom: '2%',
        width: '95%',
        minHeight: '320px',
        m: 1,
        '@media (min-width: 600px)': {
          right: '6%',
          bottom: '3%',
          width: '100%',
          m: 0,
        },
        '@media (max-width: 400px)': {
          bottom: '1%',
        },
        maxWidth: 400,
        maxHeight: '75vh',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        zIndex: 1400,
        boxShadow: '0 4px 20px rgba(199, 21, 133, 0.15)',
      }}
      elevation={4}
      ref={cardRef}>
      {/* Header */}
      <CardContent
        className="chatbot-header"
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: '#c71585', // mulberry-pink
          color: 'white',
        }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center">
          <Typography variant="h6">
            {`Portfolio Assistant${messages.length === 0 ? '' : ': EVE'}`}
          </Typography>
          <Box>
            <IconButton
              size="small"
              onClick={() => onOpen(false)}
              sx={{
                color: 'white',
                mr: 1,
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              }}>
              <MinimizeIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleExitChat}
              sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
      {/* Messages */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 'calc(75vh - 130px)',
        }}>
        <Box
          sx={{
            p: 1,
            mb: 2,
            backgroundColor: '#f8f8f8',
            color: '#787878',
            fontSize: '0.75rem',
          }}>
          This portfolio assistant is in beta mode and uses free resources, so responses might be
          incorrect or incomplete.
        </Box>
        {renderMessages}
        {isLoading && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              alignSelf: 'flex-start',
              backgroundColor: '#ede8efc2', // light lavender/gray from global.scss
              borderRadius: 2,
              px: 2,
              py: 1,
              mb: 1.5,
            }}>
            <CircularProgress
              size={20}
              color="secondary"
            />
          </Box>
        )}
        {isTyping && messages[messages.length - 1]?.role === 'assistant' && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </Box>
      {/* Input area */}
      <Divider />
      <form
        onSubmit={handleSubmit}
        className="chatbot-form">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            backgroundColor: 'background.paper',
          }}>
          <TextField
            fullWidth
            inputRef={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me something..."
            disabled={isLoading}
            size="small"
            sx={{ mr: 1 }}
          />
          <IconButton
            type="submit"
            disabled={isLoading || !input.trim()}
            color="primary"
            sx={{
              color: '#c71585',
              '&:hover': { backgroundColor: 'rgba(199, 21, 133, 0.08)' },
              '&.Mui-disabled': { color: 'rgba(199, 21, 133, 0.38)' },
            }}>
            <SendIcon />
          </IconButton>
        </Box>
      </form>
      {/* Clear confirmation overlay */}
      {confirmClear && (
        <Box
          sx={{
            position: 'absolute',
            top: '64px', // Height of the header
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            zIndex: 1800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ConfirmClearDialog
            onExit={() => setConfirmClear(false)}
            onConfirm={handleClear}
            open={confirmClear}
            anchorEl={anchorEl}
          />
        </Box>
      )}
    </Card>
  );
}

function ConfirmClearDialog({ onExit, onConfirm }: IConfirmClearDialog) {
  return (
    <Box
      sx={{
        backgroundColor: '#f8e6f3', // Light pastel pink
        py: 4,
        px: 1,
        borderRadius: 2,
        width: '95%',
        maxWidth: 320,
        '@media(min-width: 600px)': {
          width: '80%',
          px: 4,
        },
        textAlign: 'center',
        boxShadow: '0 2px 10px rgba(199, 21, 133, 0.15)',
      }}>
      <Typography
        variant="h6"
        sx={{
          color: '#606060',
          mb: 2,
          fontWeight: 500,
        }}>
        End this conversation?
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: '#787878',
          mb: 3,
        }}>
        Your chat history will be cleared when you leave.
      </Typography>
      <Box
        display="flex"
        justifyContent="center"
        gap={2}>
        <Button
          variant="outlined"
          onClick={onExit}
          sx={{
            color: '#606060',
            borderColor: '#d3d3d3',
            '&:hover': {
              backgroundColor: 'rgba(199, 21, 133, 0.08)',
              borderColor: '#c71585',
            },
            borderRadius: 6,
            px: 3,
          }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          sx={{
            backgroundColor: '#f0b6d5', // Pastel pink
            color: '#606060',
            '&:hover': {
              backgroundColor: '#e8a1c7', // Slightly darker pastel pink
            },
            boxShadow: 'none',
            borderRadius: 6,
            px: 3,
          }}>
          End Chat
        </Button>
      </Box>
    </Box>
  );
}

function TypingIndicator() {
  const dotStyle = {
    display: 'inline-block',
    width: '8px',
    height: '8px',
    margin: '0 2px',
    backgroundColor: 'grey', // Or use theme.palette.text.secondary
    borderRadius: '50%',
    opacity: 0.5,
    animation: `${bounce} 1.4s infinite ease-in-out both`,
  };
  return (
    <Box sx={{ display: 'inline-block', paddingLeft: '10px' }}>
      <Box
        component="span"
        sx={{ ...dotStyle, animationDelay: '-0.32s' }}
      />
      <Box
        component="span"
        sx={{ ...dotStyle, animationDelay: '-0.16s' }}
      />
      <Box
        component="span"
        sx={dotStyle}
      />
    </Box>
  );
}
