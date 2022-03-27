import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PropTypes from "prop-types";
import { Button, CircularProgress } from "@material-ui/core";

import { useHandleProcess, useLogger, usePublisher } from "kumo-app";

import React, { useContext } from "react";

import ActionContext from "../context/ActionContext";

function SetJointsButton(props) {
  const { typeButton } = props;
  const publisher = usePublisher();
  const logger = useLogger();

  const { jointPoseData } = useContext(ActionContext);

  console.log(jointPoseData);

  const [publishing, handlePublish] = useHandleProcess(() => {
    const joints = [];
    for (let i = 0; i < jointPoseData.length; i += 1) {
      joints.push({
        id: i,
        position: jointPoseData[i].pose_pos,
      });
    }

    const control_type = 3;

    return publisher
      .publish({ control_type, joints })
      .then(() => {
        logger.success(`Successfully publish set joints.`);
      })
      .catch((err) => {
        logger.error(`Failed to publish set joints data! ${err.message}.`);
      });
  }, 500);

  return (
    <Button
      onClick={handlePublish}
      disabled={publisher === null || publishing}
      color={typeButton === "to_robot" ? "default" : "primary"}
      variant="contained"
      startIcon={
        typeButton === "to_robot" ? <ArrowForwardIcon /> : <PlayArrowIcon />
      }
    >
      {publishing ? <CircularProgress size={24} /> : ""}
    </Button>
  );
}

SetJointsButton.propTypes = {
  typeButton: PropTypes.string.isRequired,
};

export default SetJointsButton;
