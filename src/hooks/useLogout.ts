import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import useAuthContext from "./useAuthContext";
import { auth } from "../firebase/config";

const useLogout = () => {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const logout = async () => {
    try {
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
