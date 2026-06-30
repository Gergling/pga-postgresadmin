import { ETLPayload, workerETLTransformers } from "./config";

console.log('TODO: Evaluate whether parentPort is going to be undefined')
process.parentPort.on('message', (e: { data: ETLPayload }) => {
  const { type, docId, rawData } = e.data;

  try {
    // Execute CPU-Bound task (The "Heavy Transformation")
    const transformFn = workerETLTransformers[type];
    const result = transformFn(rawData);

    process.parentPort.postMessage({ status: 'SUCCESS', docId, result });
  } catch (err) {
    process.parentPort.postMessage({ status: 'ERROR', docId, error: err });
  } finally {
    process.exit(0); // Terminate to free resources
  }
});
