import { PropsWithChildren } from "react";
import { AppThemeProvider } from '@gergling/ui-components';
import { IpcContextProvider } from "../shared/ipc/Provider";
import { NestedProviders } from "../shared/common/components/NestedProviders";

export const AppContextProvider = ({ children }: PropsWithChildren) => {
  return (
    <NestedProviders components={[
      AppThemeProvider,
      IpcContextProvider,
    ]}>
      {children}
    </NestedProviders>
  );
};
