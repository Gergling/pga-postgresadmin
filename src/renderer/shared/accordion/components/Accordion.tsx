import { styled, alpha } from '@mui/material/styles';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BloodtypeIcon from '@mui/icons-material/Bloodtype'; // Thematic icon

// 1. The Container: Deep Charcoal with a "Vascular" Red Glow
const NeonAccordion = styled((props: AccordionProps) => (
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
    margin: '12px 0', // "Pulse" effect when opening
  },
}));

// 2. The Summary: The "Pulse" of the component
const NeonAccordionSummary = styled((props: AccordionSummaryProps) => (
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

// 3. The Details: Where the Enrichment happens
const NeonAccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(3),
  borderTop: `1px solid ${alpha('#ff0000', 0.3)}`,
  // backgroundColor: '#0d0707',
}));

// 4. Usage Component
export const Accordion = ({ children, summary }: AccordionProps & {
  children: React.ReactNode;
  summary: React.ReactNode;
}) => {
  return (
    <NeonAccordion>
      <NeonAccordionSummary>
        <BloodtypeIcon sx={{ color: '#ff0000', fontSize: '1.2rem' }} />
        <Typography 
          variant="button" 
          sx={{ 
            color: '#ff0000', 
            fontWeight: 800, 
            letterSpacing: '0.1em',
            transition: 'text-shadow 0.2s'
          }}
        >
          {summary}
        </Typography>
      </NeonAccordionSummary>
      <NeonAccordionDetails>
        {children}
      </NeonAccordionDetails>
    </NeonAccordion>
  );
};