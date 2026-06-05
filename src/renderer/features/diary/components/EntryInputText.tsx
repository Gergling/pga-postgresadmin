import { useDiary } from "../context";
import { VentingArea } from "./DiaryEntryInput.style";

export const DiaryEntryInputText = () => {
  const {
    handleCreateDiaryEntry,
    text,
    setText,
  } = useDiary();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  const handleSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey && text.trim()) {
      handleCreateDiaryEntry();
    }
  };

  return (
    <VentingArea 
      onChange={handleChange}
      onKeyDown={handleSubmit}
      placeholder="Enter your thoughts..."
      spellCheck={false}
      value={text}
    />
  );
};
