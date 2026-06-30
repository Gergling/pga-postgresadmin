import { parentPort } from 'worker_threads';

let dbConnectionActive = true; 

parentPort.on('message', () => {
  // Perform your logic here
  const status = dbConnectionActive ? 'connected' : 'disconnected';
  parentPort.postMessage(status);
});
