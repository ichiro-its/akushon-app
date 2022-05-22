import { Button, CircularProgress } from "@material-ui/core";

import { usePublisher, useHandleProcess, useLogger } from "kumo-app";

import React, { useContext } from "react";

import ActionContext from "../context/ActionContext";

function RunActionButton() {
  const publisher = usePublisher();
  const logger = useLogger();

  const { currentAction } = useContext(ActionContext);

  const [publishing, handlePublish] = useHandleProcess(() => {
    const fixedPoses = [];
    const rawPoses = currentAction.poses;

    if (Object.keys(currentAction).length === 0) {
      logger.warn(`No current action selected.`);
      return publisher;
    }

    for (let i = 0; i < rawPoses.length; i += 1) {
      const jointsData = {};
      for (let j = 0; j < rawPoses[i].joints.length; j += 1) {
        jointsData[rawPoses[i].joints[j].name] = rawPoses[i].joints[j].pose_pos;
      }
      fixedPoses.push({
        name: rawPoses[i].name,
        pause: rawPoses[i].pause,
        speed: rawPoses[i].speed,
        joints: jointsData,
      });
    }
    const rawAction = {
      name: currentAction.name,
      next: currentAction.next,
      start_delay: currentAction.start_delay,
      stop_delay: currentAction.stop_delay,
      poses: fixedPoses,
    };

    const control_type = 1;
    const action_name = "akushon_app_action";
    const json = JSON.stringify(rawAction);
    return publisher
      .publish({ control_type, action_name, json })
      .then(() => {
        logger.success(`Successfully publish actions data to run action.`);
      })
      .catch((err) => {
        logger.error(`Failed to publish data! ${err.message}.`);
      });
  }, 500);

  return (
    <Button
      onClick={handlePublish}
      disabled={publisher == null || publishing}
      color="primary"
      variant="contained"
    >
      {publishing ? <CircularProgress size={24} /> : "Play Action"}
    </Button>
  );
}

export default RunActionButton;
