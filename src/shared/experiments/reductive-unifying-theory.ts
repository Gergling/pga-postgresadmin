/**
 * This is a script intended to loosely serve as an example of how the "root
 * logic" of the universe might translate into its emergent properties.
 * The overall idea is the concept of a universe which starts "simple" and
 * becomes more "complex" over time. This universe is expressed as the `state`
 * variable, and for now, it is simply a number.
 * The universal growth expresses as an increasingly complex number, which takes
 * up an increasing amount of "memory" over time. This simulation takes a `base`
 * as a constant to calculate the memory size.
 * The values used should not be considered in alignment with the real universe.
 * They are set to simple values for the purposes of human-readability. In
 * theory they could be calculated based on the emergent functionality we
 * observe in the real universe.
 * The universe "ticks", in which a reducer-like function runs, updating the
 * universal `state`. Our function simply returns it. The state would be passed
 * back into the function for the next tick.
 * The `state` is updated in a "window". 
 */

type UniverseConfig = {
  /**
   * Each iteration within a tick moves the window along by the base.
   */
  base: number;
  growthConstant: bigint;
  nodeSize: bigint;
  windowSize: bigint;
};

type TickLog = {
  tick: bigint;
  state?: bigint;
  memory?: bigint;
  space?: bigint;
};


/**
 * Creates a universe configuration.
 * @param config 
 */
