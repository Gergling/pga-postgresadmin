import { PropsWithChildren } from "react";
import { AppThemeProvider } from '@gergling/ui-components';
import { IpcContextProvider } from "../shared/ipc/Provider";
import { NestedProviders } from "../shared/common/components/NestedProviders";
import { NavigationProvider } from "../shared/navigation";

export const AppContextProvider = ({ children }: PropsWithChildren) => {
  return (
    <NestedProviders components={[
      IpcContextProvider,
      AppThemeProvider,
      NavigationProvider
    ]}>
      {children}
    </NestedProviders>
  );
};
