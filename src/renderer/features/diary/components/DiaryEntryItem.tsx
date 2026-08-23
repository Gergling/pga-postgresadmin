import { useMemo } from "react";
import { DiaryEntryRich } from "@/shared/features/diary";
import {
  ParentheticalContainer,
  ParentheticalGrid
} from "@/renderer/shared/brackets";
import { RelativeTime } from "@/renderer/shared/common";
import {
  CyberPanel,
  StyledBody,
  StyledButton,
  StyledControls,
  StyledDiaryEntryItem,
  StyledDiaryEntryItemContainer,
  StyledStatus
} from "./DiaryEntryItem.style";
import { useDiary } from "../context";

export const DiaryEntryItem = ({
  entry
}: { entry: DiaryEntryRich; }) => {
  const { created, data: { status, text }, id } = entry;
  const { commitDiaryEntry } = useDiary();

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
      <ParentheticalContainer roundness={0}>
        <ParentheticalGrid styleOverrides={{
          item: {
            size: { md: 3 }
          }
        }}>
          <RelativeTime time={created} />
          <StyledStatus>{statusLabel}</StyledStatus>
        </ParentheticalGrid>
        <StyledDiaryEntryItem status={status}>

          <StyledBody>{text}</StyledBody>
          <CyberPanel status={status || ''} />

          <StyledControls>
            {!isLocked && (
              <>
                <StyledButton onClick={() => commitDiaryEntry(entry)}>
                  Commit
                </StyledButton>

                <StyledButton>
                  <s>
                    Reject
                  </s>
                </StyledButton>
              </>
            )}
          </StyledControls>

          {status === 'processing' && <small>The Librarian is sifting...</small>}
        </StyledDiaryEntryItem>
      </ParentheticalContainer>
    </StyledDiaryEntryItemContainer>
  );
};
