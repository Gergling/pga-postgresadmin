import { useDiary } from "../context";
import { VentingArea } from "./DiaryEntryInput.style";

export const DiaryEntryInputText = () => {
  const {
    createDraftDiaryEntry,
    entryInput: { text, setText }
  } = useDiary();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  const handleSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey && text.trim()) {
      createDraftDiaryEntry(text);
      setText('');
    }
  };

  return (
    <VentingArea 
      onChange={handleChange}
      onKeyDown={handleSubmit}
      placeholder="Inscribe your thoughts..."
      spellCheck={false}
      value={text}
    />
  );
};
