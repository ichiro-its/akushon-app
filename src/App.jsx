/* eslint no-unused-vars: ["error", { "args": "none" }] */
import React from "react";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import MuiAppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
import MuiToolbar from "@material-ui/core/Toolbar";
import MuiTypography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import AddIcon from "@material-ui/icons/Add";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import Input from "./components/Input";
import ActionTable from "./components/ActionTable";
import PoseTable from "./components/PoseTable";
import JointTable from "./components/JointTable";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const actionData = [
  { id: 1, name: "action_1", next: 0 },
  { id: 2, name: "action_2", next: 0 },
  { id: 3, name: "action_3", next: 0 },
  { id: 4, name: "action_4", next: 0 },
  { id: 5, name: "action_5", next: 0 },
  { id: 6, name: "action_6", next: 0 },
  { id: 7, name: "action_7", next: 0 },
  { id: 8, name: "action_8", next: 0 },
  { id: 9, name: "action_9", next: 0 },
  { id: 10, name: "action_10", next: 0 },
];

const poseData = [
  { name: "pose_1", speed: 0.5, pause: 1.5 },
  { name: "pose_2", speed: 0.5, pause: 1.5 },
  { name: "pose_3", speed: 0.5, pause: 1.5 },
  { name: "pose_4", speed: 0.5, pause: 1.5 },
  { name: "pose_5", speed: 0.5, pause: 1.5 },
];

const jointData = [
  { id: 1, pose_pos: 0, robot_pos: 0 },
  { id: 2, pose_pos: 0, robot_pos: 0 },
  { id: 3, pose_pos: 0, robot_pos: 0 },
  { id: 4, pose_pos: 0, robot_pos: 0 },
  { id: 5, pose_pos: 0, robot_pos: 0 },
  { id: 6, pose_pos: 0, robot_pos: 0 },
  { id: 7, pose_pos: 0, robot_pos: 0 },
  { id: 8, pose_pos: 0, robot_pos: 0 },
  { id: 9, pose_pos: 0, robot_pos: 0 },
  { id: 10, pose_pos: 0, robot_pos: 0 },
  { id: 11, pose_pos: 0, robot_pos: 0 },
  { id: 12, pose_pos: 0, robot_pos: 0 },
  { id: 13, pose_pos: 0, robot_pos: 0 },
  { id: 14, pose_pos: 0, robot_pos: 0 },
  { id: 15, pose_pos: 0, robot_pos: 0 },
  { id: 16, pose_pos: 0, robot_pos: 0 },
  { id: 17, pose_pos: 0, robot_pos: 0 },
  { id: 18, pose_pos: 0, robot_pos: 0 },
  { id: 19, pose_pos: 0, robot_pos: 0 },
  { id: 20, pose_pos: 0, robot_pos: 0 },
];

function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <MuiAppBar position="static">
        <MuiToolbar>
          <MuiTypography variant="h6">Akushon App</MuiTypography>
        </MuiToolbar>
      </MuiAppBar>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <ActionTable rows={actionData} />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Card>
                <CardContent>
                  <MuiTypography variant="subtitle1">Action</MuiTypography>
                  <div style={{ marginBottom: 10 }}>
                    <Input id="action-name" label="Name" width="60%" />
                    <Input id="action-next" label="Next" width="30%" />
                  </div>

                  {/* <MUIDataTable
                    title="Pose List"
                    data={poseData}
                    columns={poseColumns}
                    options={poseOptions}
                  /> */}
                  <PoseTable rows={poseData} />

                  <div style={{ marginTop: 10, marginBottom: -10 }}>
                    <Button
                      variant="contained"
                      style={{ background: "#11cb5f" }}
                      color="primary"
                      className={classes.button}
                      startIcon={<AddIcon />}
                    >
                      Add
                    </Button>
                    <Button
                      variant="contained"
                      color="default"
                      className={classes.button}
                      startIcon={<ArrowUpwardIcon />}
                    >
                      Up
                    </Button>
                    <Button
                      variant="contained"
                      color="default"
                      className={classes.button}
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
            <Grid item xs={12} lg={4}>
              <JointTable rows={jointData} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
