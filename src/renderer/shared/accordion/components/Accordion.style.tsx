import { styled, alpha } from '@mui/material/styles';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const NeonAccordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  backgroundColor: '#0a0505', // Deep "clotted" black
  border: `1px solid ${alpha('#ff0000', 0.2)}`,
  borderRadius: '4px',
  transition: 'all 0.3s ease-in-out',
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    border: `1px solid #ff0000`,
    boxShadow: `0 0 15px ${alpha('#ff0000', 0.4)}, inset 0 0 5px ${alpha('#ff0000', 0.2)}`,
    margin: '12px 0',
  },
}));

export const NeonAccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ExpandMoreIcon sx={{ color: '#ff0000' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: alpha('#ff0000', 0.03),
  flexDirection: 'row',
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  '&.Mui-expanded': {
    backgroundColor: alpha('#ff0000', 0.08),
  },
  // Hover state adds "Blood Flow"
  '&:hover': {
    backgroundColor: alpha('#ff0000', 0.1),
    '& .MuiTypography-root': {
      textShadow: `0 0 8px #ff0000`,
    },
  },
}));

export const NeonAccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(3),
  borderTop: `1px solid ${alpha('#ff0000', 0.3)}`,
}));
