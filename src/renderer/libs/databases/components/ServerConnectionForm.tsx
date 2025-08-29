import React, { useState } from 'react';
import { TextField, Button, Box, Paper, Typography } from '@mui/material';
import { useDatabasesServerStore } from '../hooks/use-server-store';

export const DatabasesServerConnectionForm = () => {
  const { credentials, save } = useDatabasesServerStore();
  const [formState, setFormState] = useState(credentials);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSave = () => save(formState);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Server Connection
        </Typography>
        <TextField
          label="User"
          name="user"
          fullWidth
          margin="normal"
          value={formState.user}
          onChange={handleChange}
        />
        <TextField
          label="Host"
          name="host"
          fullWidth
          margin="normal"
          value={formState.host}
          onChange={handleChange}
        />
        <TextField
          label="Port"
          name="port"
          type="number"
          fullWidth
          margin="normal"
          value={formState.port}
          onChange={handleChange}
        />
        <TextField
          label="Database"
          name="database"
          fullWidth
          margin="normal"
          value={formState.database}
          onChange={handleChange}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          value={formState.password}
          onChange={handleChange}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          fullWidth
          sx={{ mt: 2 }}
        >
          Save
        </Button>
      </Paper>
    </Box>
  );
};
