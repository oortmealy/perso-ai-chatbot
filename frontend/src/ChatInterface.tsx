import { useState, useRef, useEffect } from 'react';
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

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

interface Chat {
  id: string;
  name: string;
  messages: Message[];
  lastMessageSnippet: string;
}

interface ChatInterfaceProps {
  currentChat: Chat;
  onSendMessage: (chatId: string, text: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  currentChat,
  onSendMessage,
}) => {
  const messages = currentChat.messages;
  const [inputMessage, setInputMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the latest message
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        py: 4,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: '100%',
          maxWidth: { xs: '95%', sm: '100%' },
          height: '100%',
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: `0px 8px 24px ${alpha('#000', 0.1)}`,
          bgcolor: 'background.paper',
          mx: { xs: 'auto', sm: 0 },
        }}
      >
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
          <List>
            {messages.map((message) => (
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
                  <Avatar sx={{ mr: 1, width: 32, height: 32, bgcolor: 'primary.main' }}>
                    P
                  </Avatar>
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
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {message.text}
                      </Typography>
                    }
                    sx={{ my: 0 }}
                  />
                </Paper>
                {message.sender === 'user' && (
                  <Avatar sx={{ ml: 1, width: 32, height: 32, bgcolor: 'secondary.main' }}>
                    U
                  </Avatar>
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
            placeholder="Perso.ai에 대해 질문해보세요..."
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
              backgroundColor: 'primary.main',
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
