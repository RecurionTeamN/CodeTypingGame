import { collection, getDocs, query, where } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../config";
import { CodesDocument } from "../Codes/types";
import { CodeLangTypes } from "../../context/profile/types";

const fetchCodesDocs = async (codeLanguage: CodeLangTypes) => {
  const results: CodesDocument[] = [];

  try {
    const ref = collection(db, "Codes");
    const q = query(ref, where("codeLang", "==", codeLanguage));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      results.push({ ...doc.data() } as CodesDocument);
    });
  } catch (err) {
    toast.error((err as Error).message);
  }

  return results;
};

export default fetchCodesDocs;
