import React, { useState } from 'react';
import styled from '@emotion/styled';
import { DiaryProvider, useDiary } from '../context';
import { DiaryTaskProcessingProgress } from './ProcessingProgress';

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const VentBox = styled.textarea`
  width: 100%;
  height: 100px;
  background: #252525;
  color: #efefef;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 15px;
  font-family: inherit;
  resize: vertical;
  &:focus { outline: 1px solid #c53030; border-color: #c53030; }
`;

const EntryCard = styled.div`
  background: #1e1e1e;
  border-left: 4px solid #555;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 10px;
  
  .time { font-size: 0.7rem; color: #888; margin-bottom: 5px; }
  .text { font-size: 0.95rem; color: #888; line-height: 1.5; }
`;

const DiaryInterface = () => {
  const [input, setInput] = useState('');
  const {
    createDraftDiaryEntry,
    diaryEntries,
  } = useDiary();

  const handleSubmit = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey && input.trim()) {
      createDraftDiaryEntry(input);
      setInput('');
    }
  };

  // TODO: Should show when mutations and reloading are happening.
  return (
    <Container>
      <section>
        <h3>Pressure Valve (Ctrl+Enter to commit)</h3>
        <VentBox 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleSubmit}
          placeholder="What's causing friction right now? Vent here..."
        />
      </section>

      <section>
        <h3>Recent Telemetry</h3>
        <DiaryTaskProcessingProgress />
        {diaryEntries.map(entry => (
          <EntryCard key={entry.id}>
            <div className="time">{entry.created.toLocaleString()}</div>
            <div className="text">{entry.text}</div>
          </EntryCard>
        ))}
      </section>
    </Container>
  );
};

export const Diary = () => <DiaryProvider><DiaryInterface /></DiaryProvider>;
