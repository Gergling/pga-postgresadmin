import task from 'tasuku';
import { initializeFirebase } from "@/main/libs/firebase";

export const initialise = async () => {
  await task(
    'Initialising application', ({ task }) => initializeFirebase(task)
  );
};
