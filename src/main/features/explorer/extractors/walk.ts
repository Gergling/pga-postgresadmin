import { dirname, resolve } from 'path';
import { DirentSummary } from '../../../../shared/features/explorer/types';
import { listContents } from './hierarchy';

interface DirectorySnapshot {
  currentPath: string;
  children: DirentSummary[]; // Using the interface from your Extractor
}

/**
 * A Walker/Orchestrator that climbs up to the root directory,
 * yielding the contents of each level.
 */
export async function* walkUpwardsToRoot(startPath: string): AsyncGenerator<DirectorySnapshot> {
  let current = resolve(startPath);
  let previous = '';

  // Windows roots stop changing when you call dirname() on them (e.g., dirname('C:\\') === 'C:\\')
  while (current !== previous) {
    const children = await listContents(current); // Your Extractor
    
    yield {
      currentPath: current,
      children
    };

    previous = current;
    current = dirname(current); // Safely moves up one level (equivalent to '../')
  }
}
