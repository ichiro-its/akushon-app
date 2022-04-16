import { Button, CircularProgress, Grid } from "@material-ui/core";
import WbIncandescentRoundedIcon from "@material-ui/icons/WbIncandescentRounded";
import WbIncandescentOutlinedIcon from "@material-ui/icons/WbIncandescentOutlined";

import { useHandleProcess, useLogger, usePublisher } from "kumo-app";

import React, { useState, useContext, useEffect } from "react";

import ActionContext from "../context/ActionContext";

function SetTorquesButton() {
  const publisher = usePublisher();
  const logger = useLogger();

  const { jointSelected, setJointRobotData, jointRobotData } =
    useContext(ActionContext);

  var newJointRobotData = jointRobotData;
  const [isTorquesEnabled, setIsTorquesEnabled] = useState(true);
  const [isTorquesChanged, setIsTorquesChanged] = useState(false);
  const [onTorquesClicked, setOnTorquesClicked] = useState(false);
  const [offTorquesClicked, setOffTorquesClicked] = useState(false);

  const [publishing, handlePublish] = useHandleProcess(() => {
    const ids = jointSelected;
    const torque_enable = isTorquesEnabled;
    setOffTorquesClicked(false);
    setOnTorquesClicked(false);
    if (ids.length === 0) {
      logger.warn(
        `No selected joints. Select some joint first to be set on/off.`
      );
      return publisher;
    }

    for (let i = 0; i < ids.length; i += 1) {
      const index = jointRobotData.findIndex((joint) => joint.id === ids[i]);
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

    if (publishing) {
      logger.info(`Set torques ${torque_enable}, ids: ${ids}...`);
    }
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
    if (isTorquesChanged) {
      handlePublish();
      setIsTorquesChanged(false);
    }
  });

  const handleOnTorquesClicked = () => {
    setIsTorquesEnabled(true);
    setOnTorquesClicked(true);
    setIsTorquesChanged(true);
  };

  const handleOffTorquesClicked = () => {
    setIsTorquesEnabled(false);
    setOffTorquesClicked(true);
    setIsTorquesChanged(true);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <Button
          style={{ marginLeft: 20 }}
          onClick={handleOnTorquesClicked}
          color="primary"
          variant={onTorquesClicked ? "outlined" : "contained"}
          startIcon={<WbIncandescentRoundedIcon />}
        >
          {onTorquesClicked ? <CircularProgress size={24} /> : "ON"}
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button
          style={{ marginLeft: 20 }}
          onClick={handleOffTorquesClicked}
          color="default"
          variant={offTorquesClicked ? "outlined" : "contained"}
          startIcon={<WbIncandescentOutlinedIcon />}
        >
          {offTorquesClicked ? <CircularProgress size={24} /> : "OFF"}
        </Button>
      </Grid>
    </Grid>
  );
}

export default SetTorquesButton;
