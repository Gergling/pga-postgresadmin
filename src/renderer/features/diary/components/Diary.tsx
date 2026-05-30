import styled from '@emotion/styled';
import { useDiary } from '../context';
import { DiaryEntryItem } from './DiaryEntryItem';
import { DiaryEntryInput } from './DiaryEntryInput';
import { Slab } from '@/renderer/shared/base';
import { ProgressBar } from '@/renderer/shared/progress-bar';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const DiaryList = () => {
  const {
    isRecentDiaryEntriesLoading,
    isRecentDiaryEntriesError,
    recentDiaryEntries,
    recentDiaryEntriesError,
  } = useDiary();

  // TODO: Could do with a nicer loading output.
  if (isRecentDiaryEntriesLoading) return <ProgressBar />;

  if (isRecentDiaryEntriesError) return <Slab showScanLines>
    {recentDiaryEntriesError?.message}
  </Slab>;

  if (recentDiaryEntries.length === 0) return <Slab showScanLines>
    No entries yet.
  </Slab>;

  return recentDiaryEntries.map(entry => (
    <DiaryEntryItem key={entry.id} entry={entry} />
  ));
};

const DiaryInterface = () => {
  return (
    <Container>
      <section>
        <DiaryEntryInput />
      </section>

      <section>
        <DiaryList />
      </section>
    </Container>
  );
};

export const Diary = () => <DiaryInterface />;
