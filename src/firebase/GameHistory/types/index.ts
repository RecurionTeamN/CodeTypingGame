import { Timestamp } from "firebase/firestore";
import { CodeLangTypes } from "../../../context/profile/types";

// GameHistory collection から取得したデータ型
export type GameHistoryDocument = {
  id: string; // 今後コンポーネント内でデータを .map で表示した際必要となる unqiue key
  accuracy: number;
  codeLang: CodeLangTypes;
  createdAt: Timestamp;
  speed: number;
  uid: string;
};

// GameHistory collection へポストするデータ型
// id は自動的に addDoc で追加される
export type PostGameHistoryDocument = {
  accuracy: number;
  codeLang: CodeLangTypes;
  createdAt: Timestamp;
  speed: number;
  uid: string;
};
