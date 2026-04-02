// TODO: Some iSlop to clean up.

// Since you have limited horizontal space, a standard row is too cramped. I suggest a Stacked Micro-Card within your dashboard column. Each card represents a "Pulse" in the system.

import { Box, Typography } from "@mui/material";
import { CardHeader, MetaText, MicroCard, PrepBar, RuneWrapper } from "./Pipeline.style";
import { useJobSearchApplicationsIpc } from "../hooks";
import { useMemo } from "react";
import { comparePipelineApplications, createJobSearchUiApplication } from "../utilities";

// The "Action" Card (What YOU do)
// Visuals: Solid Neon Red border.
// Top Row: The Glyph/Rune for the role + Company name.
// Center: A "Progress Bar" showing Prep Level (e.g., a 3-segment bar: Research, Tech, Narrative).
// Bottom: A relative time string (e.g., "In 2 days" or "15 days stagnant").

// The "Radar" Card (What THEY do)
// Visuals: Dotted/Faded border (the "Hollow" feel).
// Top Row: The "Vessel" icon (Email/Phone) representing where the ball is currently held.
// Logic: These cards don't need buttons; they are just "Ghost" entries to keep the company on your radar so they don't vanish from your brain.

export const JobSearchPipeline = () => {
  const { applications } = useJobSearchApplicationsIpc();
  const items = useMemo(() => {
    if (!applications) return [];
    return [...applications.values()]
      .map(createJobSearchUiApplication)
      .map((application) => ({ ...application, isActionable: true })) // TODO: Just for testing, remove.
      .sort(comparePipelineApplications);
  }, [applications]);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
      {items.map((item) => (
        <MicroCard 
          key={item.id} 
          type={item.isActionable ? 'action' : 'radar'}
          urgencyLevel={3}
        >
          <CardHeader>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="caption" sx={{ color: '#fff', fontWeight: 800, display: 'block', noWrap: 'true' }}>
                {item.role}
              </Typography>
              <Typography variant="overline" sx={{ color: '#ff0000c0', lineHeight: 1 }}>
                {item.company?.name || '(Unknown Company)'}
              </Typography>
            </Box>
            <RuneWrapper>
              {/* If Prep: Kenaz, If Radar: Ansuz/Speech Bubble */}
              {item.isActionable ? 'ᚲ' : 'ᚨ'}
            </RuneWrapper>
          </CardHeader>

          {item.isActionable && (
            <Box>
              <MetaText sx={{ mb: 0.5 }}>PREP LEVEL: {35}%</MetaText>
              <PrepBar variant="determinate" value={35} />
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
            <MetaText>{item.phase}</MetaText>
            <MetaText sx={{ color: '#fff' }}>{item.lastInteractionTime?.temporal.toString()}</MetaText>
          </Box>
        </MicroCard>
      ))}
    </Box>
  );
};
