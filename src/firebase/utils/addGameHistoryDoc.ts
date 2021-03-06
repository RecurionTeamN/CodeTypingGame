import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../config";

const addGameHistoryDoc = async (uid: string, accuracy: number, codeLang: string, speed: number) => {
  const ref = collection(db, "GameHistory");
  await addDoc(ref, {
    accuracy,
    codeLang,
    createdAt: Timestamp.now(),
    speed,
    uid,
  });
};

export default addGameHistoryDoc;
