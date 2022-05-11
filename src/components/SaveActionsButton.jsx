import { Button, CircularProgress } from "@material-ui/core";

import { useClient, useHandleProcess, useLogger } from "kumo-app";

import React, { useContext } from "react";

import ActionContext from "../context/ActionContext";

function SaveActionsButton() {
  const client = useClient();
  const logger = useLogger();

  const { actionsData } = useContext(ActionContext);

  const [calling, handleCall] = useHandleProcess(() => {
    const jsonActionsData = actionsData;
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
          pause: parseFloat(rawPoses[i].pause),
          speed: parseFloat(rawPoses[i].speed),
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
    if (actionsData.length === 0) {
      logger.warn(`No actions data. Call the actions data first.`);
      return client;
    }
    return client
      .call({ json })
      .then((response) => {
        logger.success(
          `Successfully send actions data with status ${response.status}.`
        );
      })
      .catch((err) => {
        logger.error(`Failed to send data! ${err.message}.`);
      });
  }, 500);

  return (
    <Button
      onClick={handleCall}
      style={{
        background: "#11cb5f",
        marginLeft: 8,
        paddingLeft: 16,
        paddingRight: 16,
      }}
      disabled={client == null || calling}
      color="primary"
      variant="contained"
    >
      {calling ? <CircularProgress size={24} /> : "Save"}
    </Button>
  );
}

export default SaveActionsButton;
