import React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Avatar,
  Button,
  ListItemAvatar, // <--- Add this import
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

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

interface ChatListProps {
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onAddNewChat: () => void;
}

const ChatList: React.FC<ChatListProps> = ({ chats, selectedChatId, onSelectChat, onAddNewChat }) => {
  return (
    <Box
      sx={{
        width: 300,
        flexShrink: 0,
        borderRight: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Chats
        </Typography>
        <Button
          variant="contained"
          size="small"
          onClick={onAddNewChat}
          startIcon={<AddCircleOutlineIcon />}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          New Chat
        </Button>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1, overflowY: 'auto', py: 0 }}>
        {chats.map((chat) => (
          <ListItemButton
            key={chat.id}
            selected={chat.id === selectedChatId}
            onClick={() => onSelectChat(chat.id)}
            sx={{
              py: 1.5,
              px: 2,
              '&.Mui-selected': {
                bgcolor: 'action.selected',
                borderLeft: '4px solid',
                borderColor: 'primary.main',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              },
            }}
          >
            <ListItemAvatar>
              <Avatar alt={chat.name} src={chat.avatarSrc} />
            </ListItemAvatar>
            <ListItemText
              primary={chat.name}
              secondary={chat.lastMessageSnippet}
              primaryTypographyProps={{ fontWeight: 500 }}
              secondaryTypographyProps={{ noWrap: true, variant: 'body2', color: 'text.secondary' }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default ChatList;