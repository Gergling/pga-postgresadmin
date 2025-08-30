import { useState } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    padding: theme.spacing(2),
    minWidth: '350px',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  textTransform: 'none',
  padding: theme.spacing(1, 3),
}));

type CreateDatabaseModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (dbName: string) => Promise<void>;
};
export const CreateDatabaseModal = ({ open, onClose, onConfirm }: CreateDatabaseModalProps) => {
  const [dbName, setDbName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!dbName.trim()) {
      setError('Database name cannot be empty.');
      return;
    }
    setError('');
    setIsLoading(true);
    await onConfirm(dbName);
    setIsLoading(false);
    setDbName('');
    onClose();
  };

  return (
    <StyledDialog open={open} onClose={onClose}>
      <DialogTitle>Create a New Database</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter a name for your new PostgreSQL database.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Database Name"
          type="text"
          fullWidth
          variant="outlined"
          value={dbName}
          onChange={(e) => setDbName(e.target.value)}
          error={!!error}
          helperText={error}
        />
      </DialogContent>
      <DialogActions>
        <StyledButton onClick={onClose} color="primary">
          Cancel
        </StyledButton>
        <StyledButton
          onClick={handleConfirm}
          color="primary"
          variant="contained"
          disabled={isLoading || !dbName.trim()}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Create'}
        </StyledButton>
      </DialogActions>
    </StyledDialog>
  );
}
