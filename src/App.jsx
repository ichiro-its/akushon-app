import React, { useState } from "react";
import MuiAppBar from "@material-ui/core/AppBar";
import MuiToolbar from "@material-ui/core/Toolbar";
import MuiTypography from "@material-ui/core/Typography";

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
  const GRPC_WEB_API_URL = import.meta.env.VITE_GRPC_WEB_API_URL;

  return (
    <ActionContext.Provider
      value={{
        GRPC_WEB_API_URL,
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
        <MuiAppBar position="static">
          <MuiToolbar>
            <MuiTypography variant="h6">Akushon App</MuiTypography>
          </MuiToolbar>
        </MuiAppBar>
        <ActionManager />
      </div>
    </ActionContext.Provider>
  );
}

export default App;
