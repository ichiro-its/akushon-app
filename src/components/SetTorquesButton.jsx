import React, { useState, useContext, useEffect } from "react";

import { Button, CircularProgress, Grid } from "@material-ui/core";
import WbIncandescentRoundedIcon from "@material-ui/icons/WbIncandescentRounded";
import WbIncandescentOutlinedIcon from "@material-ui/icons/WbIncandescentOutlined";

import akushon_interfaces from "../proto/akushon_grpc_web_pb";

import ActionContext from "../context/ActionContext";

function SetTorquesButton() {
  const client = new akushon_interfaces.ConfigClient(`${import.meta.env.GRPC_WEB_API_URL}`, null, null);
  const message = new akushon_interfaces.SetTorquesData();

  const { jointSelected, setJointRobotData, jointRobotData } =
    useContext(ActionContext);

  let newJointRobotData = jointRobotData;
  const [isTorquesEnabled, setIsTorquesEnabled] = useState(true);
  const [isTorquesChanged, setIsTorquesChanged] = useState(false);
  const [onTorquesClicked, setOnTorquesClicked] = useState(false);
  const [offTorquesClicked, setOffTorquesClicked] = useState(false);

  const handlePublish = () => {
    const ids = jointSelected;
    const torque_enable = isTorquesEnabled;
    setOffTorquesClicked(false);
    setOnTorquesClicked(false);
    if (ids.length === 0) {
      console.log(
        `No selected joints. Select some joint first to be set on/off.`
      );
      return client;
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

    message.setIds(ids);
    message.setTorqueEnable(torque_enable);

    client.publishSetTorques(message, {}, (err) => {
      if (err) {
        console.log(`Unexpected error: code = ${err.code}` + `, message = "${err.message}"`);
      }
    });
  };

  useEffect(() => {
    handlePublish();
    setIsTorquesChanged(false);
  }, [isTorquesChanged]);

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
