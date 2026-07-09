import { ReactNode, useState, useCallback, useMemo } from "react";
import { ErrorContext } from "./errorContext";
import ErrorModal from "@component/components/ErrorModal";

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string | string[]>([]);

  const showError = useCallback((msgs: string | string[]) => {
    if (!isErrorModalOpen) {
      setErrorMessages(msgs);
      setIsErrorModalOpen(true);
    }
  }, [isErrorModalOpen]);

  const handleCloseErrorModal = () => {
    setIsErrorModalOpen(false);
    setErrorMessages([]);
  };

  const value = useMemo(() => ({ showError }), [showError]);

  return (
    <ErrorContext.Provider value={value}>
      {children}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={handleCloseErrorModal}
        errorMessages={errorMessages}
      />
    </ErrorContext.Provider>
  );
};