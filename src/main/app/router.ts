import z from 'zod';
import { EventEmitter } from 'events';
import { tRPC } from '@/main/config';
import {
  cliRouter,
  diaryRouter,
  environmentRouter,
  explorerRouter,
  projectsRouter,
  releaseRouter,
  settingsRouter,
  systemRouter,
} from '@/main/features';

const ee = new EventEmitter();

export const router = tRPC.router({
  cli: cliRouter,
  diary: diaryRouter,
  environments: environmentRouter,
  explorer: explorerRouter,
  projects: projectsRouter,
  release: releaseRouter,
  settings: settingsRouter,
  system: systemRouter,

  greeting: tRPC.procedure.input(z.object({ name: z.string() })).query((req) => {
    const { input } = req;

    ee.emit('greeting', `Greeted ${input.name}`);
    return {
      text: `Hello ${input.name}` as const,
    };
  }),

  // For the renderer to call a worker:
  // runWorker: tRPC.procedure
  //   .input(z.object({ docId: z.string(), rawData: z.string() }))
  //   .mutation(async ({ input }) => {
  //     // 1. I/O Bound: Update Firestore status (async)
  //     await updateFirestore(input.docId, 'processing');

  //     // 2. Offload: This returns a Promise that resolves 
  //     // when the Utility Process sends its message back.
  //     const result = await forkETLWorker(input); 

  //     // 3. I/O Bound: Update Firestore final (async)
  //     await updateFirestore(input.docId, 'completed', result);

  //     return { success: true };
  //   }),
  // Browser fetcher equivalent: Basically doesn't need electron. Standard
  // Browser API.
  // // Standard Web Worker (Native browser API)
  // ctx.addEventListener('message', (event) => {
  //   const { dataToProcess } = event.data;
    
  //   // CPU-Bound Transformation
  //   const result = dataToProcess.map((item: any) => ({
  //     ...item,
  //     processedValue: item.val * Math.random() // Simulating math
  //   }));

  //   ctx.postMessage(result);
  // });

  // const ctx: Worker = self as any;


  // UI looks like:
  // const mutation = trpc.runTransform.useMutation();

  // const handleClick = () => {
  //   mutation.mutate({ docId: '123', rawData: 'heavy data' });
  // };

  // return (
  //   <button onClick={handleClick} disabled={mutation.isLoading}>
  //     {mutation.isLoading ? 'Processing on separate thread...' : 'Start Task'}
  //   </button>
  // );
});


// Main looks like:
// src/main/auto-processor.ts
// import { runWorkerTask } from './worker-launcher';
// import { updateFirestore } from './firebase-admin';

// async function handleNewFileDetected(fileContent: string) {
//   console.log("Main thread initiating background task...");

//   const docId = `auto_${Date.now()}`;

//   // 1. Initial I/O
//   await updateFirestore(docId, { status: 'processing' });

//   try {
//     // 2. Offload (CPU-bound)
//     // Even though we 'await', the Main Thread event loop stays 
//     // open for other window management/IPC tasks.
//     const result = await runWorkerTask({
//       type: 'CLEANSE',
//       docId,
//       rawData: fileContent
//     });

//     // 3. Final I/O
//     await updateFirestore(docId, { status: 'completed', result });
//   } catch (err) {
//     console.error("Main-thread triggered task failed:", err);
//   }
// }
