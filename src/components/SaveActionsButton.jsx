import React, { useContext } from "react";

import { LoadingButton } from "@mui/lab";

import akushon_interfaces from "../proto/akushon_grpc_web_pb";

import ActionContext from "../context/ActionContext";

function SaveActionsButton() {
  const { actionsData, GRPC_WEB_API_URL } = useContext(ActionContext);

  const client = new akushon_interfaces.ConfigClient(GRPC_WEB_API_URL, null, null);
  const message = new akushon_interfaces.ConfigActions();

  const [isLoading, setIsLoading] = useState(false);

  const handleCall = () => {
    if (actionsData.length === 0) {
      console.log(`No actions data. Call the actions data first.`);
      return;
    }
    setIsLoading(true);
    const jsonActionsData = actionsData;
    const rawActions = {};
    Object.keys(jsonActionsData).forEach((key) => {
      const fixedPoses = [];
      const rawPoses = jsonActionsData[key].poses;
      for (let i = 0; i < rawPoses.length; i += 1) {
        const jointsData = {};
        for (let j = 0; j < rawPoses[i].joints.length; j += 1) {
          jointsData[rawPoses[i].joints[j].name] =
            rawPoses[i].joints[j].pose_pos;
        }
        fixedPoses.push({
          name: rawPoses[i].name,
          pause: parseFloat(rawPoses[i].pause),
          speed: parseFloat(rawPoses[i].speed),
          joints: jointsData,
        });
      }
      const action = {
        name: jsonActionsData[key].name,
        next: jsonActionsData[key].next,
        start_delay: jsonActionsData[key].start_delay,
        stop_delay: jsonActionsData[key].stop_delay,
        poses: fixedPoses,
      };
      rawActions[jsonActionsData[key].name.toLowerCase()] = action;
    });
    const json = JSON.stringify(rawActions);

    message.setJsonActions(json);

    client.saveConfig(message, {}, (err) => {
      if (err) {
        console.error(`Unexpected error: code = ${err.code}` + `, message = "${err.message}"`);
      } else {
        console.log(`Successfully saved actions data`);
      }
    });

    setIsLoading(false);
  };

  return (
    <LoadingButton
      onClick={handleCall}
      style={{
        background: "#11cb5f",
        marginLeft: 8,
        paddingLeft: 16,
        paddingRight: 16,
      }}
      color="primary"
      variant="contained"
      loading={isLoading}
    >
      Save
    </LoadingButton>
  );
}

export default SaveActionsButton;
