import React, { useContext } from "react";

import { Button } from "@material-ui/core";

import akushon_interfaces from "../proto/akushon_grpc_web_pb";

import ActionContext from "../context/ActionContext";

function RunActionButton() {
  const client = new akushon_interfaces.ConfigClient(import.meta.env.VITE_GRPC_WEB_API_URL, null, null);
  const message = new akushon_interfaces.ConfigRunAction();

  const { currentAction } = useContext(ActionContext);

  const handlePublish = () => {
    const fixedPoses = [];
    const rawPoses = currentAction.poses;

    if (Object.keys(currentAction).length === 0) {
      console.log(`No current action selected.`);
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

    const json = JSON.stringify(rawAction);

    message.setControlType(1);
    message.setActionName(currentAction.name);
    message.setJsonAction(json);

    client.runAction(message, {}, (err) => {
      if (err) {
        console.log(`Unexpected error: code = ${err.code}` + `, message = "${err.message}"`);
      }
    });
  };

  return (
    <Button
      onClick={handlePublish}
      color="primary"
      variant="contained"
    >
      Play Action
    </Button>
  );
}

export default RunActionButton;
