import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Box, Tab, Tabs } from "@mui/material";
import { Home } from "@mui/icons-material";
import { DatabasesView, HomeView } from "../views";
import { useApp } from "./hooks";
import { Debug } from "./Debug";

const AppRoutes = () => {
  const { pathname, setSelectedRoute } = useApp();

  return (
    <div>
      <Debug>Current path: {pathname}</Debug>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={pathname} onChange={(_, value) => setSelectedRoute(value)}>
          <Tab icon={<Home />} value={'/'} />
        </Tabs>
      </Box>

      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/databases/*" element={<DatabasesView />} />
        <Route path="/*" element={<HomeView />} />
      </Routes>
    </div>
  );
};

export const AppRouter = () => {
  return <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>;
};
