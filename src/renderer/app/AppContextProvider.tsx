import { PropsWithChildren } from "react";
import { IpcContextProvider } from "../shared/ipc/Provider";
import { NestedProviders } from "../shared/common/components/NestedProviders";
import { RedactorProvider } from "../shared/redactor";
import { AppThemeOverrideProvider } from "../shared/theme";
import { AppLocalisationProvider } from "../libs/mui";
import { AppQueryProvider } from "../libs/react-query";
import { DiaryProvider } from "../features/diary";
import { NavigationProvider } from "../views/NavigationProvider";

export const AppContextProvider = ({ children }: PropsWithChildren) => {
  return (
    <NestedProviders components={[
      IpcContextProvider,
      AppQueryProvider,
      AppThemeOverrideProvider,
      AppLocalisationProvider,
      RedactorProvider,
      DiaryProvider,
      NavigationProvider,
    ]}>
      {children}
    </NestedProviders>
  );
};
