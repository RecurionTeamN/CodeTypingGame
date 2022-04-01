import { useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "../firebase/config";
import useAuthContext from "./useAuthContext";

const useLogin = () => {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      if (!res) {
        throw new Error("there was an Error when trying to login");
      }
      dispatch({ type: "LOGIN", payload: res.user });
      navigate("/dashboard");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return { googleLogin };
};

export default useLogin;
