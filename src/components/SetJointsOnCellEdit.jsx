import { useHandleProcess, useLogger, usePublisher } from "kumo-app";
import { DataGrid } from "@material-ui/data-grid";

import React, { useContext } from "react";

import ActionContext from "../context/ActionContext";

const jointRobotColumns = [
  { field: "name", headerName: "Name", width: 140, sortable: false },
  {
    field: "pose_pos",
    headerName: "Robot Pos",
    width: 100,
    type: "number",
    editable: true,
    sortable: false,
  },
  { field: "status", headerName: "Status", width: 140, sortable: false },
];

function SetJointsOnCellEdit() {
  const publisher = usePublisher();
  const logger = useLogger();

  const { setJointRobotData, jointRobotData, setJointSelected } =
    useContext(ActionContext);

  const updateJointRobotData = (newJoints, index) => {
    const newJointRobotData = [
      ...jointRobotData.slice(0, index),
      newJoints,
      ...jointRobotData.slice(index + 1),
    ];
    setJointRobotData(newJointRobotData);
    logger.success("Send data directly to robot!"); // to do(finesaaa): change DataGrid JointRobot to component itself with SetJointPublisher
  };

  const [publishing, handlePublish] = useHandleProcess(() => {
    const joints = [];

    for (let i = 0; i < jointRobotData.length; i += 1) {
      joints.push({
        id: jointRobotData[i].id,
        position: jointRobotData[i].pose_pos,
      });
    }

    const control_type = 3;

    return publisher
      .publish({ control_type, joints })
      .then(() => {
        logger.success(`Successfully publish set joints robot.`);
      })
      .catch((err) => {
        logger.error(`Failed to publish set joints robot! ${err.message}.`);
      });
  }, 500);

  if (publishing) {
    console.log("Publishing...");
  }

  return (
    <DataGrid
      rows={jointRobotData}
      columns={jointRobotColumns}
      rowHeight={25}
      onCellEditCommit={(event) => {
        const index = jointRobotData.findIndex(
          (joint) => joint.id === event.id
        );
        const newJoints = {
          id: jointRobotData[index].id,
          name: jointRobotData[index].name,
          pose_pos: event.value,
          status: "ON",
        };
        updateJointRobotData(newJoints, index);
        handlePublish();
      }}
      disableColumnMenu
      onStateChange={(event) => {
        setJointSelected(event.state.selection);
      }}
      checkboxSelection
      rowsPerPageOptions={[]}
    />
  );
}

export default SetJointsOnCellEdit;
