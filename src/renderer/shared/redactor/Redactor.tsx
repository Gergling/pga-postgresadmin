import { PropsWithChildren, useMemo, useState } from "react";
import { useRedactor } from "./context";
import { showRedactedContent } from "./utilities";
import { StyledRedactor } from "./Redactor.style";


export const Redactor = ({ children }: PropsWithChildren) => {
  const { isRedacted } = useRedactor();
  const [isDeclassified, setIsDeclassified] = useState(false);
  const showContent = useMemo(
    () => showRedactedContent({ isDeclassified, isRedacted }),
    [isRedacted, isDeclassified]
  );

  const handleToggleRedaction = () => setIsDeclassified(!isDeclassified);

  if (showContent) return children;
  return <StyledRedactor
    onClick={handleToggleRedaction}
    style={{ height: 'auto' }}
  >{children}</StyledRedactor>;
};
