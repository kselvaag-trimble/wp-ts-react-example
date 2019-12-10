import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/types';
import { incrementCounter, decrementCounter } from '../store/counter/actions';

interface CounterViewProps {
  label: string
}

const CounterView = (props: CounterViewProps) => {
  const counter = useSelector(selectCounter);

  const dispatch = useDispatch();
  const increment = () => dispatch(incrementCounter());
  const decrement = () => dispatch(decrementCounter());

  return (
    <div>
      {props.label}
      <div>{counter}</div>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}

const selectCounter = (state: RootState) => state.counter;

export default CounterView;