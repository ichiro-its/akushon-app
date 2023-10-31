import React, { useContext } from "react";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import DeleteIcon from '@material-ui/icons/Delete';

import { Button } from "@material-ui/core";

import ActionContext from "../context/ActionContext";

function ManagePoseButton(props) {
  const { currentPose, posesData, setPosesData } = useContext(ActionContext);

  const typeButton = props.typeButton;

  const handleClick = () => {
    if (currentPose.length === 0) {
      alert("Please pick a pose first.");
      return;
    }
     
    const index = posesData.findIndex((pose) => pose.id === currentPose.id);
    if (typeButton === "UP") {
      console.log(`Move pose up`);

      if (index === 0) {
        return;
      }

      let newPosesData = [
        ...posesData.slice(0, index - 1),
        posesData[index],
        posesData[index - 1],
        ...posesData.slice(index + 1),
      ];

      newPosesData[index].id = index;
      newPosesData[index - 1].id = index - 1;

      setPosesData(newPosesData);
    } else if (typeButton === "DOWN") {
      console.log(`Move pose down`);
      
      if (index === posesData.length - 1) {
        return;
      }

      let newPosesData = [
        ...posesData.slice(0, index),
        posesData[index + 1],
        posesData[index],
        ...posesData.slice(index + 2),
      ];

      newPosesData[index].id = index;
      newPosesData[index + 1].id = index + 1;

      setPosesData(newPosesData);
    } else if (typeButton === "DELETE") {
      console.log(`Delete pose`);

      let newPosesData = [
        ...posesData.slice(0, index),
        ...posesData.slice(index + 1),
      ];

      for (let i = 0; i < newPosesData.length; i += 1) {
        newPosesData[i].id = i;
      }

      setPosesData(newPosesData);
    } else {
      console.error(`Unknown type button: ${typeButton}`);
    }
  }

  return (
    <Button
      variant="contained"
      color="default"
      className="button"
      onClick={handleClick}
      startIcon={ typeButton === "UP" ? <ArrowUpwardIcon /> : typeButton === "DOWN" ? <ArrowDownwardIcon /> : <DeleteIcon /> }
    >
      {typeButton}
    </Button>
  );
}

export default ManagePoseButton;
