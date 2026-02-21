import { useMemo } from "react";
import { Mandatory } from "../../../../shared/types";
import { useDiary } from "../context";
import { DiaryEntryUi } from "../types";
import { CyberPanel, RectangularBracketContainer, StyledBody, StyledButton, StyledControls, StyledDiaryEntryItem, StyledDiaryEntryItemContainer, StyledStatus } from "./DiaryEntryItem.style";

export const DiaryEntryItem = ({ entry }: { entry: DiaryEntryUi | Mandatory<DiaryEntryUi, "created" | "id">; }) => {
  const { commitDiaryEntry, rejectDiaryEntry } = useDiary();

  const isLocked = useMemo(() => entry.status === 'processing' || entry.status === 'processed', [entry]);
  const statusLabel = useMemo(() => entry.status ? entry.status.toUpperCase() : 'SAVING', [entry]);

  // Text on the left
  // Status and controls on the right
  return (
    <StyledDiaryEntryItemContainer>
      <RectangularBracketContainer color="#d40000">
        <StyledDiaryEntryItem status={entry.status}>
          
          <StyledBody>{entry.text}</StyledBody>
          <CyberPanel status={entry.status || ''} />

          <StyledControls>
            <StyledStatus>{statusLabel}</StyledStatus>
            {!isLocked && (
              <>
                <StyledButton onClick={() => commitDiaryEntry(entry.id)}>
                  Commit
                </StyledButton>
                
                <StyledButton onClick={() => rejectDiaryEntry(entry.id)} className="danger">
                  Reject
                </StyledButton>
              </>
            )}
          </StyledControls>

          {entry.status === 'processing' && <small>The Librarian is sifting...</small>}
        </StyledDiaryEntryItem>
      </RectangularBracketContainer>
    </StyledDiaryEntryItemContainer>
  );
};


// const RuneIcon = ({ seed, color }: { seed: string, color: string }) => {
//   // Use the seed to pick a specific "cyber-glyph"
//   const path = getPathFromSeed(seed); 
  
//   return (
//     <svg viewBox="0 0 100 100" width="24" height="24">
//       <path d={path} stroke={color} fill="none" strokeWidth="2" strokeLinecap="round" />
//     </svg>
//   );
// };
