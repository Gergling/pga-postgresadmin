import { useTheme } from "@gergling/ui-components";
import { CSSProperties, Typography } from "@mui/material";
import { PropsWithChildren, ReactNode } from "react";

export const GalleryItem = ({
  children,
  label,
  zoom = '100%',
}: PropsWithChildren & {
  label?: string;
  zoom?: CSSProperties['zoom'];
}) => {
  const { theme: { colors: { primary } } } = useTheme();
  return <div>
    <Typography variant="body2" style={{
      textAlign: 'center',
      textShadow: `0 0 20px #900`,
      color: primary.main
    }}>{label}</Typography>

    <div style={{ display: 'flex', zoom }}>
      <div style={{
        backgroundImage: `
          linear-gradient(45deg, #300 25%, transparent 25%),
          linear-gradient(-45deg, #300 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #300 75%),
          linear-gradient(-45deg, transparent 75%, #300 75%)
        `,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
      }}>
        {children}
      </div>
      {/* <div style={{
        backgroundColor: '#eee', // Fallback
        backgroundImage: `
          linear-gradient(45deg, #ccc 25%, transparent 25%),
          linear-gradient(-45deg, #ccc 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #ccc 75%),
          linear-gradient(-45deg, transparent 75%, #ccc 75%)
        `,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
      }}>
        <Component />
      </div> */}
    </div>
  </div>;
}

export const Gallery = ({
  items, selected
}: {
  items: { Component: () => ReactNode; label: string; }[];
  selected: string;
}) => {
  const selectedItem = items.find(({ label }) => label === selected);

  if (!selectedItem) {
    throw new Error(`No component found for label: ${selected}`);
  }

  const { Component: SelectedComponent } = selectedItem;

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <GalleryItem zoom={'500%'}><SelectedComponent /></GalleryItem>
        <div>
          <GalleryItem zoom={'300%'}><SelectedComponent /></GalleryItem>
          <div style={{ display: 'flex' }}>
            <GalleryItem zoom={'200%'}><SelectedComponent /></GalleryItem>
            <GalleryItem zoom={'100%'}><SelectedComponent /></GalleryItem>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        {items.map(({ Component, label }, key) => <GalleryItem key={key} label={label}><Component /></GalleryItem>)}
      </div>
    </div>
  );
};
