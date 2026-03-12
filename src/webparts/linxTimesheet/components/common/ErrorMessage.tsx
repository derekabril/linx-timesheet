import * as React from "react";
import { MessageBar, MessageBarType } from "@fluentui/react/lib/MessageBar";

interface IErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

export const ErrorMessage: React.FC<IErrorMessageProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <MessageBar
      messageBarType={MessageBarType.error}
      isMultiline={false}
      onDismiss={onDismiss}
      dismissButtonAriaLabel="Close"
      styles={{ root: { marginBottom: 8 } }}
    >
      {message}
    </MessageBar>
  );
};
