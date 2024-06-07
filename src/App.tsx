import React from 'react';
import './App.css';
import { useStore } from './hooks/useStore';
import { State, StoreContext } from './main';

function Display ({ value }: { value: "first" | "last" }) {
  const [state] = useStore(StoreContext, (state: State) => state[value])

  return (
    <div>
      {value}: {state}
    </div>
  )
}

const DisplayContainer =  () => {

  return (
    <div className='border'>
      <h3>DisplayContainer</h3>
      <Display value='first' />
      <Display value='last' />
      <FullName />
      <Counter />
    </div>
  )
}

function TextInput ({ value }: { value: "first" | "last" }) {
  const [state, setState] = useStore(StoreContext, (state: State) => state[value])
  
  return (
    <div>
      {value}: <input type="text" value={state} onChange={(e) => setState({ [value]: e.target.value })} />
    </div>
  )
}

function FullName () {
  const [fullName] = useStore(StoreContext, (state: State) => (state.getFullName as () => string)())
  return (
    <div className='border'>
      <h3>FullNameContainer</h3>
      Full Name: <span>{fullName as string}</span>
    </div>
  )
}

const FormContainer = () => {

  return (
    <div className='border'>
      <h3>FormContainer</h3>
      <TextInput value='first' />
      <TextInput value='last' />
    </div>
  )
}

const ContentContainer = React.memo(() => {

  return (
    <div className='border content'>
      <h3>ContentContainer</h3>
      <FormContainer />
      <DisplayContainer />
    </div>
  )
})

function Counter () {
  const [count, setState] = useStore(StoreContext, (state: State) => state.count)

  return (
    <div className='border'>
      <h3>CounterContainer</h3>
      {/* <CounterButton type='decrement' /> */}
      <button onClick={() => setState({ count: count - 1 })}>Increment</button>
      Count: <h3>{count}</h3>
      <button onClick={() => setState({ count: count + 1 })}>Decrement</button>
      {/* <CounterButton type='increment' /> */}
    </div>
  )
}

{/*
  Note: Below approach won't work because you need to mutate "count" state using the setter function only.
  Defining functions increment and decrement in the state object will not work although they can properly mutate the state.
  This happens because setting the state using increment and decrement functions won't trigger the setter function
  of useStoreData hook, which in turn calls the setState function to update the state of each subscriber.
*/}
// function CounterButton({ type }: { type: 'increment' | 'decrement' }) {
//   const [button, setState] = useStore(StoreContext, (state: State) => (type === 'increment' ? state.increment : state.decrement))
//   return (
//     <button onClick={() => {button(); setState({[type]: button})}}>{type === 'increment' ? 'Increment' : 'Decrement'}</button>
//   )
// }

function App() {

  return (
    <div className='border'>
      <h3>App</h3>
        <ContentContainer />
    </div>
  )
}

export default App
