import AddIcon from "@material-ui/icons/Add";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { DataGrid } from "@material-ui/data-grid";
import MuiTypography from "@material-ui/core/Typography";
import { Button, Card, CardContent, Grid, TextField } from "@material-ui/core";

import {
  ClientProvider,
  NodeProvider,
  PublisherProvider,
  SubscriptionProvider,
  useLogger,
} from "kumo-app";

import React, { useContext } from "react";

import ActionContext from "../context/ActionContext";

import SetTorquesButton from "./SetTorquesButton";
import SetJointsButton from "./SetJointsButton";
import GetActionsButton from "./GetActionsButton";
import RunActionButton from "./RunActionButton";
import SaveActionsButton from "./SaveActionsButton";
import SetJointsOnCellEdit from "./SetJointsOnCellEdit";

const actionColumns = [
  {
    field: "name",
    headerName: "Name",
    width: 160,
    sortable: false,
  },
  {
    field: "next",
    headerName: "Next",
    width: 90,
    sortable: false,
  },
  {
    field: "start_delay",
    headerName: "Start Delay",
    width: 75,
    sortable: false,
  },
  {
    field: "stop_delay",
    headerName: "Stop Delay",
    width: 75,
    sortable: false,
  },
  {
    field: "poses",
    headerName: "Poses",
    sortable: false,
  },
];

const poseColumns = [
  {
    field: "name",
    headerName: "Name",
    width: 140,
    sortable: false,
  },
  {
    field: "speed",
    headerName: "Speed",
    width: 100,
    type: "number",
    sortable: false,
  },
  {
    field: "pause",
    headerName: "Pause",
    width: 100,
    type: "number",
    sortable: false,
  },
  {
    field: "joints",
    headerName: "Joints",
    sortable: false,
  },
];

const jointPoseColumns = [
  { field: "name", headerName: "Name", width: 140, sortable: false },
  {
    field: "pose_pos",
    headerName: "Pose Pos",
    width: 100,
    type: "number",
    editable: true,
    sortable: false,
  },
];

const jointIdList = {
  right_shoulder_pitch: 1,
  left_shoulder_pitch: 2,
  right_shoulder_roll: 3,
  left_shoulder_roll: 4,
  right_elbow: 5,
  left_elbow: 6,
  right_hip_yaw: 7,
  left_hip_yaw: 8,
  right_hip_roll: 9,
  left_hip_roll: 10,
  right_hip_pitch: 11,
  left_hip_pitch: 12,
  right_knee: 13,
  left_knee: 14,
  right_ankle_pitch: 15,
  left_ankle_pitch: 16,
  right_ankle_roll: 17,
  left_ankle_roll: 18,
  neck_yaw: 19,
  neck_pitch: 20,
};

