import styled from '@emotion/styled';
import { useDiary } from '../context';
import { DiaryEntryItem } from './DiaryEntryItem';
import { DiaryEntryInput } from './DiaryEntryInput';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const DiaryInterface = () => {
  const { diaryEntries } = useDiary();

  // TODO: Should show when mutations and reloading are happening.
  return (
    <Container>
      <section>
        <DiaryEntryInput />
      </section>

      <section>
        {diaryEntries.map(entry => (
          <DiaryEntryItem key={entry.id} entry={entry} />
        ))}
      </section>
    </Container>
  );
};

export const Diary = () => <DiaryInterface />;
