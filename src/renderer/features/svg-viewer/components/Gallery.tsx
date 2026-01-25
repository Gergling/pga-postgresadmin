import { useTheme } from "@gergling/ui-components";
import { CSSProperties, Typography } from "@mui/material";
import { PropsWithChildren, ReactNode } from "react";

export const GalleryItem = ({
  children,
  label,
  selected = false,
  zoom = '100%',
}: PropsWithChildren & {
  label?: string;
  selected?: boolean;
  zoom?: CSSProperties['zoom'];
}) => {
  const { theme: { colors: { primary } } } = useTheme();
  return <div>
    <div style={{
      backgroundImage: `
        linear-gradient(45deg, #300 25%, transparent 25%),
        linear-gradient(-45deg, #300 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #300 75%),
        linear-gradient(-45deg, transparent 75%, #300 75%)
      `,
      backgroundSize: '20px 20px',
      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
      borderColor: selected ? '#ffcc00' : 'transparent',
      borderStyle: 'solid',
      borderWidth: '1px',
      zoom
    }}>
      {children}
    </div>
    <Typography variant="body2" style={{
      textAlign: 'center',
      textShadow: `0 0 20px #900`,
      color: primary.main,
      width: 100,
    }}>{label}</Typography>
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

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {items.map(({ Component, label }, key) => <GalleryItem key={key} label={label} selected={label === selected}><Component /></GalleryItem>)}
      </div>
    </div>
  );
};
