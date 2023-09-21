import React, { useContext, useState, useEffect } from "react";

import akushon_interfaces from "../proto/akushon_grpc_web_pb";

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

function SubscriptionCurrentJoints() {
  const client = new akushon_interfaces.ConfigClient(`${import.meta.env.GRPC_WEB_API_URL}`, null, null);
  const request = new akushon_interfaces.Empty();

  const [currentJoints, setCurrentJoints] = useState([]);
  const { setJointRobotData, jointRobotData } = useContext(ActionContext);

  const handleSubscription = () => {
    client.subscribeCurrentJoints(request, {}, (err, response) => {
      if (err) {
        console.log(`Unexpected error: code = ${err.code}` + `, message = "${err.message}"`);
      } else {
        setCurrentJoints((prevCurrentJoints) => {
          let jointChangeCounter = 0;
          prevCurrentJoints.forEach((joint, index) => {
            if (message.joints[index].position === joint.position) {
              jointChangeCounter += 1;
            }
          });
    
          if (jointChangeCounter !== message.joints.length) {
            return message.joints;
          }
    
          return prevCurrentJoints;
        });
      }
    });
  };

  handleSubscription();

  useEffect(() => {
    if (jointRobotData.length !== 0) {
      setJointRobotData((oldJointRobotData) => {
        const newJointRobotData = [];
        for (let i = 0; i < oldJointRobotData.length; i += 1) {
          const index = currentJoints.findIndex(
            (joint) => joint.id === oldJointRobotData[i].id
          );
          newJointRobotData.push({
            id: oldJointRobotData[i].id,
            name: Object.keys(jointIdList).find(
              (key) => jointIdList[key] === currentJoints[index].id
            ),
            pose_pos: currentJoints[index].position,
            status: oldJointRobotData[i].status, // todo(finesaaa) : need to be check
          });
        }
        return newJointRobotData;
      });
    }
  }, [currentJoints]);
}

export default SubscriptionCurrentJoints;
