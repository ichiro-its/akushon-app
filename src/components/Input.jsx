/* eslint-disable react/prop-types */
import React from "react";
import TextField from "@material-ui/core/TextField";

export default function Input({ id, label, width }) {
  return (
    <TextField
      id={id}
      label={label}
      variant="outlined"
      margin="dense"
      style={{ margin: 3, marginTop: 20, width }}
      InputLabelProps={{
        shrink: true,
      }}
    />
  );
}
