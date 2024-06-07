import { useRef, useCallback, useContext, useSyncExternalStore } from "react";

export type UseStoreData<S> = {
  get: () => S,
  set: (value: Partial<S>) => void,
  subscribe: (callback: () => void) => () => void,
}

/**
 * Custom hook that provides a way to manage the state and subscribe to it.
 *
 * @return {Object} An object with three methods: get, set and subscribe.
 *    - `get` is a function that returns the current state.
 *    - `set` is a function that updates the state by merging the provided value.
 *    - `subscribe` is a function that takes a callback and returns an unsubscribe function.
 *      The callback will be called whenever the state changes.
 */
function useStoreData<S>(initialState: S): UseStoreData<S> {

  const state = useRef<S>(initialState);

  /**
   * Returns the current state.
   *
   * @return {Object} The current state.
   */
  const get = useCallback(() => state.current, [])
  
  /**
   * Updates the state by merging the provided value.
   *
   * @param {Object} value - The value to merge with the current state.
   */
  const set = useCallback((value: Partial<S>) => {
    state.current = { ...state.current, ...value }
    subscribers.current.forEach(callback => callback())
    
  }, [])
  
  const subscribers = useRef<Set<() => void>>(new Set())

  /**
   * Subscribes to changes in the state.
   *
   * @param {Function} callback - The function to call when the state changes.
   * @return {Function} A function to unsubscribe from the changes.
   */
  const subscribe = useCallback((callback: () => void) => {
    subscribers.current.add(callback)

    return () => subscribers.current.delete(callback)
  },  [])

  return { get, set, subscribe }
}

/**
 * Custom hook that subscribes to the state of a store and returns the selected value and a function to update the state.
 *
 * @param {Function} selector - A function that takes the current state and returns the selected value.
 * @return {Array} An array containing the selected value and a function to update the state.
 */
export function useStore<T, U>(context: React.Context<UseStoreData<T> | null>, selector: (state: T) => U): [U, (value: Partial<T>) => void] {
  
  const store = useContext(context)!

  // The commented code below can be used to achieve the same result as the `useSyncExternalStore` hook. 
  // It is a custom implementation that uses the `subscribe` function from the store context to register a callback that updates the state whenever the store changes. 
  // The `useEffect` hook is used to subscribe to state changes and clean up the subscription when the component unmounts.

  {/* const [state, setState] = useState(selector(store.get()))

  useEffect(() => {
    const unsubscribe = store.subscribe(() => setState(selector(store.get())))

    return () => unsubscribe()
  }) */}

  // OR:
  // The `useSyncExternalStore` hook is used to achieve the same result as the `useStore` hook.
  const state = useSyncExternalStore(store.subscribe, () => selector(store.get()))

  return [state, store.set]
}

export function StoreProvider<T extends object>({ context, state, children }: { context: React.Context<UseStoreData<T> | null>, state: T, children: React.ReactNode }) {

  return (
    <context.Provider value={useStoreData(state)}>
      {children}
    </context.Provider>
  );
}
