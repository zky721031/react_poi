import { initState } from './initState';

const reducer = (prevState, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...prevState,
        age: prevState.age + 1,
      };
    case 'DECREMENT':
      return {
        ...prevState,
        age: prevState.age - 1,
      };
    default:
      return prevState;
  }
};

export { initState, reducer };
