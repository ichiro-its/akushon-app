import AddIcon from "@material-ui/icons/Add";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ToggleOffIcon from "@material-ui/icons/ToggleOff";
import { DataGrid } from "@material-ui/data-grid";
import MuiTypography from "@material-ui/core/Typography";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  TextField,
} from "@material-ui/core";

import {
  ClientProvider,
  NodeProvider,
  PublisherProvider,
  useClient,
  useHandleProcess,
  useLogger,
  usePublisher,
} from "kumo-app";

import React, { useState } from "react";

const actionColumns = [
  {
    field: "name",
    headerName: "Name",
    width: 125,
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
    width: 60,
    sortable: false,
  },
  {
    field: "stop_delay",
    headerName: "Stop Delay",
    width: 60,
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

const initJointRobotData = [
  { id: 0, name: "left_shoulder", robot_pos: 0 },
  { id: 1, name: "right_shoulder", robot_pos: 0 },
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

const jointRobotColumns = [
  { field: "name", headerName: "Name", width: 140, sortable: false },
  {
    field: "robot_pos",
    headerName: "Robot Pos",
    width: 100,
    type: "number",
    editable: true,
    sortable: false,
  },
];

let rawActionsDataGlobal = [];

function ActionManagerForm() {
  const jointRobotData = initJointRobotData;

  const client = useClient();
  const logger = useLogger();

  const [test, setTest] = useState("");
  const [actionsData, setActionsData] = useState([]);
  const [posesData, setPosesData] = useState([]);
  const [jointPoseData, setJointPoseData] = useState([]);
  const [currentAction, setCurrentAction] = useState({});
  const [currentPose, setCurrentPose] = useState({});

  const [calling, handleCall] = useHandleProcess(() => {
    setTest("Request for actions list");
    return client
      .call({ test })
      .then((response) => {
        logger.success(`Successfully get actions data`);
        const jsonActionsData = JSON.parse(`${response.json}`);

        let idCounter = -1;
        const rawActions = [];
        Object.keys(jsonActionsData).forEach((key) => {
          idCounter += 1;
          const fixedPoses = [];
          const rawPoses = jsonActionsData[key].poses;
          for (let i = 0; i < rawPoses.length; i += 1) {
            let idJointCounter = -1;
            const jointsData = [];
            Object.keys(rawPoses[i].joints).forEach((index) => {
              idJointCounter += 1;
              jointsData.push({
                id: idJointCounter,
                name: index,
                pose_pos: rawPoses[i].joints[index],
              });
            });
            fixedPoses.push({
              id: i,
              name: rawPoses[i].name,
              speed: rawPoses[i].speed,
              pause: rawPoses[i].pause,
              joints: jointsData,
            });
          }
          rawActions.push({
            id: idCounter,
            name: jsonActionsData[key].name,
            start_delay: jsonActionsData[key].start_delay,
            stop_delay: jsonActionsData[key].stop_delay,
            next: jsonActionsData[key].next,
            poses: fixedPoses,
          });
        });
        setActionsData(rawActions);
        rawActionsDataGlobal = rawActions;
      })
      .catch((err) => {
        logger.error(`Failed to call data! ${err.message}.`);
      });
  }, 500);

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
        id: i,
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
    rawActionsDataGlobal = newActionsData;
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

  const updateJointPoseData = (newJoints) => {
    const newJointPoseData = [
      ...jointPoseData.slice(0, newJoints.id),
      newJoints,
      ...jointPoseData.slice(newJoints.id + 1),
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

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <div style={{ height: 640, width: "100%" }}>
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
              <Button
                style={{ paddingLeft: 32, paddingRight: 32 }}
                onClick={handleCall}
                disabled={client === null || calling}
                color="primary"
                variant="contained"
              >
                {calling ? <CircularProgress size={24} /> : "Call"}
              </Button>
              <Button
                style={{ marginLeft: 8, paddingLeft: 16, paddingRight: 16 }}
                variant="contained"
                color="info"
                className="button"
                startIcon={<AddIcon />}
              >
                Add Action
              </Button>
            </div>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
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
                <div style={{ height: 300, width: "100%" }}>
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
                  <Button
                    variant="contained"
                    color="primary"
                    className="button"
                  >
                    Play
                  </Button>
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
          </Grid>

          <Grid item xs={6} lg={2}>
            <div style={{ height: 680, width: "100%" }}>
              <DataGrid
                rows={jointPoseData}
                columns={jointPoseColumns}
                rowHeight={25}
                onCellEditCommit={(event) => {
                  const newJoints = {
                    id: jointPoseData[event.id].id,
                    name: jointPoseData[event.id].name,
                    pose_pos: event.value,
                  };
                  updateJointPoseData(newJoints);
                }}
                disableColumnMenu
                rowsPerPageOptions={[]}
              />
            </div>
          </Grid>
          <Grid item xs={6} lg={1}>
            <div
              style={{
                paddingTop: "50%",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                color="default"
                className="button"
                startIcon={<ArrowBackIcon />}
              />
              <Button
                variant="contained"
                color="default"
                className="button"
                startIcon={<ArrowForwardIcon />}
              />
              <IconButton aria-label="torque">
                <ToggleOffIcon />
              </IconButton>
            </div>
          </Grid>
          <Grid item xs={6} lg={2}>
            <div style={{ height: 680, width: "100%" }}>
              <DataGrid
                rows={jointRobotData}
                columns={jointRobotColumns}
                rowHeight={25}
                disableColumnMenu
                rowsPerPageOptions={[]}
              />
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

function PublishForm() {
  const publisher = usePublisher();
  const logger = useLogger();

  const [publishing, handlePublish] = useHandleProcess(() => {
    const jsonActionsData = rawActionsDataGlobal;
    const rawActions = {};
    Object.keys(jsonActionsData).forEach((key) => {
      const fixedPoses = [];
      const rawPoses = jsonActionsData[key].poses;
      for (let i = 0; i < rawPoses.length; i += 1) {
        const jointsData = {};
        for (let j = 0; j < rawPoses[i].joints.length; j += 1) {
          jointsData[rawPoses[i].joints[j].name] =
            rawPoses[i].joints[j].pose_pos;
        }
        fixedPoses.push({
          name: rawPoses[i].name,
          pause: rawPoses[i].pause,
          speed: rawPoses[i].speed,
          joints: jointsData,
        });
      }
      const action = {
        name: jsonActionsData[key].name,
        next: jsonActionsData[key].next,
        start_delay: jsonActionsData[key].start_delay,
        stop_delay: jsonActionsData[key].stop_delay,
        poses: fixedPoses,
      };
      rawActions[jsonActionsData[key].name.toLowerCase()] = action;
    });
    const json = JSON.stringify(rawActions);
    return publisher
      .publish({ json })
      .then(() => {
        logger.success(`Successfully publish actions data`);
      })
      .catch((err) => {
        logger.error(`Failed to publish data! ${err.message}.`);
      });
  }, 500);

  return (
    <Card>
      <CardContent>
        <Grid item xs={12}>
          <Button
            onClick={handlePublish}
            style={{ background: "#11cb5f" }}
            disabled={publisher == null || publishing}
            color="primary"
            variant="contained"
            fullWidth
          >
            {publishing ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </Grid>
      </CardContent>
    </Card>
  );
}

function ClientGetActions() {
  return (
    <NodeProvider nodeName="akushon_app">
      <ClientProvider
        serviceType="akushon_interfaces/srv/GetActions"
        serviceName="/get_actions"
      >
        <ActionManagerForm />
      </ClientProvider>
      <PublisherProvider
        messageType="akushon_interfaces/msg/SaveActions"
        topicName="/save_actions"
      >
        <PublishForm />
      </PublisherProvider>
    </NodeProvider>
  );
}

export default ClientGetActions;
