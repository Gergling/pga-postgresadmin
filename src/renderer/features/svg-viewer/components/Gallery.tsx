import { CSSProperties } from "@mui/material";
import { Librarian, ProposedTasks, Sceptic } from "./svgs";

const galleryMap = {
  'Librarian': Librarian,
  'Proposed Tasks': ProposedTasks,
  'Sceptic': Sceptic,
};

type Key = keyof typeof galleryMap;

export const GalleryItem = ({
  isItemMode = false,
  label,
  zoom = '100%',
}: {
  isItemMode?: boolean;
  label: Key;
  zoom?: CSSProperties['zoom'];
}) => {
  const Component = galleryMap[label];
  return <div>
    {isItemMode && label}
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
        <Component />
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

export const Gallery = ({ label }: { label: Key; }) => <div>
  <div style={{ display: 'flex' }}>
    <div style={{ zoom: '500%' }}><GalleryItem label={label} /></div>
    <div>
      <div style={{ zoom: '300%' }}><GalleryItem label={label} /></div>
      <div style={{ display: 'flex' }}>
        <div style={{ zoom: '200%' }}><GalleryItem label={label} /></div>
        <div style={{ zoom: '100%' }}><GalleryItem label={label} /></div>
      </div>
    </div>
  </div>

  {Object.keys(galleryMap).map(key => <GalleryItem key={key} label={key as Key} isItemMode />)}
</div>;
