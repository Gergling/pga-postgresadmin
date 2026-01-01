import { PropsWithChildren, ReactNode } from "react";

type NestedProvidersProps = {
  components: (({ children }: PropsWithChildren) => React.JSX.Element)[];
  children: ReactNode;
}

export const NestedProviders = ({ components, children }: NestedProvidersProps) => {
  if (components.length > 0) {
    const [Component, ...remainingComponents] = components;
    return (
      <Component>
        <NestedProviders components={remainingComponents}>
          {children}
        </NestedProviders>
      </Component>
    );
  }

  return children;
};
