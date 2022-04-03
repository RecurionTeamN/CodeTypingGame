import React, { createContext, useReducer, useMemo, useEffect } from "react";
import { toast } from "react-toastify";
import { State, Action, Dispatch, Reducer, ProfileContextType, CodeLangTypes, codeLangs, BestScores } from "./types";
import useAuthContext from "../../hooks/useAuthContext";
import fetchProfilesDoc from "../../firebase/utils/fetchProfilesDoc";

type Values = {
  accuracy: number | null;
  speed: number | null;
};

const defaultBestScores = new Map<CodeLangTypes, Values>();
codeLangs.forEach((key) => {
  defaultBestScores.set(key, {
    accuracy: null,
    speed: null,
  });
});

// Default ProfileContext
const defaultContext: ProfileContextType = {
  profileState: {
    userSettings: {
      keyboardType: "mac-jis",
      codeLang: "Python",
      codeTitle: "",
      codeContent: "x = 5\nwhile x > 0:\n  print('Hello World {}'.format(x))\n  x -= 1",
    },
    bestScores: Object.fromEntries(defaultBestScores) as BestScores,
  },

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatch: (action: Action): void => {},
};

export const ProfileContext: React.Context<ProfileContextType> = createContext<ProfileContextType>(defaultContext);

const profileReducer: Reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "SET_USERSETTINGS":
      return { ...state, userSettings: action.payload };

    case "SET_BESTSCORES":
      return { ...state, bestScores: action.payload };

    default:
      return state;
  }
};

export const ProfileContextProvider: React.FC = ({ children }) => {
  const [profileState, dispatch]: [State, Dispatch] = useReducer<Reducer>(profileReducer, defaultContext.profileState);
  const { authState } = useAuthContext();

  useEffect(() => {
    // ProfileContext がマウントされ、ユーザーが確認された場合
    const getLatestProfileDoc = async () => {
      if (authState.user) {
        const res = await fetchProfilesDoc(authState.user.uid);
        // ユーザーの Profile ドキュメントが存在する場合
        if (res) {
          dispatch({ type: "SET_USERSETTINGS", payload: res.userSettings });
          dispatch({ type: "SET_BESTSCORES", payload: res.bestScores });
        }
      }
    };

    getLatestProfileDoc().catch((err) => toast.error((err as Error).message));
  }, [authState.user]);

  const value = useMemo(
    () => ({
      profileState,
      dispatch,
    }),
    [profileState]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};
