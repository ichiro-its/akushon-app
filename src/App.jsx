import React from "react";
import MuiAppBar from "@material-ui/core/AppBar";
import MuiToolbar from "@material-ui/core/Toolbar";
import MuiTypography from "@material-ui/core/Typography";

import {
  BridgeProvider,
  BridgeConnection,
  LoggerProvider,
  SessionProvider,
} from "kumo-app";

import ActionManager from "./components/ActionManager";
import "./App.css";

function App() {
  return (
    <div className="root">
      <LoggerProvider>
        <BridgeProvider>
          <BridgeConnection />
          <SessionProvider>
            <MuiAppBar position="static">
              <MuiToolbar>
                <MuiTypography variant="h6">Akushon App</MuiTypography>
              </MuiToolbar>
            </MuiAppBar>
            <ActionManager />
          </SessionProvider>
        </BridgeProvider>
      </LoggerProvider>
    </div>
  );
}

export default App;
