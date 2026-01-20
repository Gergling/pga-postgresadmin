import { Badge, Chip, Stack, Tooltip, Typography } from "@mui/material";
import { interpolateHue } from '../../../../shared/utilities/colour';
import { TASK_IMPORTANCE_RANKS_MAXIMUM, TASK_IMPORTANCE_RANKS_MINIMUM, TASK_MOMENTUM_RANKS_MAXIMUM, TASK_MOMENTUM_RANKS_MINIMUM, TaskVotes } from "../../../../shared/features/user-tasks";
import { TaskViewConfigName, useNavigation } from "../../../shared/navigation";
import { CellRenderer } from "../types";
import {
  Gavel,
  HourglassEmpty,
  MilitaryTech,
  RemoveCircleOutline,
  Speed,
  SvgIconComponent
} from "@mui/icons-material";

const TOTAL_COUNCILLORS = 1;

type VoteProps = keyof TaskVotes;
const scoreConfig: {
  [K in VoteProps]: {
    icon: SvgIconComponent;
    maximum: number;
    minimum: number;
  };
} = {
  abstained: {
    icon: RemoveCircleOutline,
    maximum: 0,
    minimum: TOTAL_COUNCILLORS,
  },
  awaiting: {
    icon: HourglassEmpty,
    maximum: 0,
    minimum: TOTAL_COUNCILLORS,
  },
  echoes: {
    icon: RemoveCircleOutline,
    maximum: TOTAL_COUNCILLORS * 2,
    minimum: 0,
  },
  importance: {
    icon: MilitaryTech,
    maximum: TASK_IMPORTANCE_RANKS_MAXIMUM,
    minimum: TASK_IMPORTANCE_RANKS_MINIMUM,
  },
  momentum: {
    icon: Speed,
    maximum: TASK_MOMENTUM_RANKS_MAXIMUM,
    minimum: TASK_MOMENTUM_RANKS_MINIMUM,
  },
  mean: {
    icon: Gavel,
    maximum: (TASK_IMPORTANCE_RANKS_MAXIMUM + TASK_MOMENTUM_RANKS_MAXIMUM) / 2,
    minimum: (TASK_IMPORTANCE_RANKS_MINIMUM + TASK_MOMENTUM_RANKS_MINIMUM) / 2,
  },
};

const renderScore = (value: number, type: keyof Required<TaskVotes>) => {
  const { icon: Icon, maximum, minimum } = scoreConfig[type];
  const hue = interpolateHue(value, minimum, maximum);
  // TODO: See what gold/silver/bronze looks like.
  return (
    <Tooltip title={`${type.toUpperCase()}: ${value}`}>
      <Chip 
        icon={<Icon />}
        label={value}
        size="small"
        variant="outlined"
        sx={{ 
          // Apply spectral hue logic for momentum or a gold tint for importance here
          alignSelf: 'center',
          borderColor: `hsl(${hue}, 70%, 50%)`,
          fontWeight: 'bold',
          padding: '0.875rem 0.5rem',
        }} 
      />
    </Tooltip>
  );
};

const viewVoteScores: {
  [K in TaskViewConfigName]: VoteProps[];
} = {
  abstained: ['abstained', 'mean'],
  awaiting: ['awaiting', 'mean'],
  important: ['importance', 'momentum'],
  quick: ['momentum', 'importance'],
  proposed: ['mean', 'abstained', 'awaiting'],
};

// type HeroSubscorePropsTypeValue = { type: VoteProps; value: number; };
// type HeroSubscoreProps = {
//   hero?: HeroSubscorePropsTypeValue;
//   subscore?: HeroSubscorePropsTypeValue;
//   badge?: HeroSubscorePropsTypeValue;
// };

const HeroSubscore = ({ hero, subscore, badge, type }: { hero?: number; subscore?: number; badge?: number; type: VoteProps; }) => {
  return <Stack direction="row" spacing={1} sx={{ height: '100%' }}>
    <Badge
      badgeContent={badge}
      color="primary"
      invisible={!badge}
      sx={{
        '& .MuiBadge-badge': {
          top: 13,
        },
      }}
    >
      {renderScore(hero ?? 0, type)}
      {subscore ? <Typography variant="caption" sx={{ opacity: 0.5 }}>({subscore})</Typography> : null}
    </Badge>
  </Stack>;
};

export const TaskScoreCellRenderer: CellRenderer = ({ row: { scores } }) => {
  const { current } = useNavigation();
  // TODO: This shouldn't happen (at least for long) so I guess display an error.
  if (!current) return null;

  const view = current.name as TaskViewConfigName;
  const [hero, subscore, badge] = viewVoteScores[view];

  return <HeroSubscore
    badge={badge && scores.task[badge]}
    hero={scores.task[hero]}
    subscore={subscore && scores.task[subscore]}
    type={hero}
  />;
};
