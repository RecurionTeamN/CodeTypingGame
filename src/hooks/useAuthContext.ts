import { useContext } from "react";
import { AuthContext } from "../context/auth/AuthContext";
import { AuthContextType } from "../context/auth/types";

const useAuthContext = () => {
  const context = useContext<AuthContextType>(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be inside AuthContextProvider");
  }

  return context;
};

export default useAuthContext;
