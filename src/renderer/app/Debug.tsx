import { useTheme } from "@gergling/ui-components";
import { PropsWithChildren } from "react";

export const Debug = ({ children }: PropsWithChildren) => {
  const { theme: { colors: { info } } } = useTheme();
  return (
    <div style={{ backgroundColor: info.main, color: info.on, paddingLeft: '5px', }}>
      {children}
    </div>
  );
};
