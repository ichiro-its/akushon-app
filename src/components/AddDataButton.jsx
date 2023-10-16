import React, { useContext } from "react";

import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import ActionContext from "../context/ActionContext";

const jointIdList = {
  right_shoulder_pitch: 1,
  left_shoulder_pitch: 2,
  right_shoulder_roll: 3,
  left_shoulder_roll: 4,
  right_elbow: 5,
  left_elbow: 6,
  right_hip_yaw: 7,
  left_hip_yaw: 8,
  right_hip_roll: 9,
  left_hip_roll: 10,
  right_hip_pitch: 11,
  left_hip_pitch: 12,
  right_knee: 13,
  left_knee: 14,
  right_ankle_pitch: 15,
  left_ankle_pitch: 16,
  right_ankle_roll: 17,
  left_ankle_roll: 18,
  neck_yaw: 19,
  neck_pitch: 20,
};

function AddDataButton(props) {
  const { actionsData, posesData, setPosesData, setActionsData, currentPose } = useContext(ActionContext);
  const typeData = props.typeData;

  const handleClick = () => {
    if (typeData === "action") {
      if (actionsData.length === 0) {
        alert("Please get the actions data first.");
        return;
      }

      const newJointPose = [];
      Object.keys(jointIdList).forEach((index) => {
        const jointId = jointIdList[index];
        newJointPose.push({
          id: jointId,
          name: index,
          pose_pos: 0,
        });
      });

      const newPose = {
        id: 0,
        name: "New Pose",
        pause: 0,
        speed: 0,
        joints: newJointPose
      };

      const newAction = {
        id: actionsData.length,
        name: "New Action",
        next: "",
        start_delay: 0,
        stop_delay: 0,
        poses: [newPose]
      };

      setActionsData((prevActionsData) => [...prevActionsData, newAction]);

      console.log(`Add new action`);
      console.log(actionsData);
    }
    else if (typeData === "pose") {
      if (posesData.length === 0) {
        alert("Please pick an action first.");
        return;
      }
      const newPose = {
        id: posesData.length,
        name: "New Pose",
        pause: 0,
        speed: 0,
        joints: currentPose.joints
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
