import { BrowserRouter } from "react-router-dom";
import { Box, Tab, Tabs } from "@mui/material";
import { QuestionMark } from "@mui/icons-material";
import { useApp } from "./hooks";
import { Debug } from "./Debug";

const AppRoutes = () => {
  const {
    children,
    pathname,
    rootPathname,
    setSelectedRoute,
    tabs,
  } = useApp();

  return (
    <div>
      <Debug>Current path: {pathname}</Debug>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={rootPathname} onChange={(_, value) => setSelectedRoute(value)}>
          {tabs.map(({ value, icon }) => <Tab
            key={value}
            icon={icon ? icon : <QuestionMark />}
            value={value}
          />)}
        </Tabs>
      </Box>

      {children}
    </div>
  );
};

export const AppRouter = () => {
  return <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>;
};
