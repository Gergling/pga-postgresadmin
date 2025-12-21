import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DatabasesView } from "../views";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/databases/*" element={<DatabasesView />} />
        <Route path="/*" element={<DatabasesView />} />
      </Routes>
    </BrowserRouter>
  );
};
