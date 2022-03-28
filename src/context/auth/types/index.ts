import { User } from "firebase/auth";

// UseContext -> State, Dispatch型を定義
export type State = {
  user: User | null;
  authIsReady: boolean;
};

export type Action = { type: "LOGIN"; payload: User | null } | { type: "LOGOUT" };

export type Dispatch = React.Dispatch<Action>;
export type Reducer = React.Reducer<State, Action>;

// AuthContext型を定義
export type AuthContextType = {
  authState: State;
  dispatch: Dispatch;
};
