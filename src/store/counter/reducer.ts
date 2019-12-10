import { CounterState, CounterAction, INCREMENT_COUNTER, DECREMENT_COUNTER } from "./types";

const counterReducer = (state: CounterState = 0, action: CounterAction): CounterState => {
  switch (action.type) {
    case INCREMENT_COUNTER: return state + 1;
    case DECREMENT_COUNTER: return state - 1;
    default: return state;
  }
}

export default counterReducer;