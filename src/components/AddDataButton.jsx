import React, { useContext } from "react";

import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import ActionContext from "../context/ActionContext";

function AddDataButton(props) {
  const { actionsData, posesData, setPosesData, setActionsData } = useContext(ActionContext);
  const typeData = props.typeData;

  const handleClick = () => {
    if (actionsData.length === 0) {
      alert("Please get the actions data first.");
      return;
    }

    if (typeData === "action") {
      const newAction = {
        id: actionsData.length + 1,
        name: "New Action",
        next: "",
        start_delay: 0,
        stop_delay: 0,
        poses: [],
      };

      setActionsData((prevActionsData) => [...prevActionsData, newAction]);

      console.log(`Add new action`);
    }
    else if (typeData === "pose") {
      const newPose = {
        id: posesData.length + 1,
        name: "New Pose",
        pause: 0,
        speed: 0,
        joints: [],
      };

      setPosesData((prevPosesData) => [...prevPosesData, newPose]);

      console.log(`Add new pose`);
    } else {
      console.log(`Unknown type data: ${typeData}`);
    }
  };

  return (
    <Button
    style={{ marginLeft: 8 }}
    variant="contained"
    color="default"
    className="button"
    startIcon={<AddIcon />}
    onClick={handleClick}
  >
    Add {typeData}
  </Button>
  );
}

export default AddDataButton;
