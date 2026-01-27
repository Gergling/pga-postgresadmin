import { useTheme } from "@gergling/ui-components";
import { CSSProperties, Typography } from "@mui/material";
import { PropsWithChildren } from "react";
import { NeonBloodIcon, NeonPlasmaGlowConfigNames, SizeName } from "../config/neon";

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

const galleryGroups = ['councillor', 'tasks', 'navigation', 'other'] as const;
export type GalleryGroup = typeof galleryGroups[number];
export type GalleryItemProps<T extends string> = { Component: NeonBloodIcon; label: T; };
export type GalleryProps<T extends string> = Record<GalleryGroup, GalleryItemProps<T>[]>;

const defaultColour: NeonPlasmaGlowConfigNames = 'blood';
const defaultSize: SizeName = 'large';

export const Gallery = <T extends string,>({
  items, selected
}: {
  items: GalleryProps<T>;
  selected: string;
}) => {
  const allItems = Object.keys(items).reduce((acc, key) => ([ ...acc, ...items[key as GalleryGroup]]), []);
  const selectedItem = allItems.find(({ label }) => label === selected);
  const { theme: { colors: { primary } } } = useTheme();

  if (!selectedItem) {
    throw new Error(`No component found for label: ${selected}`);
  }

  const { Component: SelectedComponent } = selectedItem;

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <GalleryItem zoom={'500%'}><SelectedComponent size={defaultSize} /></GalleryItem>
        <div>
          <GalleryItem zoom={'300%'}><SelectedComponent size={defaultSize} /></GalleryItem>
          <div style={{ display: 'flex' }}>
            <GalleryItem zoom={'200%'}><SelectedComponent size={defaultSize} /></GalleryItem>
            <div>
              <GalleryItem zoom={'100%'}><SelectedComponent size={defaultSize} /></GalleryItem>
              <div style={{ display: 'flex' }}>
                <GalleryItem><SelectedComponent size={'medium'} /></GalleryItem>
                <GalleryItem><SelectedComponent size={'small'} /></GalleryItem>
              </div>
            </div>
          </div>
        </div>
      </div>

      {galleryGroups.map((groupName) => <div key={groupName}>
        <Typography variant="h6" sx={{
          textShadow: `0 0 5px ${primary.main}`,
          color: primary.main,
          textTransform: 'uppercase',
        }}>{groupName}</Typography>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {items[groupName].map(({ Component, label }, key) => <GalleryItem
            key={key}
            label={label}
            selected={label === selected}
          >
            <Component color={defaultColour} size={defaultSize} />
            <div style={{ display: 'flex' }}>
              <Component color={defaultColour} size={'medium'} />
              <Component color={defaultColour} size={'small'} />
            </div>
            {groupName === 'councillor' && <>
              <Component size={defaultSize} />
              <div style={{ display: 'flex' }}>
                <Component size={'medium'} />
                <Component size={'small'} />
              </div>
            </>}
          </GalleryItem>)}
        </div>
      </div>)}
    </div>
  );
};
