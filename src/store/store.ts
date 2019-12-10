import { createStore } from "redux";
import reducer from './reducer';

const store = createStore(reducer);

const onChange = () => {
  console.log("state changed: ", store.getState());
}

store.subscribe(onChange);

export default store;