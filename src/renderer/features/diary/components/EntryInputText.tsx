import { useDiary } from "../context";
import { VentingArea } from "./DiaryEntryInput.style";

export const DiaryEntryInputText = () => {
  const {
    create,
    text,
    setText,
  } = useDiary();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  const handleSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey && text.trim()) {
      create();
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
