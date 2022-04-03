import { useState, useEffect } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { toast } from "react-toastify";
import { GameHistoryDocument } from "../firebase/GameHistory/types";
import { db } from "../firebase/config";
import useAuthContext from "./useAuthContext";

const useGameHistoryCollection = () => {
  const [documents, setDocuments] = useState<GameHistoryDocument[] | undefined>(undefined);
  const [isPending, setIsPending] = useState(false);
  const { authState } = useAuthContext();

  useEffect(() => {
    setIsPending(true);
    const ref = collection(db, "GameHistory");
    const q = query(ref, where("uid", "==", authState.user?.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const results: GameHistoryDocument[] | undefined = [];
        snapshot.docs.forEach((doc) => {
          results.push({ ...(doc.data() as GameHistoryDocument), id: doc.id });
        });
        setDocuments(results);
        setIsPending(false);
      },
      (err) => {
        toast.error((err as Error).message);
        setIsPending(false);
      }
    );

    // unsubscribe on dismount
    return unsubscribe;
  }, [authState.user]);

  return { documents, isPending };
};

export default useGameHistoryCollection;
