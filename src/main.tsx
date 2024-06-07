import React,{ createContext }  from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { StoreProvider, UseStoreData } from './hooks/useStore.tsx'

export type State = typeof initialState;

let initialState = {
  first: "",
  last: "",
  age: "",
  count: 0,
  getFullName: function() { return `${this.first} ${this.last}`},
  // increment: function() { initialState = { ...initialState, count: initialState.count+=1 } },
  // decrement: function() { initialState = { ...initialState, count: initialState.count-=1 }},
  // reset: function() { this.count = 0; },
};

export const StoreContext = createContext<UseStoreData<State> | null>(null);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreProvider context={StoreContext} state={initialState} >
      <App />
    </StoreProvider>
  </React.StrictMode>,
)
