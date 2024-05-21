import { initState } from './initState';

const initAction = (initState) => {
  return { ...initState, age: Math.round(Math.abs(initState)) || 18 };
};

export { initAction };
