import { useContext } from "react";
import { ProfileContext } from "../context/profile/ProfileContext";
import { ProfileContextType } from "../context/profile/types";

const useProfileContext = () => {
  const context = useContext<ProfileContextType>(ProfileContext);

  if (!context) {
    throw new Error("useProfileContext must be inside ProfileContextProvider");
  }

  return context;
};

export default useProfileContext;
