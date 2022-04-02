import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import useAuthContext from "./useAuthContext";
import { auth } from "../firebase/config";
import useProfileContext from "./useProfileContext";
import setProfilesDoc from "../firebase/utils/setProfilesDoc";

const useLogout = () => {
  const { authState, dispatch } = useAuthContext();
  const { profileState } = useProfileContext();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      // update current user's profile when logging out
      if (authState.user) {
        await setProfilesDoc(authState.user?.uid, profileState.bestScores, profileState.userSettings);
      }

      await signOut(auth);
      dispatch({ type: "LOGOUT" });
      toast.success("Successfully Logged Out!");
      navigate("/");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return { logout };
};

export default useLogout;
