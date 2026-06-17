import { useReducer } from "react";
import z from "zod";

const unitTest = z.enum([
  'error', 'eligible', 'exists', 'initiated', 'none',
]).default('none');
type UnitTestState = z.infer<typeof unitTest>;
type UnitTestAction = 
  | 'initiate'
  | 'complete'
  | 'fail'
;
const reduceUnitTest = (
  state: UnitTestState, action: UnitTestAction
): UnitTestState => {
  if (state === 'eligible' && action === 'initiate') return 'initiated';
  if (state === 'initiated') return action === 'complete' ? 'exists' : 'error';
  return state;
};

// TODO: Probably don't need all of this.
const stateSchema = z.object({
  open: z.boolean().default(false),
  fetchLocks: z.enum(['empty', 'initiated', 'done']).default('empty'),
  unitTest,
});
const initialState = stateSchema.parse({});
type State = z.infer<typeof stateSchema>;
type Action =
  | 'fetch' | 'lock'
  | 'open' | 'toggle'
  | {
    type: 'unit-test';
    payload: UnitTestAction;
  }
;
const reducer = (state: State, action: Action): State => {
  switch (action) {
    case 'fetch': return {
      ...state,
      fetchLocks: state.fetchLocks === 'empty' ? 'initiated' : state.fetchLocks,
    };
    case 'lock': return { ...state, fetchLocks: 'done' };
    case 'open': return { ...state, open: true };
    case 'toggle': return { ...state, open: !state.open };
  }

  if (action.type === 'unit-test') return {
    ...state, unitTest: reduceUnitTest(state.unitTest, action.payload),
  };

  return state;
};

export const useExplorerListItem = (state: Partial<State>) => useReducer(
  reducer, { ...initialState, ...state }
);
