import { PropsWithChildren } from "react";
import { AppThemeProvider } from '@gergling/ui-components';
import { IpcContextProvider } from "../shared/ipc/Provider";
import { NestedProviders } from "../shared/common/components/NestedProviders";
import { NavigationProvider } from "../shared/navigation";
import { AppQueryProvider } from "../libs/react-query";

export const AppContextProvider = ({ children }: PropsWithChildren) => {
  return (
    <NestedProviders components={[
      IpcContextProvider,
      AppQueryProvider,
      AppThemeProvider,
      NavigationProvider
    ]}>
      {children}
    </NestedProviders>
  );
};
