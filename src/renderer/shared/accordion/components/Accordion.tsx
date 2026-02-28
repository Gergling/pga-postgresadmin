import { AccordionProps } from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import BloodtypeIcon from '@mui/icons-material/Bloodtype'; // Thematic icon
import { NeonAccordion, NeonAccordionDetails, NeonAccordionSummary } from './Accordion.style';

// 4. Usage Component
export const Accordion = ({ children, summary, ...props }: AccordionProps & {
  children: React.ReactNode;
  summary: React.ReactNode;
}) => {
  return (
    <NeonAccordion {...props}>
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