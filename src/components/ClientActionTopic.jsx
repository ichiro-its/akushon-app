import { Button, CircularProgress, Grid, TextField } from "@material-ui/core";

import {
  TitledCard,
  ClientProvider,
  NodeProvider,
  useClient,
  useHandleProcess,
  useLogger,
} from "kumo-app";

import React, { useState } from "react";

function RequestButton() {
  const client = useClient();
  const logger = useLogger();

  const [test, setTest] = useState("");
  const [result, setResult] = useState("");

  const [calling, handleCall] = useHandleProcess(() => {
    return client
    .call({test})
    .then((response) => {
        setTest("request for actions list");
        setResult(`${response.json}`);
      })
      .catch((err) => {
        logger.error(`Failed to call data! ${err.message}.`);
      });
  }, 500);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          label="Response"
          value={result}
          variant="outlined"
          fullWidth
          disabled
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          onClick={handleCall}
          disabled={client === null || calling}
          color="primary"
          variant="contained"
          fullWidth
        >
          {calling ? <CircularProgress size={24} /> : "Call"}
        </Button>
      </Grid>
    </Grid>
  );
}

function ClientActionTopic() {
  return (
    <TitledCard title="Action Client Node" raised>
      <NodeProvider nodeName="action_client">
        <ClientProvider
          serviceType="akushon_interfaces/srv/Action"
          serviceName="/get_actions"
        >
          <RequestButton />
        </ClientProvider>
      </NodeProvider>
    </TitledCard>
  );
}

export default ClientActionTopic;
