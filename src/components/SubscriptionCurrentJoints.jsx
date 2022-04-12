import { SubscriptionProvider, useLogger } from "kumo-app";

import React, { useContext, useState, useEffect } from "react";

import ActionContext from "../context/ActionContext";

function SubscriptionCurrentJoints() {
  const [currentJoints, setCurrentJoints] = useState([]);
  const {
    isTorquesChanged,
    jointRobotData,
    jointIdList,
    setJointRobotData,
    setIsTorquesChanged,
  } = useContext(ActionContext);
  const logger = useLogger();

  const subscriptionCallback = (message) => {
    setCurrentJoints(message.joints);
  };

  useEffect(() => {
    if (isTorquesChanged && currentJoints.length !== 0) {
      const currentJointRobotData = [];
      for (let i = 0; i < currentJoints.length; i += 1) {
        currentJointRobotData.push({
          id: currentJoints[i].id,
          name: Object.keys(jointIdList).find(
            (key) => jointIdList[key] === currentJoints[i].id
          ),
          pose_pos: currentJoints[i].position,
          status: jointRobotData[i].status, // todo(finesaaa) : need to be check
        });
      }
      setJointRobotData(currentJointRobotData);
      logger.success(`Successfully update robot joints after torques on!`);
      setIsTorquesChanged(false);
    } else if (isTorquesChanged && currentJoints.length === 0) {
      logger.error(
        `Failed update robot joints after torques on. No current joints published!`
      );
    }
  });

  return (
    <SubscriptionProvider
      messageType="tachimawari_interfaces/msg/CurrentJoints"
      topicName="/joint/current_joints"
      callback={subscriptionCallback}
    />
  );
}

export default SubscriptionCurrentJoints;
