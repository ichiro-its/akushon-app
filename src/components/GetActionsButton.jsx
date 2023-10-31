import React, { useContext } from "react";

import { Button } from "@material-ui/core";

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

function GetActionsButton() {
  const client = new akushon_interfaces.ConfigClient(import.meta.env.VITE_GRPC_WEB_API_URL, null, null);
  const request = new akushon_interfaces.Empty();
  const { setActionsData } = useContext(ActionContext);

  const handleCall = () => {
    console.log('Get actions now...');

    client.getConfig(request, {}, (err, response) => {
      if (err) {
        console.error(`Unexpected error: code = ${err.code}` + `, message = "${err.message}"`);
      } else {
        console.log('Successfully get actions data');
        const jsonActionsData = JSON.parse(response);

        let idCounter = -1;
        const rawActions = [];
        Object.keys(jsonActionsData).forEach((key) => {
          idCounter += 1;
          const fixedPoses = [];
          const rawPoses = jsonActionsData[key].poses;
          for (let i = 0; i < rawPoses.length; i += 1) {
            const jointsData = [];
            Object.keys(jointIdList).forEach((index) => {
              const jointId = jointIdList[index];
              jointsData.push({
                id: jointId,
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
      }
    });
  };

  return (
    <Button
      style={{ paddingLeft: 24, paddingRight: 24, marginLeft: 8 }}
      onClick={handleCall}
      color="primary"
      variant="contained"
    >
      Get Actions
    </Button>
  );
}

export default GetActionsButton;
