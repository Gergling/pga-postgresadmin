import { useMemo } from "react";
// import { Mandatory } from "../../../../shared/types";
import { useDiary } from "../context";
// import { DiaryEntryUi } from "../types";
import { CyberPanel, RectangularBracketContainer, StyledBody, StyledButton, StyledControls, StyledDiaryEntryItem, StyledDiaryEntryItemContainer, StyledStatus } from "./DiaryEntryItem.style";
import { DiaryEntryUi } from "@/shared/features/diary";

export const DiaryEntryItem = ({
  entry: { data: { status, text }, id }
}: { entry: DiaryEntryUi; }) => {
  const { commitDiaryEntry, rejectDiaryEntry } = useDiary();

  const isLocked = useMemo(
    () => status === 'processing' || status === 'processed',
    [status]
  );
  const statusLabel = useMemo(
    () => status ? status.toUpperCase() : 'SAVING',
    [status]
  );

  // Text on the left
  // Status and controls on the right
  return (
    <StyledDiaryEntryItemContainer>
      <RectangularBracketContainer color="#d40000">
        <StyledDiaryEntryItem status={status}>
          
          <StyledBody>{text}</StyledBody>
          <CyberPanel status={status || ''} />

          <StyledControls>
            <StyledStatus>{statusLabel}</StyledStatus>
            {!isLocked && (
              <>
                <StyledButton onClick={() => commitDiaryEntry(id)}>
                  Commit
                </StyledButton>
                
                <StyledButton onClick={() => rejectDiaryEntry(id)} className="danger">
                  Reject
                </StyledButton>
              </>
            )}
          </StyledControls>

          {status === 'processing' && <small>The Librarian is sifting...</small>}
        </StyledDiaryEntryItem>
      </RectangularBracketContainer>
    </StyledDiaryEntryItemContainer>
  );
};
