import { IPC_EXPOSURE_PROPERTY_NAME } from "../../../ipc/constants";

type IpcExposurePropertyName = typeof IPC_EXPOSURE_PROPERTY_NAME;

export type UseIpcProps = Window[IpcExposurePropertyName];