const universeFactory = (config: UniverseConfig) => {
  const {
    base,
    growthConstant,
    nodeSize,
    windowSize,
  } = config;

  // Logging
  const history: TickLog[] = [];

  const getLogState = (state: bigint) => {
    const memory = getMemory(state);
    const space = getSpaceTotal(memory);
    return { state, memory, space };
  }
  const log = (obj: object) => {
    // Last element in history should be overwritten with last element extended by obj.
    const props = 'state' in obj && typeof obj.state === 'bigint'
      ? getLogState(obj.state)
      : obj
    ;
    history[history.length - 1] = { ...history[history.length - 1], ...props };
  }

  const beforeTick = () => {
    history.push({ tick: BigInt(history.length + 1) });
  }
  const afterTick = () => {
    console.log(`Tick: ${history.length}`, history[history.length - 1]);
  };

  // Decoding
  type WeightedEdge = {
    targetNodeId: string;
    weight: number; // Granular scale: 0 (none), 1 (weak), 2 (medium), 3 (max)
  };

  type NodeMap = {
    id: string;
    rawValue: number;
    connections: WeightedEdge[];
    totalEntanglementBudget: number;
    isDisconnected: boolean;
  };

  // Paste this updated method inside your factory framework
  // const decodeStateToGraph = (state: bigint): NodeMap[] => {
  //   const stateString = state.toString(base);
  //   const totalDigits = stateString.length;
    
  //   const totalNodes = Math.floor(totalDigits / nodeSize);
  //   if (totalNodes === 0) return [];

  //   // Step 1: Unpack individual node states
  //   const nodes = Array.from({ length: totalNodes }, (_, i) => {
  //     const startIdx = i * nodeSize;
  //     const endIdx = startIdx + nodeSize;
  //     const nodeChunkStr = stateString.slice(startIdx, endIdx);
      
  //     // Read the digit stream
  //     const rawValue = parseInt(nodeChunkStr, base);

  //     // 2-BIT SCHEMATIC EXTRACTION
  //     // Split your 4-digit block into a 2-digit Pointer and a 2-digit Weight
  //     const addressDigits = nodeChunkStr.slice(0, 2);
  //     const weightDigits = nodeChunkStr.slice(2, 4);

  //     const targetOffset = parseInt(addressDigits, base) % totalNodes;
  //     // Granular weight calculation (returns 0, 1, 2, or 3 natively)
  //     const entanglementWeight = parseInt(weightDigits, base) % 4; 

  //     const targetIndex = (i + targetOffset) % totalNodes;

  //     return {
  //       id: `Node_${i}`,
  //       rawValue,
  //       primaryTarget: `Node_${targetIndex}`,
  //       primaryWeight: entanglementWeight
  //     };
  //   });

  //   // Step 2: Assemble the Multi-Level Adjacency Matrix
  //   return nodes.map((currentNode) => {
  //     const connections: WeightedEdge[] = [];
  //     let totalEntanglementBudget = 0;

  //     nodes.forEach(otherNode => {
  //       // Collect inbound lines with their granular weights
  //       if (otherNode.primaryTarget === currentNode.id && otherNode.primaryWeight > 0) {
  //         connections.push({ targetNodeId: otherNode.id, weight: otherNode.primaryWeight });
  //         totalEntanglementBudget += otherNode.primaryWeight;
  //       }
  //     });

  //     if (currentNode.primaryWeight > 0) {
  //       connections.push({ targetNodeId: currentNode.primaryTarget, weight: currentNode.primaryWeight });
  //       totalEntanglementBudget += currentNode.primaryWeight;
  //     }

  //     return {
  //       id: currentNode.id,
  //       rawValue: currentNode.rawValue,
  //       connections,
  //       totalEntanglementBudget,
  //       isDisconnected: totalEntanglementBudget === 0
  //     };
  //   });
  // };


  // Meta-logic
  const getMemory = (state: bigint): bigint => BigInt(state.toString(base).length);
  const getSpaceTotal = (memory: bigint) => Number(memory - windowSize);
  // Note: We *can* calculate the memory based on the state if we want to, but
  // since we have already done that and we don't want to be rerunning
  // unnecessary operations, we pass it in instead.
  const getWindowContent = (state: bigint, iteration: number, memory: bigint) => {
    let windowValue = 0n;
    for (let w = 0n; w < windowSize; w++) {
      const targetIndex = (BigInt(iteration) + w) % memory;
      // Slice out a single discrete digit at the target index position
      const digit = (state / (BigInt(base) ** targetIndex)) % BigInt(base);
      windowValue += digit * (BigInt(base) ** w);
    }
    return windowValue;
    // const shiftedState = state / BigInt(base ** iteration);
    // const windowValue = shiftedState % (BigInt(base) ** windowSize);
    // return windowValue;
  }

  // Actual root logic.
  const complexify = (state: bigint) => {
    // This is a massively oversimplified complexifier.
    // It *should*(?) fulfil the requirement of exponentially expanding the memory
    // space used.
    return (state * growthConstant);
  }

  // Entry functions.
  const tick = (state: bigint) => {
    beforeTick();

    /**
     * While this rule survives, the initial state cannot be 0.
     */
    const memory = getMemory(state);
    const totalIterations = getSpaceTotal(memory);

    // Double-buffered version:
    const { updatedState } = Array.from({ length: totalIterations + 1 }, (_, i) => {
      // First we process the state in multiple windows.
      const windowValue = getWindowContent(state, i, memory);
      // Each of these outputs is considered to be a "layer".
      const complexifiedLayer = complexify(windowValue);
      return complexifiedLayer;
    }).reduce((acc, layer) => {
      // The layers are added together based on a calculated offset, which TBH
      // I probably need a diagram for, but ultimately the layers should be
      // essentially "squashed" into a new state.
      const updatedState = acc.updatedState + (layer * (BigInt(base) ** acc.bufferShiftOffset));
      const bufferShiftOffset = acc.bufferShiftOffset + getMemory(layer);
      return { bufferShiftOffset, updatedState };
    }, {
      bufferShiftOffset: 0n,
      updatedState: 0n,
    });

    log({ state: updatedState });

    afterTick();
    return updatedState;
  };

  const run = (state: bigint): TickLog[] => {
    const memory = getMemory(state);
    const space = memory - windowSize;

    console.log('Running configuration', config);
    console.log('Initial values:', {
      memory,
      space,
      state,
    });

    Array.from({ length: 5 }).reduce(tick, state);

    return [{ tick: 0n, memory, space, state }, ...history];
  };

  return {
    run,
  }
};

