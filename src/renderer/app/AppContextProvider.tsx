import { PropsWithChildren } from "react";
import { IpcContextProvider } from "../shared/ipc/Provider";
import { NestedProviders } from "../shared/common/components/NestedProviders";
import { NavigationProvider } from "../shared/navigation";
import { AppLocalisationProvider } from "../libs/mui";
import { AppQueryProvider } from "../libs/react-query";
import { DiaryProvider } from "../features/diary";
import { AppThemeOverrideProvider } from "../shared/theme";

export const AppContextProvider = ({ children }: PropsWithChildren) => {
  return (
    <NestedProviders components={[
      IpcContextProvider,
      AppQueryProvider,
      AppThemeOverrideProvider,
      AppLocalisationProvider,
      DiaryProvider,
      NavigationProvider,
    ]}>
      {children}
    </NestedProviders>
  );
};
