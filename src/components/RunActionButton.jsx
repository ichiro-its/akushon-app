import { Button, CircularProgress } from "@material-ui/core";

import { useClient, useHandleProcess, useLogger } from "kumo-app";

import React, { useContext } from "react";

import ActionContext from "../context/ActionContext";

function RunActionButton() {
  const client = useClient();
  const logger = useLogger();

  const { currentAction } = useContext(ActionContext);

  const [calling, handleCall] = useHandleProcess(() => {
    const fixedPoses = [];
    const rawPoses = currentAction.poses;

    if (Object.keys(currentAction).length === 0) {
      logger.warn(`No current action selected.`);
      return client;
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
    return client
      .call({ control_type, action_name, json })
      .then((response) => {
        logger.success(
          `Successfully publish actions data with status ${response.status}.`
        );
      })
      .catch((err) => {
        logger.error(`Failed to publish data! ${err.message}.`);
      });
  }, 500);

  return (
    <Button
      onClick={handleCall}
      disabled={client == null || calling}
      color="primary"
      variant="contained"
    >
      {calling ? <CircularProgress size={24} /> : "Play Action"}
    </Button>
  );
}

export default RunActionButton;
