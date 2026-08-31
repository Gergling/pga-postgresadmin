import { TaskCoreBaseRelationship, TaskSerialisation } from "../schema";

type TaskState = Pick<TaskSerialisation, 'id'> & {
  data: Pick<TaskSerialisation['data'], 'relationships'>;
};

type TaskRelationshipActionParent = {
  prop: 'parent';
} & ({
  payload?: never;
  type: 'unlink';
} | {
  payload: string;
  type: 'link';
});

type TaskRelationshipActionProps = {
  payload: string;
  prop: Exclude<keyof TaskCoreBaseRelationship, 'parent'>;
  type: 'unlink' | 'link';
};

export type TaskRelationshipAction =
  | TaskRelationshipActionParent
  | TaskRelationshipActionProps
  ;

const reduceTaskRelationshipStateParent = (
  state: TaskState,
  parent?: string,
): TaskState => ({
  ...state,
  data: {
    ...state.data,
    relationships: {
      ...state.data.relationships,
      parent,
    }
  }
});

const reduceTaskRelationshipStateProp = (
  state: TaskState,
  action: Pick<TaskRelationshipActionProps, 'prop'> & { payload: string[] }
): TaskState => ({
  ...state,
  data: {
    ...state.data,
    relationships: {
      ...state.data.relationships,
      [action.prop]: action.payload,
    }
  }
});

export const reduceTaskRelationshipState = (
  state: TaskState,
  action: TaskRelationshipAction,
): TaskState => {
  // A task can never be related to itself
  if (action.type === 'unlink') {
    if (action.prop === 'parent') {
      // Unlinking a parent never has a payload and just sets to undefined.
      return reduceTaskRelationshipStateParent(state);
    }

    // Unlinking a different prop always has a payload is removed.
    const ids = state.data.relationships[action.prop].filter(
      (id) => id !== action.payload
    );
    return reduceTaskRelationshipStateProp(state, { ...action, payload: ids });
  }

  // Linking a prop always has a payload to add.
  const id = action.payload;

  if (id === state.id) throw new Error([
    `Attempted to relate task "${id}" to itself as ${action.prop}.`,
    `Tasks cannot be related to themselves.`
  ].join(' '));

  if (action.prop === 'parent') return reduceTaskRelationshipStateParent(
    state, id
  );

  // Linking a non-parent prop adds the id to the array of ids.
  const ids = [...new Set([...state.data.relationships[action.prop], id])];

  return reduceTaskRelationshipStateProp(state, { ...action, payload: ids });
};
