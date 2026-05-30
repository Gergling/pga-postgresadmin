import styled from '@emotion/styled';
import { useDiary } from '../context';
import { DiaryEntryItem } from './DiaryEntryItem';
import { DiaryEntryInput } from './DiaryEntryInput';
import { Slab } from '@/renderer/shared/base';
import { Skeleton } from '@mui/material';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const DiaryInterface = () => {
  const { diaryEntries, drawer } = useDiary();

  // TODO: Should show when mutations and reloading are happening.
  return (
    <Container>
      <section>
        <DiaryEntryInput />
      </section>

      <section>
        {false && <Skeleton variant={'rectangular'}>Loading...</Skeleton>}
        {diaryEntries.length > 0
          ? diaryEntries.map(entry => (
            <DiaryEntryItem key={entry.id} entry={entry} />
          ))
          : <Slab>No entries yet.</Slab>
        }
      </section>
    </Container>
  );
};

export const Diary = () => <DiaryInterface />;
