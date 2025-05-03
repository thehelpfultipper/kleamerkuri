import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { Person, SmartToy } from '@mui/icons-material';

export interface IChatbotMessage {
  message: string;
  isUser: boolean;
  time: string | null;
}

interface IAvatar {
  isUser: boolean;
  children: React.ReactNode;
}

export default function ChatbotMessage({ message, isUser, time = null }: IChatbotMessage) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 1,
        width: '100%',
      }}>
      <Box
        sx={{
          display: 'flex',
          '@media(min-width: 600px)': {
            maxWidth: '85%',
          },
          gap: 1,
          alignItems: 'flex-start',
        }}>
        {!isUser && (
          <Avatar isUser={isUser}>
            <SmartToy
              fontSize="small"
              sx={{ color: '#606060' }}
            />
          </Avatar>
        )}

        <Paper
          elevation={0}
          sx={{
            py: 1,
            px: 2,
            borderRadius: 2,
            backgroundColor: isUser ? '#c71585' : '#ede8efc2',
            alignSelf: 'center',
            color: isUser ? 'white' : '#606060',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
          }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography>
              {message.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </Typography>
            {time && (
              <Typography
                variant="caption"
                sx={{ alignSelf: 'flex-end', color: isUser ? 'white' : 'text.secondary', mt: 1 }}>
                {time}
              </Typography>
            )}
          </Box>
        </Paper>

        {isUser && (
          <Avatar isUser={isUser}>
            <Person
              fontSize="small"
              sx={{ color: 'white' }}
            />
          </Avatar>
        )}
      </Box>
    </Box>
  );
}

function Avatar({ isUser, children }: IAvatar) {
  return (
    <Box
      sx={{
        backgroundColor: !isUser ? '#ede8efc2' : '#c71585',
        borderRadius: '50%',
        width: 32,
        height: 32,
        minWidth: 32,
        minHeight: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
        flexShrink: 0,
      }}>
      {children}
    </Box>
  );
}
