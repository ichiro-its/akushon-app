import Input from './components/Input';

import Button from '@material-ui/core/Button';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import MuiAppBar from "@material-ui/core/AppBar";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import MuiToolbar from "@material-ui/core/Toolbar";
import MuiTypography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";

import AddIcon from '@material-ui/icons/Add';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ToggleOffIcon from '@material-ui/icons/ToggleOff';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const actionColumns = [
  {
    name: "id",
    label: "#",
    options: {
      filter: true,
      sort: true,
    }
  },
  {
    name: "name",
    label: "Name",
    options: {
      filter: true,
      sort: true,
    }
  },
  {
    name: "next",
    label: "Next",
    options: {
      filter: false,
      sort: false,
    }
  },
];
 
const actionData = [
  { id: 1, name: 'action_1', next: 0 },
  { id: 2, name: 'action_2', next: 0 },
  { id: 3, name: 'action_3', next: 0 },
  { id: 4, name: 'action_4', next: 0 },
  { id: 5, name: 'action_5', next: 0 },
  { id: 6, name: 'action_6', next: 0 },
  { id: 7, name: 'action_7', next: 0 },
  { id: 8, name: 'action_8', next: 0 },
  { id: 9, name: 'action_9', next: 0 },
  { id: 10, name: 'action_10', next: 0 },
]; 

const actionOptions = {
  tableBodyHeight: '610px',
  pagination: false,
  filter: false,
  download: false,
  print: false,
  search: true,
  selectableRows: 'single',
  sortOrder: {
    name: 'ID',
    direction: 'asc'
  },
  selectableRowsOnClick: true,
  selectableRowsHideCheckboxes: true
};

const poseColumns = [
  {
    name: "id",
    label: "#",
    options: {
      filter: true,
      sort: false,
      customBodyRender: (rowIndex, dataIndex) => dataIndex.rowIndex + 1 
    }
  },
  {
    name: "name",
    label: "Name",
    options: {
      filter: true,
      sort: true,
    }
  },
  {
    name: "speed",
    label: "Speed",
    options: {
      filter: false,
      sort: false,
    }
  },
  {
    name: "pause",
    label: "Pause",
    options: {
      filter: false,
      sort: false,
    }
  },
];
 
const poseData = [
  { name: 'pose_1', speed: 0.5, pause: 1.5 },
  { name: 'pose_2', speed: 0.5, pause: 1.5 },
  { name: 'pose_3', speed: 0.5, pause: 1.5 },
  { name: 'pose_4', speed: 0.5, pause: 1.5 },
  { name: 'pose_4', speed: 0.5, pause: 1.5 },
]; 

const poseOptions = {
  tableBodyHeight: '269px',
  pagination: false,
  filter: false,
  download: false,
  print: false,
  search: true,
  selectableRows: 'single',
  sortOrder: {
    name: 'ID',
    direction: 'asc'
  },
  selectableRowsOnClick: true,
  selectableRowsHideCheckboxes: true
};

const jointData = [
  { id: 1, position: 0 },
  { id: 2, position: 0 },
  { id: 3, position: 0 },
  { id: 4, position: 0 },
  { id: 5, position: 0 },
  { id: 6, position: 0 },
  { id: 7, position: 0 },
  { id: 8, position: 0 },
  { id: 9, position: 0 },
  { id: 10, position: 0 },
  { id: 11, position: 0 },
  { id: 12, position: 0 },
  { id: 13, position: 0 },
  { id: 14, position: 0 },
  { id: 15, position: 0 },
  { id: 16, position: 0 },
  { id: 17, position: 0 },
  { id: 18, position: 0 },
  { id: 19, position: 0 },
  { id: 20, position: 0 },
]; 

const jointColumns = [
  {
    name: "id",
    label: "ID",
    options: {
      filter: false,
      sort: false,
    }
  },
  {
    name: "pose-position",
    label: "Pose Pos.",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value, tableMeta, updateValue) => (
        <FormControlLabel
          value={value}
          control={<TextField value={value} />}
          onChange={event => updateValue(event.target.value)}
        />
      )
    }
  },
  {
    name: "robot-position",
    label: "Robot Pos.",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value, tableMeta, updateValue) => (
        <FormControlLabel
          value={value}
          control={<TextField value={value} />}
          onChange={event => updateValue(event.target.value)}
        />
      )
    }
  },
  {
    name: "action",
    label: "Action",
    options: {
      filter: false,
      sort: false,
      setCellProps: () => ({ style: { minWidth: "150px"}}),
      customBodyRender: (value, tableMeta, updateValue) => (
        <>
          <IconButton aria-label="move-right">
            <ArrowForwardIcon color="primary" />
          </IconButton>
          <IconButton aria-label="move-left">
            <ArrowBackIcon color="primary" />
          </IconButton>
          <IconButton aria-label="torque">
            <ToggleOffIcon />
          </IconButton>
        </>
      ),
    }
  },
];

const jointOptions = {
  tableBodyHeight: '610px',
  pagination: false,
  filter: false,
  download: false,
  print: false,
  search: true,
  selectableRows: 'single',
  sortOrder: {
    name: 'ID',
    direction: 'asc'
  },
  selectableRowsHideCheckboxes: true,
  setRowProps: () => ({ style: { height: 0 } }),
  setTableProps: () => {
    return {
      size: 'small',
    };
  },
};

function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <MuiAppBar position="static">
        <MuiToolbar>
          <MuiTypography variant="h6">Akushon App</MuiTypography>
        </MuiToolbar>
      </MuiAppBar>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MUIDataTable 
                title={"Action List"} 
                data={actionData} 
                columns={actionColumns} 
                options={actionOptions}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Card>
                <CardContent>
                  <MuiTypography variant="h6">
                    Action
                  </MuiTypography>
                  <div style={{marginBottom: 10}}>
                    <Input 
                      id="action-name" 
                      label="Name" 
                      width="66%"
                    />
                    <Input 
                      id="action-next" 
                      label="Next" 
                      width="31%"
                    />
                  </div>

                  <MUIDataTable 
                    title={"Pose List"} 
                    data={poseData} 
                    columns={poseColumns} 
                    options={poseOptions}
                  />
                  
                  <div style={{marginTop: 10, marginBottom: -10}}>
                    <Button
                      variant="contained"
                      style={{background: '#11cb5f'}}
                      color="primary"
                      className={classes.button}
                      startIcon={<AddIcon />}
                    >
                      Add
                    </Button>
                    <Button
                      variant="contained"
                      color="default"
                      className={classes.button}
                      startIcon={<ArrowUpwardIcon />}
                    >
                      Move Up
                    </Button>
                    <Button
                      variant="contained"
                      color="default"
                      className={classes.button}
                      startIcon={<ArrowDownwardIcon />}
                    >
                      Move Down
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card style={{marginTop: 10}}>
                <CardContent>
                  <MuiTypography variant="h6">
                    Pose
                  </MuiTypography>
                    <Input 
                      id="pose-name" 
                      label="Name" 
                      width="31%"
                    />
                    <Input 
                      id="pose-speed" 
                      label="Speed" 
                      width="31%"
                    />
                    <Input 
                      id="pose-pause" 
                      label="Pause" 
                      width="31%"
                    />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} lg={4}>
              <MUIDataTable 
                title={"Joint List"} 
                data={jointData} 
                columns={jointColumns} 
                options={jointOptions}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
