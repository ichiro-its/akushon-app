import { Button, CircularProgress } from "@material-ui/core";

import { useClient, useHandleProcess, useLogger } from "kumo-app";

import React, { useContext } from "react";

import ActionContext from "../context/ActionContext";

function GetActionsButton() {
  const client = useClient();
  const logger = useLogger();
  const { setActionsData } = useContext(ActionContext);

  const [calling, handleCall] = useHandleProcess(() => {
    console.log("test");
    return client
      .call({})
      .then((response) => {
        logger.success(`Successfully get actions data`);
        const jsonActionsData = JSON.parse(`${response.json}`);

        let idCounter = -1;
        const rawActions = [];
        Object.keys(jsonActionsData).forEach((key) => {
          idCounter += 1;
          const fixedPoses = [];
          const rawPoses = jsonActionsData[key].poses;
          for (let i = 0; i < rawPoses.length; i += 1) {
            let idJointCounter = -1;
            const jointsData = [];
            Object.keys(rawPoses[i].joints).forEach((index) => {
              idJointCounter += 1;
              jointsData.push({
                id: idJointCounter,
                name: index,
                pose_pos: rawPoses[i].joints[index],
              });
            });
            fixedPoses.push({
              id: i,
              name: rawPoses[i].name,
              speed: rawPoses[i].speed,
              pause: rawPoses[i].pause,
              joints: jointsData,
            });
          }
          rawActions.push({
            id: idCounter,
            name: jsonActionsData[key].name,
            start_delay: jsonActionsData[key].start_delay,
            stop_delay: jsonActionsData[key].stop_delay,
            next: jsonActionsData[key].next,
            poses: fixedPoses,
          });
        });
        setActionsData(rawActions);
      })
      .catch((err) => {
        logger.error(`Failed to call data! ${err.message}.`);
      });
  }, 500);

  return (
    <Button
      style={{ paddingLeft: 24, paddingRight: 24, marginLeft: 8 }}
      onClick={handleCall}
      disabled={client === null || calling}
      color="primary"
      variant="contained"
    >
      {calling ? <CircularProgress size={24} /> : "Get Actions"}
    </Button>
  );
}

export default GetActionsButton;
