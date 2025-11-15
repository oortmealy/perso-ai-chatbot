import { useState } from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

interface SplashIntroProps {
  onTitleAnimationComplete: () => void;
  onStartChatClick: () => void;
}

const SplashIntro: React.FC<SplashIntroProps> = ({ onTitleAnimationComplete, onStartChatClick }) => {
  const theme = useTheme();
  const [showButton, setShowButton] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 10,
        stiffness: 100,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5,
        type: 'spring',
        damping: 10,
        stiffness: 100,
      },
    },
  };

  const titleText = "Perso Q&A";

  const handleTitleAnimationSequenceComplete = () => {
    onTitleAnimationComplete();
    setShowButton(true);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        bgcolor: theme.palette.primary.main,
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        gap: 4,
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onAnimationComplete={handleTitleAnimationSequenceComplete}
        style={{ display: 'flex' }}
      >
        {titleText.split("").map((char, index) => (
          <motion.span key={index} variants={itemVariants}>
            <Typography
              variant="h1"
              sx={{
                color: theme.palette.primary.contrastText,
                fontWeight: 700,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                mx: 0.5,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </Typography>
          </motion.span>
        ))}
      </motion.div>

      {showButton && (
        <motion.div
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
        >
          <Button
            variant="contained"
            color="secondary"
            size="large"
            endIcon={<ChatBubbleOutlineIcon />}
            onClick={onStartChatClick}
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
              bgcolor: 'white',
              color: theme.palette.primary.main,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.3)',
                transform: 'translateY(-2px)',
              },
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            }}
          >
            새 채팅 시작하기
          </Button>
        </motion.div>
      )}
    </Box>
  );
};

export default SplashIntro;
