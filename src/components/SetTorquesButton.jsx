import { Button, CircularProgress, Grid } from "@material-ui/core";
import WbIncandescentRoundedIcon from "@material-ui/icons/WbIncandescentRounded";
import WbIncandescentOutlinedIcon from "@material-ui/icons/WbIncandescentOutlined";

import { useHandleProcess, useLogger, usePublisher } from "kumo-app";

import React, { useState, useContext, useEffect } from "react";

import ActionContext from "../context/ActionContext";

function SetTorquesButton() {
  const publisher = usePublisher();
  const logger = useLogger();

  const { jointSelected, setJointRobotData, jointRobotData } = useContext(ActionContext);

  const [state, setState] = useState(true);
  const [changed, setChanged] = useState(false);
  const [on, setOn] = useState(false);
  const [off, setOff] = useState(false);

  const [publishing, handlePublish] = useHandleProcess(() => {
    const ids = jointSelected;
    const torque_enable = state;
    setOff(false);
    setOn(false);
    if (ids.length === 0) {
      logger.warn(
        `No selected joints. Select some joint first to be set on/off.`
      );
      return publisher;
    } else {
      var newJointRobotData = jointRobotData;
      for (let i = 0; i < ids.length; i += 1) {
        const index = jointRobotData.findIndex(
          (joint) => joint.id === ids[i]
        );
        const newJoint = {
          id: jointRobotData[index].id,
          name: jointRobotData[index].name,
          pose_pos: jointRobotData[index].pose_pos,
          status: torque_enable ? "ON" : "OFF",
        };
        newJointRobotData = [
          ...newJointRobotData.slice(0, index),
          newJoint,
          ...newJointRobotData.slice(index + 1),
        ];
      }
      setJointRobotData(newJointRobotData);
    }

    logger.info(`Set torques ${torque_enable}, ids: ${ids}.`);
    return publisher
      .publish({ ids, torque_enable })
      .then(() => {
        logger.success(`Successfully publish set torques.`);
      })
      .catch((err) => {
        logger.error(`Failed to publish set torques data! ${err.message}.`);
      });
  }, 500);

  useEffect(() => {
    if (changed) {
      handlePublish();
      setChanged(false);
    }
  });

  const onTorques = () => {
    setState(true);
    setOn(true);
    setChanged(true);
  };

  const offTorques = () => {
    setState(false);
    setOff(true);
    setChanged(true);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <Button
          style={{ marginLeft: 20 }}
          onClick={onTorques}
          color="primary"
          variant={on ? "outlined" : "contained"}
          startIcon={<WbIncandescentRoundedIcon />}
          >
          {on ? <CircularProgress size={24} /> : "ON"}
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button
          style={{ marginLeft: 20 }}
          onClick={offTorques}
          color="default"
          variant={off ? "outlined" : "contained"}
          startIcon={<WbIncandescentOutlinedIcon />}
        >
          {off ? <CircularProgress size={24} /> : "OFF"}
        </Button>
      </Grid>
    </Grid>
  );
}

export default SetTorquesButton;
