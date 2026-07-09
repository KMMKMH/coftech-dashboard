import { ReactNode, useState, useCallback, useMemo } from "react";
import { PopUpContext } from "./popUpContext";
import PopUp from "@component/components/PopUp";

export const PopUpProvider = ({ children }: { children: ReactNode }) => {
  const [type, setType] = useState("success");
  const [msg, setMsg] = useState("");
  const [isShown, setIsShown] = useState(false);

  const showPopUp = useCallback((popupType: string, popupMsg: string) => {
    setType(popupType);
    setMsg(popupMsg);
    setIsShown(true);
  }, []);

  const value = useMemo(() => ({ showPopUp }), [showPopUp]);

  return (
    <PopUpContext.Provider value={value}>
      {children}
      <PopUp type={type} msg={msg} isShown={isShown} setIsShown={setIsShown} />
    </PopUpContext.Provider>
  );
};