// types.ts
export interface RequestContext {
  operationId: number;       // Encoded string mapping (e.g., 1 = 'json-parse', 2 = 'summarize')
  payloadLength: number;     // Size of the text/data being sent to the LLM
  isOnline: number;          // 1 for true, 0 for false
  userTier: number;          // 0 = free, 1 = premium (to manage costs)
  schemaComplexity: number;  // Number of fields expected in the JSON response
}

export interface TrainingInstance {
  features: number[];        // [operationId, payloadLength, isOnline, userTier, schemaComplexity]
  label: number;             // The encoded best-performing model ID (e.g., 0 = flash, 1 = pro)
}


// ml-router-worker.ts
import { parentPort, workerData } from 'worker_threads';
import { RandomForestClassifier } from 'ml-random-forest';
// import { TelemetryLog } from './types'; // Your historical log format

// 1. Helper maps to turn strings into numbers for the classifier
const operationMap: Record<string, number> = { 'parse-json': 0, 'summarize': 1, 'agent-react': 2 };
const modelMap: Record<string, number> = { 'gemini-2.5-flash-lite': 0, 'gemini-2.5-flash': 1, 'gemini-2.5-pro': 2 };

function trainModel(logs: TelemetryLog[]) {
  const trainingData: number[][] = [];
  const labels: number[] = [];

  // Filter for successful runs to learn what actually worked well
  const successfulRuns = logs.filter(log => log.status === 'success');

  for (const log of successfulRuns) {
    // 2. Extract features out of your telemetry metadata
    const features = [
      operationMap[log.operationName] ?? 99,
      log.payloadLength,
      log.isOnline ? 1 : 0,
      log.isPremiumUser ? 1 : 0,
      log.schemaFieldCount
    ];

    trainingData.push(features);
    labels.push(modelMap[log.config.modelName]);
  }

  if (trainingData.length === 0) return null;

  // 3. Train the local Random Forest Classifier
  const options = {
    seed: 42,
    maxFeatures: 0.8,
    nEstimators: 25, // Number of trees (keeps file size small and execution fast)
    treeOptions: { maxDepth: 10 }
  };

  const classifier = new RandomForestClassifier(options);
  classifier.train(trainingData, labels);

  // 4. Export the trained model state to pure JSON
  return classifier.toJSON();
}

const trainedModelJson = trainModel(workerData.logs);
parentPort?.postMessage(trainedModelJson);



// router-orchestrator.ts (Main Process)
// import { RandomForestClassifier } from 'ml-random-forest';
// import { RequestContext } from './types';

export class MLOrchestrator {
  private classifier: RandomForestClassifier | null = null;
  private modelReverseMap = ['gemini-2.5-flash-lite', 'gemini-2.5-flash', 'gemini-2.5-pro'];

  public loadTrainedModel(modelJson: any) {
    // Rehydrate the model instantly from the JSON produced by the worker thread
    this.classifier = RandomForestClassifier.load(modelJson);
  }

  /**
   * Evaluates the multi-variable environment and returns the optimal model string
   */
  public predictBestModel(context: RequestContext, fallbackModel: string): string {
    if (!this.classifier) return fallbackModel;

    const inputFeatures = [
      context.operationId,
      context.payloadLength,
      context.isOnline,
      context.userTier,
      context.schemaComplexity
    ];

    // Predict returns the encoded model index (e.g., 1)
    const predictedIndex = this.classifier.predict([inputFeatures])[0];
    
    return this.modelReverseMap[predictedIndex] ?? fallbackModel;
  }
}
