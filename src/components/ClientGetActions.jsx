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
  useClient,
  useHandleProcess,
  useLogger,
} from "kumo-app";

import React, { useState } from "react";

const actionColumns = [
  {
    field: "name",
    headerName: "Name",
    width: 200,
    sortable: false,
  },
  {
    field: "next",
    headerName: "Next",
    width: 180,
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

function ActionManagerForm() {
  const jointRobotData = initJointRobotData;

  const client = useClient();
  const logger = useLogger();

  const [test, setTest] = useState("");
  const [result, setResult] = useState("");
  const [actionsData, setActionsData] = useState([]);
  const [posesData, setPosesData] = useState([]);
  const [jointPoseData, setJointPoseData] = useState([]);
  const [currentAction, setCurrentAction] = useState({});
  const [currentPose, setCurrentPose] = useState({});

  const [calling, handleCall] = useHandleProcess(() => {
    setTest("request for actions list");
    return client
      .call({ test })
      .then((response) => {
        const rawActionsData = JSON.parse(`${response.json}`);

        let idCounter = -1;
        Object.keys(rawActionsData).forEach((key) => {
          idCounter += 1;
          setActionsData((data) => [
            ...data,
            {
              id: idCounter,
              name: rawActionsData[key].name,
              next: rawActionsData[key].next_action,
              poses: rawActionsData[key].poses,
            },
          ]);
        });
        setResult(`${response.json}`);
      })
      .catch((err) => {
        logger.error(`Failed to call data! ${err.message}.`);
      });
  }, 500);

  const handleClickedAction = (event) => {
    setCurrentAction(event.row);

    const currentPoses = actionsData[event.row.id].poses;

    setPosesData([]);

    for (let i = 0; i < currentPoses.length; i += 1) {
      setPosesData((data) => [
        ...data,
        {
          id: i,
          name: currentPoses[i].pose_name,
          speed: currentPoses[i].pose_speed,
          pause: currentPoses[i].pose_pause,
          joints: currentPoses[i].pose_joints,
        },
      ]);
    }

    console.log(actionsData[event.row.id].poses);
  };

  const handleClickedPose = (event) => {
    setCurrentPose(posesData[event.row.id]);
    setJointPoseData([]);

    let idCounter = 100;
    const currentJointPoseData = [];
    Object.keys(posesData[event.row.id].joints).forEach((key) => {
      idCounter += 1;
      currentJointPoseData.push({
        id: idCounter,
        name: key,
        pose_pos: posesData[event.row.id].joints[key],
      });
    });
    setJointPoseData(currentJointPoseData);
  };

  const updatePosesData = (newPose) => {
    const newPosesData = [];
    for (let i = 0; i < posesData.length; i += 1) {
      if (i === newPose.id) {
        newPosesData.push(newPose);
      } 
      else {
        newPosesData.push(posesData[i]);
      }
    }
    setPosesData(newPosesData);
    // console.log(posesData[newPose.id]);
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
                // checkboxSelection
                // disableSelectionOnClick
              />
            </div>
            <div style={{ marginTop: 10 }}>
              <Button
                variant="contained"
                style={{ background: "#11cb5f" }}
                color="primary"
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
                    // checkboxSelection
                    // disableSelectionOnClick
                  />
                </div>

                <div style={{ marginTop: 10, marginBottom: -10 }}>
                  <Button
                    variant="contained"
                    style={{ background: "#11cb5f" }}
                    color="primary"
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
                    setCurrentPose(newPose);
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
                    setCurrentPose({
                      id: currentPose.id,
                      name: currentPose.name,
                      speed: event.target.value,
                      pause: currentPose.pause,
                      joints: currentPose.joints,
                    });
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
                    setCurrentPose({
                      id: currentPose.id,
                      name: currentPose.name,
                      speed: currentPose.speed,
                      pause: event.target.value,
                      joints: currentPose.joints,
                    });
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
                disableColumnMenu
                rowsPerPageOptions={[]}
                // checkboxSelection
                // disableSelectionOnClick
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
              {/* <ToggleButton
                value="check"
                // selected={selected}
                // onChange={() => {
                //   setSelected(!selected);
                // }}
              >
                <CheckIcon />
              </ToggleButton> */}
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
                // checkboxSelection
                disableColumnMenu
                rowsPerPageOptions={[]}
                // disableSelectionOnClick
              />
            </div>
          </Grid>
        </Grid>
        <Grid container spacing={2} style={{ marginTop: 20 }}>
          <Grid item xs={12}>
            <TextField
              label="Response"
              value={result}
              variant="outlined"
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={handleCall}
              disabled={client === null || calling}
              color="primary"
              variant="contained"
              fullWidth
            >
              {calling ? <CircularProgress size={24} /> : "Call"}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

function ClientGetActions() {
  return (
    <NodeProvider nodeName="action_client">
      <ClientProvider
        serviceType="akushon_interfaces/srv/Action"
        serviceName="/get_actions"
      >
        <ActionManagerForm />
      </ClientProvider>
    </NodeProvider>
  );
}

export default ClientGetActions;
