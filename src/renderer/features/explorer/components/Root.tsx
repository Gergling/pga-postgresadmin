import { useMemo } from "react";
import { Grid, Stack } from "@mui/material";
import { getFrequentPaths } from "@/shared/utilities";
import { Block } from "@/renderer/shared/base";
import { List, ListItem } from "@/renderer/shared/list";
import { explorerHistoryStore } from "../stores";
import { ExplorerList } from "./List";
import { useExporerLocks } from "../hooks";
import { Button } from "@/renderer/shared/form";
import { StatusIcon } from "./StatusIcon";

const HistoryItem = ({ path }: { path: string; }) => {
  const { refetch, result } = useExporerLocks(path);
  const handleClick = () => refetch();
  return <ListItem>
    <Grid container spacing={2} alignItems={'center'}>
      <Grid size={'auto'}>
        <Button onClick={handleClick} sx={{
          borderRadius: '50%', p: 0, m: 0, w: 4, h: 4
        }}>
          <StatusIcon result={result} />
        </Button>
      </Grid>
      <Grid size={'grow'}>
        {path}
      </Grid>
    </Grid>
  </ListItem>;
};

export const ExplorerRoot = () => {
  const { history } = explorerHistoryStore();
  const paths = useMemo(() => getFrequentPaths(history), [history]);
  return <Block>
    <Stack spacing={2} sx={{ p: 4 }}>
      <List>
        {paths.map((item) => <HistoryItem key={item} path={item} />)}
      </List>
      <ExplorerList path="/" />
    </Stack>
  </Block>;
};
