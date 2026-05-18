// TODO: Probably needs importing from the initialise function.
import { ipcMain, utilityProcess } from 'electron';
import path from 'path';
import { ETLPayload } from '@/workers';

ipcMain.handle('run-etl-pipeline', async (_, payload: ETLPayload) => {
  // 1. Initial I/O: Set status to 'processing'
  // await db.collection('tasks').doc(payload.docId).update({ status: 'processing' });

  // 2. Offloading: Fork the background worker
  const worker = utilityProcess.fork(path.join(__dirname, '../workers/etl.js'));
  
  worker.postMessage(payload);

  worker.on('message', async (response) => {
    if (response.status === 'SUCCESS') {
      // 3. Final I/O: Load transformed data
      // await db.collection('tasks').doc(response.docId).update({ result: response.result, status: 'done' });
      console.log("ETL Pipeline Complete");
    }
  });
});
