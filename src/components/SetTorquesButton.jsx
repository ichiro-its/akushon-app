import { CircularProgress, FormControlLabel, Switch } from "@material-ui/core";

import { useHandleProcess, useLogger, usePublisher } from "kumo-app";

import React, { useState, useContext, useEffect } from "react";

import ActionContext from "../context/ActionContext";

function SetTorquesButton() {
  const publisher = usePublisher();
  const logger = useLogger();

  const { jointSelected } = useContext(ActionContext);

  const [state, setState] = useState(true);
  const [changed, setChanged] = useState(false);

  const [publishing, handlePublish] = useHandleProcess(() => {
    const ids = jointSelected;
    const torque_enable = state;
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

  const handleChange = (event) => {
    setState(event.target.checked);
    setChanged(true);
  };

  return (
    <FormControlLabel
      style={{ marginTop: -4, marginLeft: 10 }}
      control={
        publishing ? (
          <CircularProgress size={24} />
        ) : (
          <Switch
            checked={state}
            onChange={handleChange}
            name="checked"
            color="primary"
            aria-label="torque"
          />
        )
      }
      label="On Torques"
      fullwidth="true"
    />
  );
}

export default SetTorquesButton;
