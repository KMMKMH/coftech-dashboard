import { createContext, useContext } from "react";



export const PopUpContext = createContext<{ showPopUp: (type: string, msg: string) => void }>({
  showPopUp: () => {},
});

export const usePopUp = () => useContext(PopUpContext);