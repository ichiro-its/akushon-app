import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import MuiAppBar from "@material-ui/core/AppBar";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import MuiToolbar from "@material-ui/core/Toolbar";
import MuiTypography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
}));

const columns = [
  { 
    field: 'id', 
    label: 'ID', 
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
    field: 'speed',
    label: 'Speed',
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value, tableMeta, updateValue) => {
        const inputProps = {
          min: 0,
          max: 1,
          step: 0.01,
        };

        return (
          <FormControlLabel
            control={
              <TextField 
                value={value || ''} 
                type='number' 
                inputProps={inputProps}
              />}
            onChange={event => updateValue(event.target.value)}
          />
        )
      }
    }
  },
  {
    field: 'pause',
    label: 'Pause',
    options: {
      filter: false,
      sort: false,
      
      customBodyRender: (value, tableMeta, updateValue) => {
        const inputProps = {
          min: 0,
          max: 100,
          step: 0.1,
        };

        return (
          <FormControlLabel
            control={
              <TextField 
                value={value || ''} 
                type='number' 
                inputProps={inputProps}
              />}
            onChange={event => updateValue(event.target.value)}
          />
        )
      }
    }
  },
];

const rows = [
  [1, 'motion_1', 0.35, 0.3 ],
  [2, 'motion_2', 0.42, 0.4 ],
  [3, 'motion_3', 0.45, 0.4 ],
  [4, 'motion_4', 0.16, 0.1 ],
  [5, 'motion_5', 0.22, 0.2 ],
  [6, 'motion_6', 0.15, 0.1 ],
  [7, 'motion_7', 0.44, 0.4 ],
  [8, 'motion_8', 0.36, 0.3 ],
  [9, 'motion_9', 0.65, 0.6 ],
];

const options = {
  tableBodyMaxHeight: '400px',
  pagination: false,
  filter: false,
  download: false,
  print: false,
  search: false,
  searchOpen: true,
  selectableRows: 'single',
  sortOrder: {
    name: 'ID',
    direction: 'asc'
  },
  selectableRowsOnClick: true
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
        <CardContent style={{ width: '100%' }}>
          <Grid container spacing={3}>
            <Grid item md={12} lg={4}>
              <MUIDataTable data={rows} columns={columns} options={options} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
