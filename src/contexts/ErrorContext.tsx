import { createContext, ReactNode, useState } from "react";

type ErrorMessage = {
  text: string;
  link?: {
    text: string;
    href: string;
  };
};

export interface ErrorContextState {
  errorMessages: ErrorMessage[];
  addErrorMessage: (errorMessage: ErrorMessage) => void;
  removeErrorMessage: (errorMessage: ErrorMessage) => void;
  clearErrorMessages: () => void;
}

export const defaultErrorContextState: ErrorContextState = {
  errorMessages: [],
  addErrorMessage: () => undefined,
  removeErrorMessage: () => undefined,
  clearErrorMessages: () => undefined,
};

export const ErrorContext = createContext<ErrorContextState>(
  defaultErrorContextState
);

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [errorMessages, setErrorMessages] = useState<ErrorMessage[]>([]);

  function addErrorMessage(errorMessage: ErrorMessage) {
    setErrorMessages([...errorMessages, errorMessage]);
  }

  function removeErrorMessage(errorMessage: ErrorMessage) {
    setErrorMessages(
      errorMessages.filter(({ text }) => text !== errorMessage.text)
    );
  }

  function clearErrorMessages() {
    setErrorMessages([]);
  }

  return (
    <ErrorContext.Provider
      value={{
        errorMessages,
        addErrorMessage,
        removeErrorMessage,
        clearErrorMessages,
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
}
