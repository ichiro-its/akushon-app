import React, { useContext } from "react";
import { DataGrid } from "@material-ui/data-grid";

import akushon_interfaces from "../proto/akushon_grpc_web_pb";

import ActionContext from "../context/ActionContext";

const jointRobotColumns = [
  {
    field: "id",
    headerName: "Id",
    width: 50,
    type: "number",
    sortable: false,
    editable: false,
  },
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
  const { setJointRobotData, jointRobotData, setJointSelected, GRPC_WEB_API_URL } =
    useContext(ActionContext);
  
  const client = new akushon_interfaces.ConfigClient(GRPC_WEB_API_URL, null, null);
  const message = new akushon_interfaces.SetJointsData();

  const updateJointRobotData = (newJoints, index) => {
    const newJointRobotData = [
      ...jointRobotData.slice(0, index),
      newJoints,
      ...jointRobotData.slice(index + 1),
    ];
    setJointRobotData(newJointRobotData);
  };

  const handlePublish = () => {
    const joints = [];

    for (let i = 0; i < jointRobotData.length; i += 1) {
      joints.push({
        id: jointRobotData[i].id,
        position: jointRobotData[i].pose_pos,
      });
    }

    const json = JSON.stringify(joints);

    message.setControlType(3);
    message.setJointsActions(json);

    client.publishSetJoints(message, {}, (err) => {
      if (err) {
        console.error(`Unexpected error: code = ${err.code}` + `, message = "${err.message}"`);
      }
    });
  };

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
          status: jointRobotData[index].status,
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
