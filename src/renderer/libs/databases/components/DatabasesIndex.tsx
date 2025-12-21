import { useEffect, useMemo, useState } from "react";
import { useDockerStore } from "../../docker";
import { useDatabasesServerStore } from "../hooks/use-server-store";
import { DatabasesListDatabases } from "./ListDatabases";
import { DatabasesLoadingStatus } from "./LoadingStatus";
import { DatabasesServerConnectionForm } from "./ServerConnectionForm";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { DatabaseDetail } from "./DatabaseDetail";
import { Box, Tab, Tabs } from "@mui/material";
import { Home } from "@mui/icons-material";

const SwitchComponent = ({ show }: { show: string }) => {
  switch (show) {
    case 'server-credentials':
      return <DatabasesServerConnectionForm />;
    case 'databases-list':
      return <DatabasesListDatabases />;
    default:
      return <DatabasesLoadingStatus />;
  }
}

export const DatabasesIndex = () => {
  const {
    isCompleted,
    needsServerCredentials,
  } = useDockerStore();
  const { load, status } = useDatabasesServerStore();
  const show = useMemo(() => {
    if (status === 'empty' || needsServerCredentials) return 'server-credentials';
    if (isCompleted) return 'databases-list';
    return 'loading-status';
  }, [isCompleted, needsServerCredentials, status]);
  const { pathname } = useLocation();
  const [selectedDatabase, setSelectedDatabase] = useState('/databases');
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    navigate(selectedDatabase);
  }, [navigate, selectedDatabase]);

  return (
    <div>
      <>{pathname}</>
      {status === 'empty' && <div>Please enter your database server connection details.</div>}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={selectedDatabase} onChange={(_, value) => setSelectedDatabase(value)}>
          <Tab icon={<Home />} value={'/databases'} />
          {pathname !== '/databases' ? <Tab label={pathname} value={pathname} /> : undefined}
        </Tabs>
      </Box>
      <Routes>
        <Route path="/" element={<SwitchComponent show={show} />} />
        <Route path="/:dbName" element={<DatabaseDetail />} />
      </Routes>
    </div>
  );
};
