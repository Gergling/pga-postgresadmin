import React, { useMemo } from 'react';
import { Box, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  COUNCIL_MEMBER,
  CouncilMemberVoteValue,
  TaskVoteSummary
} from "@/shared/features/user-tasks";
import { CellRenderer } from "../../../types";

const [LIBRARIAN, ...COUNCILLORS] = COUNCIL_MEMBER;

interface VoteHexagonProps {
  // scores: Record<CouncilMemberNames, CouncilMemberVoteValue>;
  scores: TaskVoteSummary['council']['map'];
  size?: number;
}

const Petal = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'color' && prop !== 'angle' && prop !== 'distance',
})<{ color: string; angle: number; distance: number }>(({ color, angle, distance }) => ({
  position: 'absolute',
  width: '22%', // Size relative to container
  height: '22%',
  borderRadius: '50%',
  border: '1px solid',
  borderColor: color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontSize: '0.7rem',
  fontWeight: 'bold',
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  transition: 'transform 0.2s ease-in-out',
  // Trigonometry to place them in a Hexagon
  left: `calc(50% + ${Math.sin((angle * Math.PI) / 180) * distance}% - 11%)`,
  top: `calc(50% - ${Math.cos((angle * Math.PI) / 180) * distance}% - 11%)`,
  '&:hover': {
    transform: 'scale(1.2)',
    zIndex: 10,
  },
}));

const PetalContainer = ({
  angle,
  color,
  distance,
  label,
  score,
}: {
  angle: number;
  color: string;
  distance: number;
  label: string;
  score: CouncilMemberVoteValue;
}) => {
  const echoes = useMemo(() => score.echoes.some((e) => e), [score]);
  const opacity = useMemo(
    () => echoes ? 0.3 : 1,
    [echoes]
  );

  return <Tooltip title={`${label}: ${score.values[0]}`}>
    <Petal
      angle={angle}
      color={color}
      distance={distance}
      style={{ opacity, zIndex: 2 }}
    >
      {score.values}
    </Petal>
  </Tooltip>;
};

export const VoteHexagon: React.FC<VoteHexagonProps> = ({ scores, size = 100 }) => {
  return (
    <Box sx={{
      width: size,
      height: size,
      position: 'relative',
      margin: 'auto',
      // Optional: slight background to see the "bounds"
      bgcolor: 'rgba(255,255,255,0.05)',
      // borderRadius: '50%'
    }}>
      {/* Center: The Librarian */}
      <PetalContainer
        angle={0}
        color={LIBRARIAN.color}
        distance={0}
        label={LIBRARIAN.label}
        score={scores[LIBRARIAN.name].summary}
      />

      {/* The 6 Outer Councillors */}
      {COUNCILLORS.map((c, index) => (
        <PetalContainer
          angle={index * 60}
          color={c.color}
          distance={36}
          key={c.name}
          label={c.label}
          score={scores[c.name].summary}
        />
      ))}
    </Box>
  );
};

export const TaskVotesCellRenderer: CellRenderer = ({ row: task }) => {
  return <VoteHexagon scores={task.voteSummary.council.map} size={48} />;
};
