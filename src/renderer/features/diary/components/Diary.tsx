import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Temporal } from '@js-temporal/polyfill';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot 
} from 'firebase/firestore';
import { DiaryEntryDb } from '../../../../shared/features/diary/types';
import { firebasedDb } from '../../../libs/firebase/config';
import { mapDiaryEntryDbToUi, mapDiaryEntryUiToDb } from '../utilities';
import { DiaryEntryUi } from '../types';

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

export const DiaryInterface = () => {
  const [entries, setEntries] = useState<DiaryEntryUi[]>([]);
  const [input, setInput] = useState('');

  // 1. Listen for entries (Real-time)
  useEffect(() => {
    const q = query(
      collection(firebasedDb, "diary_entries"), 
      orderBy("created", "desc"),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      const data = snapshot.docs.map(doc => mapDiaryEntryDbToUi({
        id: doc.id,
        ...doc.data()
      } as DiaryEntryDb));
      setEntries(data);
    });

    return () => unsubscribe();
  }, []);

  // 2. Submit new vent
  const handleSubmit = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey && input.trim()) {
      try {
        await addDoc(collection(firebasedDb, "diary_entries"), mapDiaryEntryUiToDb({
          text: input,
          created: Temporal.Now.instant(),
          status: 'draft',
        }));
        setInput(''); // Clear on success
      } catch (err) {
        console.error("Failed to vent:", err);
      }
    }
  };

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
        {entries.map(entry => (
          <EntryCard key={entry.id}>
            <div className="time">{new Date(entry.created.toString()).toLocaleString()}</div>
            <div className="text">{entry.text}</div>
          </EntryCard>
        ))}
      </section>
    </Container>
  );
};
