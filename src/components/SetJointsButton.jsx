import React, { useContext } from "react";

import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PropTypes from "prop-types";
import { Button, CircularProgress } from "@material-ui/core";

import akushon_interfaces from "../proto/akushon_grpc_web_pb";

import ActionContext from "../context/ActionContext";

function SetJointsButton(props) {
  const client = new akushon_interfaces.ConfigClient(import.meta.env.VITE_GRPC_WEB_API_URL, null, null);
  const message = new akushon_interfaces.SetJointsData();

  const { typeButton } = props;

  const { setJointRobotData, jointPoseData } = useContext(ActionContext);

  const handlePublish = () => {
    const joints = [];

    if (typeButton === "to_robot") {
      console.log(`Change the joint robot data...`);
      const newJointRobotData = [];
      for (let i = 0; i < jointPoseData.length; i += 1) {
        newJointRobotData.push({
          id: jointPoseData[i].id,
          name: jointPoseData[i].name,
          pose_pos: jointPoseData[i].pose_pos,
          status: "ON",
        });
      }
      setJointRobotData(newJointRobotData);
    }

    for (let i = 0; i < jointPoseData.length; i += 1) {
      joints.push({
        id: jointPoseData[i].id,
        position: jointPoseData[i].pose_pos,
      });
    }

    const control_type = 3;

    message.setJointsData = JSON.stringify(joints);
    message.setControlType = control_type;

    client.publishSetJoints(message, {}, (err) => {
      if (err) {
        console.log(`Unexpected error: code = ${err.code}` + `, message = "${err.message}"`);
      }
    });
  };

  return (
    <Button
      onClick={handlePublish}
      color={typeButton === "to_robot" ? "default" : "primary"}
      variant="contained"
      startIcon={
        typeButton === "to_robot" ? <ArrowForwardIcon /> : <PlayArrowIcon />
      }
    >
    </Button>
  );
}

SetJointsButton.propTypes = {
  typeButton: PropTypes.string.isRequired,
};

export default SetJointsButton;
