import { getObjectEntries } from "./object";

type Reducer<T> = (state: T, action: unknown) => T;
type ReducerMap<T> = Record<string, Reducer<T>>;

type RunSubscriberParams<
  T extends object, 
  R extends ReducerMap<T>,
  U extends keyof R
> = {
  action: Record<U, Parameters<R[U]>[1]>;
  phase: 'before-all' | 'after-all';
} | {
  action: Record<U, Parameters<R[U]>[1]>[U]
  phase: 'before' | 'after'
};
export type SubscriberParams<
  T extends object, 
  R extends ReducerMap<T>,
  U extends keyof R
> = { state: T; } & RunSubscriberParams<T, R, U>;

export class StateManager<T extends object, R extends ReducerMap<T> = ReducerMap<T>> {
  // private reducers: ReducerMap<T> = new Map();
  private subscribers: Array<<U extends keyof R>(
    params: SubscriberParams<T, R, U>
  ) => unknown> = [];

  constructor(private state: T, private reducers: R) { }
  static from<
    T extends object,
    R extends ReducerMap<T> = ReducerMap<T>
  >(
    initial: T,
    reducers: R
  ) { return new StateManager<T, R>(initial, reducers); }

  dispatch<U extends keyof R>(
    params: Record<U, Parameters<R[U]>[1]>
  ) {
    if (!this.reducers) throw new Error(`No reducers defined.`);
    const reducers = this.reducers;

    // run scibscriptsions here with full params "before-all"
    this.runSubscriptions({ action: params, phase: 'before-all' });
    getObjectEntries(params).forEach(([name, action]) => {
      // Run subs here with "before"
      this.runSubscriptions({ action, phase: 'before' });
      // Copy the state so that the reducer can treat it as immutable.
      this.state = reducers[name]({ ...this.state }, action);
      // Run subs here with "after"
      this.runSubscriptions({ action, phase: 'after' });
    });
    // Run subs here with "after-all"
    this.runSubscriptions({ action: params, phase: 'after-all' });

    return this;
  }

  get(params?: never): T;
  get<U extends keyof T>(params: U): T[U];
  get(params?: keyof T) {
    if (params) return this.state[params];
    return this.state;
  }

  runSubscriptions<U extends keyof R>(
    params: RunSubscriberParams<T, R, U>
  ) {
    this.subscribers.forEach((subscriber) => subscriber({
      ...params, state: this.state
    }));
  }

  subscribe(subscriber: (params: SubscriberParams<T, R, keyof R>) => void) {
    this.subscribers.push(subscriber);

    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== subscriber);
    };
  }
};
