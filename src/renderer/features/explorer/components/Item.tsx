import { useEffect } from "react";
import { BugReport, Folder, InsertDriveFile } from "@mui/icons-material";
import { Grid, Stack } from "@mui/material";
import { skipToken } from "@tanstack/react-query";
import { DirentSummary } from "@/shared/features/explorer";
import { Button } from "@/renderer/shared/form";
import { ListItem } from "@/renderer/shared/list";
import { trpcReact } from "@/renderer/libs/react-query";
import { useExplorerListItem } from "../hooks";
import { explorerHistoryStore } from "../stores";
import { ExplorerList } from "./List";

export const ExplorerItem = ({
  absolutePath, name, options: { expand, testable }
}: DirentSummary) => {
  const [{ open, unitTest }, dispatch] = useExplorerListItem({
    unitTest: testable === 'create' ? 'eligible' : 'none'
  });
  // const { refetch, result } = useExplorerLocks(absolutePath);

  const { addHistory, history } = explorerHistoryStore();
  const {
    data: unitTestCreationData
  } = trpcReact.explorer.createUnitTest.useSubscription(
    unitTest === 'initiated' ? absolutePath : skipToken
  );

  const handleExpand = () => {
    dispatch('toggle');
    // Note: Should probably disable until settled.
    // refetch();
  }
  const handleCreateUnitTest = () => {
    if (unitTest === 'eligible') dispatch({
      type: 'unit-test', payload: 'initiate'
    });
  };

  useEffect(() => {
    history.includes(absolutePath) && dispatch('open');
  }, [absolutePath, history]);
  useEffect(() => {
    if (open) addHistory(absolutePath);
  }, [absolutePath, open]);
  useEffect(() => {
    dispatch({ type: 'unit-test', payload: 'create' });
  }, [unitTest]);
  useEffect(() => {
    if (unitTestCreationData) {
      const { payload: { status } } = unitTestCreationData;
      console.log(unitTestCreationData)
      if (status === 'success') {
        dispatch({
          type: 'unit-test', payload: 'complete'
        });
      }
      if (status === 'failed') {
        dispatch({
          type: 'unit-test', payload: 'fail'
        });
      }
    }
  }, [unitTestCreationData]);

  return <>
    <ListItem>
      <Stack spacing={2} direction={'column'}>
        <Grid container spacing={2} alignItems={'center'}>
          <Grid size={'auto'}>
            <Button onClick={handleExpand} sx={{
              p: 0, m: 0, w: 4, h: 4
            }}>
              {expand
                ? <Folder />
                : <InsertDriveFile />
              }
            </Button>
          </Grid>
          <Grid size={'auto'}>
            {/* <StatusIcon result={result} /> */}
          </Grid>
          <Grid size={'grow'}>
            {name}
          </Grid>
          {testable && <Grid size={'auto'}>
            <Button onClick={handleCreateUnitTest} sx={{
              p: 0, m: 0, w: 4, h: 4
            }}>
              <BugReport />
            </Button>
          </Grid>}
        </Grid>
        {expand && open && <ExplorerList path={absolutePath} />}
      </Stack>
    </ListItem>
  </>
};
