import { createContext, useContext } from "react";

export const ErrorContext = createContext<{ showError: (msgs: string | string[]) => void }>({
  showError: () => {},
});

export const useError = () => useContext(ErrorContext);