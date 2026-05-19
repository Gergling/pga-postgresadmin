import { useEffect, useReducer } from "react";
import z from "zod";
import { Folder, InsertDriveFile } from "@mui/icons-material";
import { Grid, Stack } from "@mui/material";
import { DirentSummary } from "@/main/features";
import { Button } from "@/renderer/shared/form";
import { ListItem } from "@/renderer/shared/list";
import { useExporerLocks } from "../hooks";
import { explorerHistoryStore } from "../stores";
import { ExplorerList } from "./List";
import { StatusIcon } from "./StatusIcon";

// TODO: Probably don't need all of this.
const stateSchema = z.object({
  open: z.boolean().default(false),
  fetchLocks: z.enum(['empty', 'initiated', 'done']).default('empty'),
});
const initialState = stateSchema.parse({});
type State = z.infer<typeof stateSchema>;
type Action = 'fetch' | 'lock' | 'open' | 'toggle';
const reducer = (state: State, action: Action): State => {
  switch (action) {
    case 'fetch': return {
      ...state,
      fetchLocks: state.fetchLocks === 'empty' ? 'initiated' : state.fetchLocks,
    };
    case 'lock': return { ...state, fetchLocks: 'done' };
    case 'open': return { ...state, open: true };
    case 'toggle': return { ...state, open: !state.open };
    default: return state;
  }
}

export const ExplorerItem = ({
  absolutePath, isDirectory, name
}: DirentSummary) => {
  const [{ open }, dispatch] = useReducer(reducer, initialState);
  const { refetch, result } = useExporerLocks(absolutePath);

  const { addHistory, history } = explorerHistoryStore();
  const handleClick = () => {
    dispatch('toggle');
    // Note: Should probably disable until settled.
    refetch();
  }

  useEffect(() => {
    history.includes(absolutePath) && dispatch('open');
  }, [absolutePath, history]);
  useEffect(() => {
    if (open) addHistory(absolutePath);
  }, [absolutePath, open]);

  return <>
    <ListItem>
      <Stack spacing={2} direction={'column'}>
        <Grid container spacing={2} alignItems={'center'}>
          <Grid size={'auto'}>
            <Button onClick={handleClick} sx={{
              borderRadius: '50%', p: 0, m: 0, w: 4, h: 4
            }}>
              {isDirectory
                ? <Folder />
                : <InsertDriveFile />
              }
            </Button>
          </Grid>
          <Grid size={'auto'}>
            <StatusIcon result={result} />
          </Grid>
          <Grid size={'grow'}>
            {name}
          </Grid>
        </Grid>
        {isDirectory && open && <ExplorerList path={absolutePath} />}
      </Stack>
    </ListItem>
  </>
};
