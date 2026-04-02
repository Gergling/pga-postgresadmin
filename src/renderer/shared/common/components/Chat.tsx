import { Button, TextField } from '@/renderer/shared/form';
import { Box, Grid, Stack } from '@mui/material';
import React, { useState, useEffect } from 'react';

export type ChatMessageProps = {
  actions?: React.ReactNode;
  content: React.ReactNode;
  role: string;
  timestamp: number;
};

export type ChatOnSubmitFunction = (props: {
  message: ChatMessageProps;
  messages: ChatMessageProps[];
}) => void;

type ChatWindowProps = {
  actions?: React.ReactNode;
  messages: ChatMessageProps[];
  onSubmit: ChatOnSubmitFunction;
  storageKey: string;
};
export const ChatWindow = ({
  actions,
  messages,
  onSubmit,
  storageKey,
}: ChatWindowProps) => {
  const [input, setInput] = useState<string>('');

  const handleInputChange = (val: string) => {
    setInput(val);
    localStorage.setItem(storageKey, val);
  };

  // Only update input from localStorage on initial load
  useEffect(() => {
    const savedText = localStorage.getItem(storageKey);
    if (savedText) {
      setInput(savedText);
    }
  }, []);

  const handleSubmitMessage = () => {
    if (!input.trim()) return;

    const message: ChatMessageProps = {
      content: input,
      role: 'user',
      timestamp: Date.now(),
    };

    onSubmit({
      message,
      messages: [...messages, message],
    });
    
    // Clear state and localStorage
    setInput('');
    localStorage.removeItem(storageKey);
    
    console.log('Message submitted:', input);
  };

  // TODO: Chat bubbles need styling.

  return (
    <Stack spacing={2}>
      <TextField
        onPersist={handleInputChange}
        rows={4}
        value={input}
      />

      <Grid container spacing={2}>
        <Button onClick={handleSubmitMessage}>
          Submit
        </Button>
        {actions}
      </Grid>

      <Stack spacing={2} sx={{ border: '1px solid #ccc', minHeight: '50px', overflowY: 'scroll' }}>
        {messages.map((msg, i) => (
          <Box key={i} style={{ margin: '10px' }}>
            <strong>{msg.role}:</strong>
            <div>{msg.content}</div>
            {msg.actions && <Grid container spacing={2}>
              {msg.actions}
            </Grid>}
          </Box>
        ))}
      </Stack>
    </Stack>
  );
};
