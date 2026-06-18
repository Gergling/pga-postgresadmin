import { Grid, Skeleton, Stack } from "@mui/material";
import { useMemo, useState } from "react";
import { BugReport, Folder, InsertDriveFile } from "@mui/icons-material";
import { DirentSummary } from "@/shared/features/explorer";
import { List, ListItem } from "@/renderer/shared/list";
import { Button } from "@/renderer/shared/form";
import { Slab } from "@/renderer/shared/base";
import { ParentheticalContainer } from "@/renderer/shared/brackets";
import { Typography } from "@/renderer/shared/theme";
import { useExplorerListItem, useExplorerNode } from "../hooks";

const Item = ({
  handleNavigate,
  item: { name, options: { expand, testable } },
}: {
  handleNavigate: () => void;
  item: DirentSummary;
}) => {
  const [{ unitTest }, dispatch] = useExplorerListItem({
    unitTest: testable === 'create' ? 'eligible' : 'none'
  });
  const handleCreateUnitTest = () => {
    if (unitTest === 'eligible') dispatch({
      type: 'unit-test', payload: 'initiate'
    });
  };

  return <ListItem>
    <Stack spacing={2} direction={'column'}>
      <Grid container spacing={2} alignItems={'center'}>
        <Grid size={'auto'}>
          <Button onClick={handleNavigate} sx={{
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
        {unitTest === 'eligible' && <Grid size={'auto'}>
          <Button onClick={handleCreateUnitTest} sx={{
            p: 0, m: 0, w: 4, h: 4
          }}>
            <BugReport />
          </Button>
        </Grid>}
      </Grid>
    </Stack>
  </ListItem>
};

export const ExplorerWindow = ({ path: basePath }: { path: string; }) => {
  const [path, setPath] = useState(basePath);
  const {
    children, parent: parentData, isLoading, isError, error
  } = useExplorerNode(path);
  const parent = useMemo(
    () => parentData && { ...parentData, name: '../' },
    [parentData]
  );
  const handleExpandFactory = (
    item: DirentSummary
  ) => () => setPath(item.absolutePath);

  // TODO: Handle a lack of parent *somehow*.
  return <Stack>
    <Slab showScanLines>
      <ParentheticalContainer
        dimension={'vertical'}
        roundness={0}
        style={{ padding: '1rem' }}
        thickness={3}
      ><Typography variant={'h6'} fontSize={'1rem'}>{path}</Typography>
      </ParentheticalContainer>
    </Slab>
    <Grid container>
      <Grid size={'auto'}>
        {isLoading && <Skeleton variant={'rectangular'} />}
        <>{isError && error}</>
        {children.length > 0 && <List>
          {parent && <Item
              handleNavigate={handleExpandFactory(parent)}
              item={parent}
            />
          }
          {children.map(
            (item) => <Item
              handleNavigate={handleExpandFactory(item)}
              item={item}
              key={item.absolutePath}
            />
          )}
        </List>}
      </Grid>
      <Grid size={'auto'}>
        Right panel.
      </Grid>
    </Grid>
  </Stack>;
};
