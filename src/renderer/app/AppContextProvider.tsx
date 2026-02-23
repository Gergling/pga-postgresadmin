import { PropsWithChildren } from "react";
import { AppThemeProvider } from '@gergling/ui-components';
import { IpcContextProvider } from "../shared/ipc/Provider";
import { NestedProviders } from "../shared/common/components/NestedProviders";
import { NavigationProvider } from "../shared/navigation";
import { AppLocalisationProvider } from "../libs/mui";
import { AppQueryProvider } from "../libs/react-query";
import { DiaryProvider } from "../features/diary";

export const AppContextProvider = ({ children }: PropsWithChildren) => {
  return (
    <NestedProviders components={[
      IpcContextProvider,
      AppQueryProvider,
      AppThemeProvider,
      AppLocalisationProvider,
      DiaryProvider,
      NavigationProvider,
    ]}>
      {children}
    </NestedProviders>
  );
};
