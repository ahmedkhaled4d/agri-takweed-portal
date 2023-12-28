import React, { createContext, useReducer } from 'react';

export const actions = { SET_AUTH: 'SET_AUTH' };

function Reducer(state, action) {
  switch (action.type) {
    case 'SET_AUTH':
      const saved = localStorage.getItem('user');
      if (saved) return { user: saved, role: action.payload };
      return { user: 'تسجيل الدخول' };

    default:
      return state;
  }
}

const initialState = {
  user: (() => {
    const saved = localStorage.getItem('user');
    return saved || 'تسجيل الدخول';
  })(),
};

export const UserContext = createContext(initialState);

const UserStore = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  return (
    <UserContext.Provider value={[state, dispatch]}>
      {children}
    </UserContext.Provider>
  );
};

export default UserStore;
