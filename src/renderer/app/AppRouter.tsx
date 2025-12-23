import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { DatabasesView } from "../views";
import { HomeView } from "../views/Home";
import { Box, Tab, Tabs } from "@mui/material";
import { Home } from "@mui/icons-material";
import { PropsWithChildren, useEffect, useState } from "react";

const Debug = ({ children }: PropsWithChildren) => {
  console.log(children);
  return (
    <div style={{ backgroundColor: '#eee', paddingLeft: '5px', }}>
      {children}
    </div>
  );
}

const AppRoutes = () => {
  const { pathname } = useLocation();
  const [selectedRoute, setSelectedRoute] = useState('/');
  const navigate = useNavigate();

  useEffect(() => {
    navigate(selectedRoute);
  }, [navigate, selectedRoute]);

  return (
    <div>
      <Debug>{pathname}</Debug>
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
