import { createCrudConfig } from "../../ipc/utilities";
import { fetchActiveApplications } from "./crud";

export const jobSearchIpc = createCrudConfig({
  read: {
    activeApplications: fetchActiveApplications,
  },
});
