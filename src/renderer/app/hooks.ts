import { useTheme } from "@gergling/ui-components";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useApp = () => {
  const { pathname } = useLocation();
  const [selectedRoute, setSelectedRoute] = useState('/');
  const navigate = useNavigate();
  const { setTheme } = useTheme();

  useEffect(() => {
    navigate(selectedRoute);
  }, [navigate, selectedRoute]);

  useEffect(() => {
    setTheme({ mode: 'dark', project: 'gds' });
  }, [setTheme]);

  return {
    pathname,
    selectedRoute,
    setSelectedRoute,
  };
};
