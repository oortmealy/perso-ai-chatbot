import React, { useState } from 'react';
import ChatInterface from './ChatInterface';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { Box } from '@mui/material';

// Define the Message interface
interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

// API endpoint
const API_URL = 'http://127.0.0.1:8000/api/chat';

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: '안녕하세요! Perso.ai에 대해 궁금한 점을 물어보세요.',
    },
  ]);

  const handleSendMessage = async (text: string) => {
    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
    };

    setMessages((prev) => [...prev, newUserMessage]);

    // Call backend API
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: text }),
      });

      if (!response.ok) {
        throw new Error('API 요청 실패');
      }

      const data = await response.json();

      // Add bot response
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.answer,
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error('Error calling API:', error);
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;