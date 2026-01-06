// TODO: I don't think this is being used.
import { Outlet as BaseOutlet } from "react-router-dom";

export const Outlet = () => {
  console.log('outlet')
  return (
    <BaseOutlet />
  );
};
