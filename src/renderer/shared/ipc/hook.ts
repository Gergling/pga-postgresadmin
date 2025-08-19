import { useContext } from "react";
import { IPC_EXPOSURE_PROPERTY_NAME } from "../../../ipc/constants";
import { IpcContext } from "./context";

export const useIpc = () => {
  try {
    const context = useContext(IpcContext);
    const ipc = context[IPC_EXPOSURE_PROPERTY_NAME];
    return ipc;
  } catch (error) {
    const msg = "Error accessing IPC context. Check the source code to ensure this hook is called within the context.";
    console.error(msg, error);
    throw [msg, error].join(" ");
  }
};

