import { InputContainer, RitualLabel } from "./DiaryEntryInput.style";
import { DiaryTaskProcessingProgress } from "./ProcessingProgress";
// import { RectangularBracket } from "./DiaryEntryItem.style";
import { DiaryEntryInputText } from "./EntryInputText";

export const DiaryEntryInput = () => {
  return (
    <InputContainer style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
      <div style={{ width: '100%', margin: '10px 0' }}>
        <RitualLabel>[ Offering / Venting ]</RitualLabel>
        <DiaryEntryInputText />
      </div>
      {/* <RectangularBracket color="#d40000" position='right' style={{ marginLeft: '20px' }} />
      <RectangularBracket color="#d40000" position='left' style={{ marginRight: '20px' }} /> */}
      <DiaryTaskProcessingProgress />
      {/* <InputGlow /> */}
    </InputContainer>
  );
};
