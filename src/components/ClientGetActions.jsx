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

import Input from "./Input";

const actionColumns = [
  {
    field: "id",
    headerName: "#",
    width: 15,
    editable: true,
    sortable: false,
  },
  {
    field: "name",
    headerName: "Name",
    width: 170,
    editable: true,
    sortable: false,
  },
  {
    field: "next",
    headerName: "Next",
    width: 90,
    type: "number",
    editable: true,
    sortable: false,
  },
];

const initPoseData = [
  { id: 1, name: "pose_1", speed: 0.5, pause: 1.5 },
  { id: 2, name: "pose_2", speed: 0.5, pause: 1.5 },
  { id: 3, name: "pose_3", speed: 0.5, pause: 1.5 },
  { id: 4, name: "pose_4", speed: 0.5, pause: 1.5 },
  { id: 5, name: "pose_5", speed: 0.5, pause: 1.5 },
];

const poseColumns = [
  {
    field: "name",
    headerName: "Name",
    width: 125,
    editable: true,
    sortable: false,
  },
  {
    field: "speed",
    headerName: "Speed",
    width: 125,
    type: "number",
    editable: true,
    sortable: false,
  },
  {
    field: "pause",
    headerName: "Pause",
    width: 125,
    type: "number",
    editable: true,
    sortable: false,
  },
];

const initJointPoseData = [
  { id: 1, pose_pos: 0 },
  { id: 2, pose_pos: 0 },
  { id: 3, pose_pos: 0 },
  { id: 4, pose_pos: 0 },
  { id: 5, pose_pos: 0 },
  { id: 6, pose_pos: 0 },
  { id: 7, pose_pos: 0 },
  { id: 8, pose_pos: 0 },
  { id: 9, pose_pos: 0 },
  { id: 10, pose_pos: 0 },
  { id: 11, pose_pos: 0 },
  { id: 12, pose_pos: 0 },
  { id: 13, pose_pos: 0 },
  { id: 14, pose_pos: 0 },
  { id: 15, pose_pos: 0 },
  { id: 16, pose_pos: 0 },
  { id: 17, pose_pos: 0 },
  { id: 18, pose_pos: 0 },
  { id: 19, pose_pos: 0 },
  { id: 20, pose_pos: 0 },
];

const initJointRobotData = [
  { id: 1, robot_pos: 0 },
  { id: 2, robot_pos: 0 },
  { id: 3, robot_pos: 0 },
  { id: 4, robot_pos: 0 },
  { id: 5, robot_pos: 0 },
  { id: 6, robot_pos: 0 },
  { id: 7, robot_pos: 0 },
  { id: 8, robot_pos: 0 },
  { id: 9, robot_pos: 0 },
  { id: 10, robot_pos: 0 },
  { id: 11, robot_pos: 0 },
  { id: 12, robot_pos: 0 },
  { id: 13, robot_pos: 0 },
  { id: 14, robot_pos: 0 },
  { id: 15, robot_pos: 0 },
  { id: 16, robot_pos: 0 },
  { id: 17, robot_pos: 0 },
  { id: 18, robot_pos: 0 },
  { id: 19, robot_pos: 0 },
  { id: 20, robot_pos: 0 },
];

const jointPoseColumns = [
  { field: "id", headerName: "ID", width: 15, sortable: false },
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
  { field: "id", headerName: "ID", width: 15, sortable: false },
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
  const poseData = initPoseData;
  const jointPoseData = initJointPoseData;
  const jointRobotData = initJointRobotData;

  const client = useClient();
  const logger = useLogger();

  const [test, setTest] = useState("");
  const [result, setResult] = useState("");
  const [actionData, setActionData] = useState([]);

  const [calling, handleCall] = useHandleProcess(() => {
    setTest("request for actions list");
    return client
      .call({ test })
      .then((response) => {
        const actionsData = JSON.parse(`${response.json}`);

        let idCounter = 0;
        Object.keys(actionsData).forEach((key) => {
          idCounter += 1;
          setActionData((data) => [
            ...data,
            {
              id: idCounter,
              name: actionsData[key].name,
              next: actionsData[key].next_action,
            },
          ]);
        });
        setResult(actionsData.action_left_kick.name);
      })
      .catch((err) => {
        logger.error(`Failed to call data! ${err.message}.`);
      });
  }, 500);

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <div style={{ height: 640, width: "100%" }}>
              <DataGrid
                rows={actionData}
                columns={actionColumns}
                rowHeight={32}
                disableColumnMenu
                rowsPerPageOptions={[]}
                // checkboxSelection
                // disableSelectionOnClick
              />
            </div>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <CardContent>
                <MuiTypography variant="subtitle1">Action</MuiTypography>
                <div style={{ marginBottom: 10 }}>
                  <Input id="action-name" label="Name" width="60%" />
                  <Input id="action-next" label="Next" width="30%" />
                </div>
                <div style={{ height: 300, width: "100%" }}>
                  <DataGrid
                    rows={poseData}
                    columns={poseColumns}
                    rowHeight={32}
                    disableColumnMenu
                    rowsPerPageOptions={[]}
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
                    Add
                  </Button>
                  <Button
                    variant="contained"
                    color="default"
                    className="button"
                    startIcon={<ArrowUpwardIcon />}
                  >
                    Up
                  </Button>
                  <Button
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
                <Input id="pose-name" label="Name" width="40%" />
                <Input id="pose-speed" label="Speed" width="25%" />
                <Input id="pose-pause" label="Pause" width="25%" />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} lg={2}>
            <div style={{ height: 640, width: "100%" }}>
              <DataGrid
                rows={jointPoseData}
                columns={jointPoseColumns}
                rowHeight={25}
                checkboxSelection
                disableColumnMenu
                rowsPerPageOptions={[]}
                // disableSelectionOnClick
              />
            </div>
          </Grid>
          <Grid item xs={6} lg={1}>
            <div
              style={{
                margin: "auto",
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
            <div style={{ height: 640, width: "100%" }}>
              <DataGrid
                rows={jointRobotData}
                columns={jointRobotColumns}
                rowHeight={25}
                checkboxSelection
                disableColumnMenu
                rowsPerPageOptions={[]}
                // disableSelectionOnClick
              />
            </div>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
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
