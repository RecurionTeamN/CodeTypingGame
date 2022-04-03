import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../config";
import { ProfilesDocument } from "../Profiles/types";

const fetchProfilesDoc = async (uid: string) => {
  let result: ProfilesDocument | undefined;

  try {
    const docRef = doc(db, "Profiles", uid);
    const docSnap = await getDoc(docRef);
    result = docSnap.data() as ProfilesDocument;
  } catch (err) {
    toast.error((err as Error).message);
  }

  return result;
};

export default fetchProfilesDoc;