// The biggest number that can fit in the window will be base ^ windowSize.

type RuleSet = Record<string, (
  tickLog: TickLog, props: {
    allTicks: TickLog[];
    previousTick?: TickLog;
    tickNumber: number;
  }
) => boolean>;

const getAssumptionViolationReport = (
  report: TickLog[], assumptions: RuleSet
) => {
  const violations: { name: string; tickLog: TickLog; tickNumber: number; }[] = [];
  report.forEach((tickLog, tickNumber) => {
    const previousTick = report[tickNumber - 1];
    Object.entries(assumptions).forEach(([name, rule]) => {
      const result = rule(tickLog, {
        allTicks: report,
        previousTick,
        tickNumber,
      });
      if (result === false) {
        violations.push({ name, tickLog, tickNumber });
      }
    });
  });
  return violations;
};

const assumptions: RuleSet = {
  'At tick 0, space must be 0': (tickLog, { tickNumber }) => {
    if (tickNumber === 0) return tickLog.space === 0n;
    return true;
  },
  'At tick 1, space must be >= 1': (tickLog, { tickNumber }) => {
    if (tickNumber === 1) return !!(tickLog.space && tickLog.space >= 1n);
    return true;
  },
  'Memory >= 1': (tickLog) => !!(tickLog.memory && tickLog.memory >= 1n),
  // TODO:
  // Need to decode the universe into nodes and connections to prove whether
  // there are disconnected nodes. Garbage collection of disconnected nodes
  // should be emergent, but may require special values to achieve.
  /**
   * Monotonic Density Test (Anti-Entropy Paradox Check)
   * The volume of memory should always expand or equal the previous step.
   * If it drops, your complexifier has a data erasure flaw.
   */
  'Memory space must never contract': (tickLog, { previousTick }) => {
    if (previousTick === undefined) return true;
    return !!(tickLog.memory && previousTick.memory && tickLog.memory >= previousTick.memory);
  },
  /**
   * The Relativity Threshold Check
   * Verifies that after Tick 2, the number of space steps scales out
   * to ensure your engine is generating macro-causality propagation steps.
   */
  // 'Spacetime must maintain positive acceleration': (tickLog, { previousTick }) => {
  //   if (previousTick === undefined) return true;
  //   return !!(tickLog.space && previousTick.space && tickLog.space > previousTick.space);
  // }
  /**
   * Weight Diversity Test
   * Ensures the universe is generating a complex spectrum of connections,
   * proving that your 2-bit space allocation is actually doing work.
   */
  // 'Universal graph must utilize granular weights': (tickLog) => {
  //   if (!tickLog.topology || tickLog.topology.length === 0) return true;

  //   // Pull a flat list of all active edge weights across the entire map
  //   const activeWeights = tickLog.topology.flatMap(node => node.connections.map(c => c.weight));
    
  //   // Check if the network contains a mix of values (e.g., both 1s and 3s)
  //   const uniqueWeightsCount = new Set(activeWeights).size;

  //   // Fail if the network only ever produces a single hardcoded weight level
  //   return uniqueWeightsCount > 1;
  // }
};

const twoniverse = universeFactory({
  /**
   * Each iteration within a tick moves the window along by the base.
   */
  base: 2,
  /**
   * Probably needs to be > 1 to achieve exponential memory space growth.
   */
  growthConstant: 2n,
  nodeSize: 4n,
  /**
   * An arbitrary value is assigned for now. Ultimately, the emergent speed of
   * light should be proportionally affected.
   */
  windowSize: 4n,
});
const twoniverseReport = twoniverse.run(4n);

console.log(
  'Violations', getAssumptionViolationReport(twoniverseReport, assumptions)
);
