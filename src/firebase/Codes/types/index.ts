import { CodeLangTypes } from "../../../context/profile/types";

// Codes collection から取得したデータ型
export type CodesDocument = {
  codeContent: string;
  codeLang: CodeLangTypes;
  codeTitle: string;
};
