import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useReducer, useEffect, useMemo } from "react";
import { auth } from "../../firebase/config";
import { State, Action, Dispatch, Reducer, AuthContextType } from "./types";

// Default Context
const defaultContext: AuthContextType = {
  authState: {
    user: null,
    authIsReady: false,
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatch: (action: Action): void => {},
};

export const AuthContext: React.Context<AuthContextType> = createContext<AuthContextType>(defaultContext);

const authReducer: Reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload, authIsReady: true };

    case "LOGOUT":
      return { ...state, user: null };

    default:
      return state;
  }
};

export const AuthContextProvider: React.FC = ({ children }) => {
  const [authState, dispatch]: [State, Dispatch] = useReducer<Reducer>(authReducer, defaultContext.authState);

  // check if user has already logged in via Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch({ type: "LOGIN", payload: user });
    });

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      authState,
      dispatch,
    }),
    [authState]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
