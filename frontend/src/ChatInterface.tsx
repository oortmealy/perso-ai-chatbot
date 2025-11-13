import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Typography,
  Stack,
  alpha,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

// Re-defining interfaces from App.tsx for clarity in this file
interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

interface Chat {
  id: string;
  name: string;
  avatarSrc: string;
  botName: string;
  botAvatarSrc: string;
  messages: Message[];
  lastMessageSnippet: string;
}

interface ChatInterfaceProps {
  currentChat: Chat;
  currentUserAvatar: string;
  onSendMessage: (chatId: string, text: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  currentChat,
  currentUserAvatar,
  onSendMessage,
}) => {
  const [inputMessage, setInputMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the latest message
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat.messages]); // Re-scroll whenever messages in the current chat change

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;
    onSendMessage(currentChat.id, inputMessage.trim());
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1, // Allows ChatInterface to take remaining space
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        py: 4,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: '100%', // Takes full width of its flex container
          maxWidth: { xs: '95%', sm: '100%' }, // Responsive max-width
          height: '100%',
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: `0px 8px 24px ${alpha('#000', 0.1)}`,
          bgcolor: 'background.paper',
          mx: { xs: 'auto', sm: 0 }, // Center horizontally on small screens
        }}
      >
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
          <List>
            {currentChat.messages.map((message) => (
              <ListItem
                key={message.id}
                sx={{
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  px: 0,
                  py: 1,
                  alignItems: 'flex-start',
                }}
              >
                {message.sender === 'bot' && (
                  <Avatar alt={currentChat.botName} src={currentChat.botAvatarSrc} sx={{ mr: 1, width: 32, height: 32 }} />
                )}
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    borderRadius: 3,
                    maxWidth: '80%',
                    bgcolor: message.sender === 'user' ? '#e1f5fe' : '#f5f5f5',
                    color: 'text.primary',
                    borderColor: message.sender === 'user' ? '#bbdefb' : '#e0e0e0',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                  }}
                >
                  <ListItemText
                    disableTypography
                    primary={
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 400,
                          lineHeight: 1.4,
                          color: message.sender === 'user' ? 'primary.dark' : 'text.primary',
                        }}
                      >
                        {message.text}
                      </Typography>
                    }
                    sx={{ my: 0 }}
                  />
                </Paper>
                {message.sender === 'user' && (
                  <Avatar alt="You" src={currentUserAvatar} sx={{ ml: 1, width: 32, height: 32 }} />
                )}
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List>
        </Box>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            p: 2,
            borderTop: '1px solid #e0e0e0',
            bgcolor: 'background.paper',
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                pr: 0.5,
              },
            }}
            aria-label="Type your message"
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            endIcon={<SendIcon />}
            sx={{
              borderRadius: 2,
              minWidth: 'auto',
              px: 2,
              py: 1,
              backgroundColor: 'primary.main', // Using theme primary color
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
            aria-label="Send message"
          >
            Send
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ChatInterface;