function ActionManager() {
  const {
    actionsData,
    posesData,
    jointPoseData,
    jointRobotData,
    currentAction,
    currentPose,
    setActionsData,
    setPosesData,
    setJointPoseData,
    setJointRobotData,
    setJointSelected,
    setCurrentAction,
    setCurrentPose,
  } = useContext(ActionContext);

  const logger = useLogger();

  const handleClickedAction = (event) => {
    setCurrentAction(event.row);
    const currentPoses = actionsData[event.row.id].poses;
    setPosesData(currentPoses);
    setJointPoseData([]);
  };

  const handleClickedPose = (event) => {
    setCurrentPose(posesData[event.row.id]);
    setJointPoseData([]);

    const currentPoses = posesData[event.row.id];

    const currentJointPoseData = [];
    for (let i = 0; i < currentPoses.joints.length; i += 1) {
      currentJointPoseData.push({
        id: jointIdList[currentPoses.joints[i].name],
        name: currentPoses.joints[i].name,
        pose_pos: currentPoses.joints[i].pose_pos,
      });
    }
    setJointPoseData(currentJointPoseData);
  };

  const updateActionsData = (newAction) => {
    setCurrentAction(newAction);
    const newActionsData = [
      ...actionsData.slice(0, newAction.id),
      newAction,
      ...actionsData.slice(newAction.id + 1),
    ];
    setActionsData(newActionsData);
  };

  const updatePosesData = (newPose) => {
    setCurrentPose(newPose);
    const newPosesData = [
      ...posesData.slice(0, newPose.id),
      newPose,
      ...posesData.slice(newPose.id + 1),
    ];
    setPosesData(newPosesData);

    const newAction = {
      id: currentAction.id,
      name: currentAction.name,
      next: currentAction.next,
      start_delay: currentAction.start_delay,
      stop_delay: currentAction.stop_delay,
      poses: newPosesData,
    };
    updateActionsData(newAction);
  };

  const updateJointPoseData = (newJoints, index) => {
    const newJointPoseData = [
      ...jointPoseData.slice(0, index),
      newJoints,
      ...jointPoseData.slice(index + 1),
    ];
    setJointPoseData(newJointPoseData);

    const newPose = {
      id: currentPose.id,
      name: currentPose.name,
      speed: currentPose.speed,
      pause: currentPose.pause,
      joints: newJointPoseData,
    };
    updatePosesData(newPose);
  };

  const setJointRobotToPoseData = () => {
    if (jointRobotData.length !== 0) {
      setJointPoseData(jointRobotData);

      const newPose = {
        id: currentPose.id,
        name: currentPose.name,
        speed: currentPose.speed,
        pause: currentPose.pause,
        joints: jointRobotData,
      };
      updatePosesData(newPose);
    } else {
      logger.error("Joint robot data is empty!");
    }
  };

  const subscriptionCurrentJointsCallback = (message) => {
    const currentJoints = message.joints;
    const currentJointRobotData = [];
    for (let i = 0; i < currentJoints.length; i += 1) {
      currentJointRobotData.push({
        id: currentJoints[i].id,
        name: Object.keys(jointIdList).find((key) => jointIdList[key] === currentJoints[i].id),
        pose_pos: currentJoints[i].position,
      });
    }
    setJointRobotData(currentJointRobotData);
  }

  return (
    <NodeProvider nodeName="akushon_app">
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={3}>
              <div style={{ height: 680, width: "100%" }}>
                <DataGrid
                  rows={actionsData}
                  columns={actionColumns}
                  rowHeight={32}
                  disableColumnMenu
                  rowsPerPageOptions={[]}
                  onRowClick={handleClickedAction}
                />
              </div>
              <div style={{ marginTop: 10 }}>
                <ClientProvider
                  serviceType="akushon_interfaces/srv/SaveActions"
                  serviceName="/akushon/config/save_actions"
                >
                  <SaveActionsButton />
                </ClientProvider>
                <ClientProvider
                  serviceType="akushon_interfaces/srv/GetActions"
                  serviceName="/akushon/config/get_actions"
                >
                  <GetActionsButton />
                </ClientProvider>
              </div>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Card>
                <CardContent>
                  <MuiTypography variant="subtitle1">Action</MuiTypography>
                  <div style={{ marginBottom: 10 }}>
                    <TextField
                      id="action-name"
                      label="Name"
                      variant="outlined"
                      margin="dense"
                      value={currentAction ? currentAction.name : ""}
                      onChange={(event) => {
                        const newAction = {
                          id: currentAction.id,
                          name: event.target.value,
                          next: currentAction.next,
                          start_delay: currentAction.start_delay,
                          stop_delay: currentAction.stop_delay,
                          poses: currentAction.poses,
                        };
                        updateActionsData(newAction);
                      }}
                      style={{ margin: 3, marginTop: 20, width: "60%" }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <TextField
                      id="action-next"
                      label="Next"
                      variant="outlined"
                      margin="dense"
                      value={currentAction ? currentAction.next : ""}
                      onChange={(event) => {
                        const newAction = {
                          id: currentAction.id,
                          name: currentAction.name,
                          next: event.target.value,
                          start_delay: currentAction.start_delay,
                          stop_delay: currentAction.stop_delay,
                          poses: currentAction.poses,
                        };
                        updateActionsData(newAction);
                      }}
                      style={{ margin: 3, marginTop: 20, width: "30%" }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </div>
                  <div style={{ height: 360, width: "100%" }}>
                    <DataGrid
                      rows={posesData}
                      columns={poseColumns}
                      rowHeight={32}
                      disableColumnMenu
                      rowsPerPageOptions={[]}
                      onRowClick={handleClickedPose}
                    />
                  </div>

                  <div style={{ marginTop: 10, marginBottom: -10 }}>
                    <PublisherProvider
                      messageType="tachimawari_interfaces/msg/SetJoints"
                      topicName="/joint/set_joints"
                    >
                      <SetJointsButton typeButton="run_pose" />
                    </PublisherProvider>
                    <Button
                      style={{ marginLeft: 8 }}
                      variant="contained"
                      color="default"
                      className="button"
                      startIcon={<AddIcon />}
                    >
                      Add Pose
                    </Button>
                    <Button
                      style={{ marginLeft: 8 }}
                      variant="contained"
                      color="default"
                      className="button"
                      startIcon={<ArrowUpwardIcon />}
                    >
                      Up
                    </Button>
                    <Button
                      style={{ marginLeft: 8 }}
                      variant="contained"
                      color="default"
                      className="button"
                      startIcon={<ArrowDownwardIcon />}
                    >
                      Down
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card style={{ marginTop: 10 }}>
                <CardContent>
                  <MuiTypography variant="subtitle1">Pose</MuiTypography>
                  <TextField
                    id="pose-name"
                    label="Name"
                    variant="outlined"
                    margin="dense"
                    value={currentPose ? currentPose.name : ""}
                    onChange={(event) => {
                      const newPose = {
                        id: currentPose.id,
                        name: event.target.value,
                        speed: currentPose.speed,
                        pause: currentPose.pause,
                        joints: currentPose.joints,
                      };
                      updatePosesData(newPose);
                    }}
                    style={{ margin: 3, marginTop: 20, width: "40%" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    id="pose-speed"
                    label="Speed"
                    variant="outlined"
                    margin="dense"
                    type="number"
                    value={currentPose ? currentPose.speed : ""}
                    onChange={(event) => {
                      const newPose = {
                        id: currentPose.id,
                        name: currentPose.name,
                        speed: event.target.value,
                        pause: currentPose.pause,
                        joints: currentPose.joints,
                      };
                      updatePosesData(newPose);
                    }}
                    style={{ margin: 3, marginTop: 20, width: "25%" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    id="pose-pause"
                    label="Pause"
                    variant="outlined"
                    margin="dense"
                    type="number"
                    value={currentPose ? currentPose.pause : ""}
                    onChange={(event) => {
                      const newPose = {
                        id: currentPose.id,
                        name: currentPose.name,
                        speed: currentPose.speed,
                        pause: event.target.value,
                        joints: currentPose.joints,
                      };
                      updatePosesData(newPose);
                    }}
                    style={{ margin: 3, marginTop: 20, width: "25%" }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </CardContent>
              </Card>
              <div style={{ marginTop: 10, marginBottom: -10 }}>
                <ClientProvider
                  serviceType="akushon_interfaces/srv/RunAction"
                  serviceName="/action/run_action"
                >
                  <RunActionButton />
                </ClientProvider>
                <Button
                  style={{ marginLeft: 8 }}
                  variant="contained"
                  color="default"
                  className="button"
                  startIcon={<AddIcon />}
                >
                  Add Action
                </Button>
              </div>
            </Grid>

            <Grid item xs={12} lg={3}>
              <div style={{ height: 680, width: "100%" }}>
                <DataGrid
                  rows={jointPoseData}
                  columns={jointPoseColumns}
                  rowHeight={25}
                  onCellEditCommit={(event) => {
                    const index = jointPoseData.findIndex(
                      (joint) => joint.id === event.id
                    );
                    const newJoints = {
                      id: jointPoseData[index].id,
                      name: jointPoseData[index].name,
                      pose_pos: event.value,
                    };
                    updateJointPoseData(newJoints, index);
                  }}
                  disableColumnMenu
                  onStateChange={(event) => {
                    setJointSelected(event.state.selection);
                  }}
                  checkboxSelection
                  rowsPerPageOptions={[]}
                />
              </div>
              <div style={{ marginTop: 10, float: "right" }}>
                <PublisherProvider
                  messageType="tachimawari_interfaces/msg/SetJoints"
                  topicName="/joint/set_joints"
                >
                  <SetJointsButton typeButton="to_robot" />
                </PublisherProvider>
              </div>
            </Grid>
            <Grid item xs={6} lg={3}>
              <div style={{ height: 680, width: "100%" }}>
                <PublisherProvider
                  messageType="tachimawari_interfaces/msg/SetJoints"
                  topicName="/joint/set_joints"
                >
                  <SetJointsOnCellEdit />
                </PublisherProvider>
                <SubscriptionProvider
                  messageType="tachimawari_interfaces/msg/CurrentJoints"
                  topicName="/joint/current_joints"
                  callback={subscriptionCurrentJointsCallback}
                >
                </SubscriptionProvider>
              </div>
              <div style={{ marginTop: 10, float: "left" }}>
                <Button
                  variant="contained"
                  color="default"
                  className="button"
                  startIcon={<ArrowBackIcon />}
                  onClick={setJointRobotToPoseData}
                />
                <PublisherProvider
                  messageType="tachimawari_interfaces/msg/SetTorques"
                  topicName="/joint/set_torques"
                >
                  <SetTorquesButton />
                </PublisherProvider>
              </div>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </NodeProvider>
  );
}

export default ActionManager;
