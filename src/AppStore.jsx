import React, { useReducer } from 'react';
import { reducer, initState, initAction } from './store';

export const AppContextWrapper = React.createContext();

export default function AppStore({ children }) {
  const [state, dispatch] = useReducer(reducer, initState, initAction);

  return (
    <AppContextWrapper.Provider value={{ state, dispatch }}>
      {children}
    </AppContextWrapper.Provider>
  );
}
