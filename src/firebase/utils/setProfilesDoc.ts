import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { BestScores, UserSettings } from "../../context/profile/types";
import { db } from "../config";

const setProfilesDoc = async (uid: string, bestScores: BestScores, userSettings: UserSettings) => {
  try {
    const docRef = doc(db, "Profiles", uid);
    await setDoc(docRef, {
      bestScores,
      userSettings,
    });
  } catch (err) {
    toast.error((err as Error).message);
  }
};

export default setProfilesDoc;
