import { PropsWithChildren } from "react";
import { ErrorBoundary as ErrorBoundaryBase, ErrorBoundaryProps } from "react-error-boundary";

const FallbackWrapper = ({ children }: PropsWithChildren) => <div style={{
  color: 'white', backgroundColor: '#800', fontWeight: 'bold', padding: '10px'
}}>{children}</div>;

export const ErrorBoundary = ({
  children,
  ...props
}: ErrorBoundaryProps) => <ErrorBoundaryBase fallback={<FallbackWrapper>{props.fallback}</FallbackWrapper>}>
  {children}
</ErrorBoundaryBase>;
