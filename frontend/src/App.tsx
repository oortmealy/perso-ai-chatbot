import { useState } from 'react';
import ChatInterface from './ChatInterface';
import ChatList from './ChatList';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { AppBar, Toolbar, Typography, Box, Avatar, IconButton, Menu, MenuItem } from '@mui/material';

// Define the Message interface
interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

// Define the Chat interface
interface Chat {
  id: string;
  name: string;
  messages: Message[];
  lastMessageSnippet: string;
}

// API endpoint
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/chat';

function App() {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      name: 'Perso.ai 챗봇',
      messages: [
        {
          id: '1',
          sender: 'bot',
          text: '안녕하세요! Perso.ai에 대해 궁금한 점을 물어보세요.',
        },
      ],
      lastMessageSnippet: '안녕하세요! Perso.ai에 대해 궁금한 점을 물어보세요.',
    },
  ]);
  const [selectedChatId, setSelectedChatId] = useState<string>('1');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  const handleAddNewChat = () => {
    const newChatId = Date.now().toString();
    const newChat: Chat = {
      id: newChatId,
      name: `새 채팅 ${chats.length + 1}`,
      messages: [
        {
          id: newChatId + '-1',
          sender: 'bot',
          text: '안녕하세요! Perso.ai에 대해 궁금한 점을 물어보세요.',
        },
      ],
      lastMessageSnippet: '안녕하세요! Perso.ai에 대해 궁금한 점을 물어보세요.',
    };
    setChats((prevChats) => [...prevChats, newChat]);
    setSelectedChatId(newChatId);
  };

  const handleSendMessage = async (chatId: string, text: string) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
    };

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [...chat.messages, newUserMessage],
              lastMessageSnippet: text,
            }
          : chat
      )
    );

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

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.answer,
      };

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: [...chat.messages, botResponse],
                lastMessageSnippet: data.answer,
              }
            : chat
        )
      );
    } catch (error) {
      console.error('Error calling API:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.',
      };
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: [...chat.messages, errorMessage],
                lastMessageSnippet: errorMessage.text,
              }
            : chat
        )
      );
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'column', bgcolor: 'background.default', overflow: 'hidden' }}>
        <AppBar position="static" elevation={2} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, color: 'primary.main' }}>
              Perso.ai 챗봇
            </Typography>
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <Avatar src="/assets/user-profile.png" sx={{ width: 32, height: 32, bgcolor: 'transparent' }} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleMenuClose}>프로필</MenuItem>
              <MenuItem onClick={handleMenuClose}>설정</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          <ChatList
            chats={chats}
            selectedChatId={selectedChatId}
            onSelectChat={handleSelectChat}
            onAddNewChat={handleAddNewChat}
          />
          {selectedChat ? (
            <ChatInterface
              currentChat={selectedChat}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'text.secondary',
                fontSize: '1.2rem',
              }}
            >
              채팅을 선택하거나 새로 시작하세요.
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;