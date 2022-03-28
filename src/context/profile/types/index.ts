export type KeyboardTypes = "jis" | "us" | "mac-jis" | "mac-us";

export const codeLanguages = [
  "Typescript",
  "Javascript",
  "Python",
  "Go",
  "Java",
  "Kotlin",
  "Php",
  "C#",
  "C++",
  "Swift",
  "Ruby",
  "R",
];

export const codeLangs = [
  "Typescript",
  "Javascript",
  "Python",
  "Go",
  "Java",
  "Kotlin",
  "Php",
  "C#",
  "C++",
  "Swift",
  "Ruby",
  "R",
] as const;

export type CodeLangTypes = typeof codeLangs[number];

export type UserSettings = {
  keyboardType: KeyboardTypes;
  codeLang: CodeLangTypes;
  codeTitle: string;
  codeContent: string;
};

export type BestScores = {
  [keyName in CodeLangTypes]: {
    accuracy: number | null;
    speed: number | null;
  };
};

export type State = {
  userSettings: UserSettings;
  bestScores: BestScores;
};

// type setBestScoresPayloadType = {
//   codeLang: CodeLangTypes;
//   data: {
//     accuracy: number | null;
//     speed: number | null;
//   }
// }

export type Action =
  | { type: "SET_USERSETTINGS"; payload: UserSettings }
  | { type: "SET_BESTSCORES"; payload: BestScores };

export type Dispatch = React.Dispatch<Action>;
export type Reducer = React.Reducer<State, Action>;

// ProfileContext型を定義
export type ProfileContextType = {
  profileState: State;
  dispatch: Dispatch;
};
