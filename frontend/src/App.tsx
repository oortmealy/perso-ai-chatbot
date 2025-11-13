import React, { useState, useEffect } from 'react';
import ChatInterface from './ChatInterface';
import ChatList from './ChatList';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { Box } from '@mui/material';
import { faker } from '@faker-js/faker';

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
  avatarSrc: string;
  botName: string;
  botAvatarSrc: string;
  messages: Message[];
  lastMessageSnippet: string;
}

const generateFakeChat = (id: string, name?: string): Chat => {
  const botFirstName = faker.person.firstName();
  const botLastName = faker.person.lastName();
  const chatName = name || `${botFirstName} ${botLastName}`;
  const botAvatar = faker.image.avatarGitHub();

  const initialMessages: Message[] = [
    {
      id: faker.string.uuid(),
      sender: 'bot',
      text: `Hello! I'm ${botFirstName}. How can I help you today?`,
    },
  ];

  return {
    id,
    name: chatName,
    avatarSrc: faker.image.avatarGitHub(),
    botName: botFirstName,
    botAvatarSrc: botAvatar,
    messages: initialMessages,
    lastMessageSnippet: initialMessages[0].text,
  };
};

function App() {
  const [chats, setChats] = useState<Chat[]>(() => {
    const initialChats: Chat[] = [];
    for (let i = 0; i < 3; i++) {
      initialChats.push(generateFakeChat(faker.string.uuid()));
    }
    return initialChats;
  });
  const [selectedChatId, setSelectedChatId] = useState<string | null>(chats.length > 0 ? chats[0].id : null);
  const currentUserAvatar = faker.image.avatarGitHub();

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  const handleAddNewChat = () => {
    const newChatId = faker.string.uuid();
    const newChat = generateFakeChat(newChatId, `New Chat ${chats.length + 1}`);
    setChats((prevChats) => [...prevChats, newChat]);
    setSelectedChatId(newChatId);
  };

  const handleSendMessage = (chatId: string, text: string) => {
    const newUserMessage: Message = {
      id: faker.string.uuid(),
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

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: faker.string.uuid(),
        sender: 'bot',
        text: faker.lorem.sentence({ min: 5, max: 15 }),
      };

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: [...chat.messages, botResponse],
                lastMessageSnippet: botResponse.text,
              }
            : chat
        )
      );
    }, faker.number.int({ min: 500, max: 2000 }));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
        <ChatList
          chats={chats}
          selectedChatId={selectedChatId}
          onSelectChat={handleSelectChat}
          onAddNewChat={handleAddNewChat}
        />
        {selectedChat ? (
          <ChatInterface
            currentChat={selectedChat}
            currentUserAvatar={currentUserAvatar}
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
            Select a chat or start a new one.
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;