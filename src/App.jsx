import React, { useState } from "react";
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
import ActionContext from "./context/ActionContext";
import "./App.css";

function App() {
  const [actionsData, setActionsData] = useState([]);
  const [posesData, setPosesData] = useState([]);
  const [jointPoseData, setJointPoseData] = useState([]);
  const [jointRobotData, setJointRobotData] = useState([]);
  const [jointSelected, setJointSelected] = useState([]);
  const [currentAction, setCurrentAction] = useState({});
  const [currentPose, setCurrentPose] = useState({});

  return (
    <ActionContext.Provider
      value={{
        actionsData,
        posesData,
        jointPoseData,
        jointRobotData,
        jointSelected,
        currentAction,
        currentPose,
        setActionsData,
        setPosesData,
        setJointPoseData,
        setJointRobotData,
        setJointSelected,
        setCurrentAction,
        setCurrentPose,
      }}
    >
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
    </ActionContext.Provider>
  );
}

export default App;
