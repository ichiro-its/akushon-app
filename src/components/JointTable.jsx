import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ToggleOffIcon from "@material-ui/icons/ToggleOff";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const useStyles = makeStyles({
  table: {
    minWidth: 300,
  },
});

const JointTable = ({ rows }) => {
  const classes = useStyles();
  const styles = {
    button: {
      width: 25,
      height: 12,
    },
    input: {
      height: 32,
    },
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell width="4%">ID</TableCell>
            <TableCell width="30%">Pose Pos.</TableCell>
            <TableCell width="32%">Robot Pos.</TableCell>
            <TableCell width="34%">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>
                <FormControlLabel
                  value={row.pose_pos}
                  control={
                    <TextField style={styles.input} value={row.pose_pos} />
                  }
                />
              </TableCell>
              <TableCell>
                <FormControlLabel
                  value={row.robot_pos}
                  control={
                    <TextField style={styles.input} value={row.robot_pos} />
                  }
                />
              </TableCell>
              <TableCell>
                <IconButton aria-label="move-right" style={styles.button}>
                  <ArrowForwardIcon color="primary" />
                </IconButton>
                <IconButton aria-label="move-left" style={styles.button}>
                  <ArrowBackIcon color="primary" />
                </IconButton>
                <IconButton aria-label="torque" style={styles.button}>
                  <ToggleOffIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

JointTable.propTypes = {
  rows: PropTypes.node.isRequired,
};

export default JointTable;
