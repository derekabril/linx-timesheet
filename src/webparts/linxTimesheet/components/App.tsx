import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { ThemeProvider } from "@fluentui/react/lib/Theme";
import { AppProvider } from "../context/AppContext";
import { TimesheetProvider } from "../context/TimesheetContext";
import { ErrorBoundary } from "./common/ErrorBoundary";
import { AppShell } from "./layout/AppShell";

export interface IAppProps {
  context: WebPartContext;
  title: string;
}

const App: React.FC<IAppProps> = ({ context, title }) => {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AppProvider context={context}>
          <TimesheetProvider>
            <AppShell title={title} />
          </TimesheetProvider>
        </AppProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
