import React from 'react'
import CurrentUserHelper from '../helpers/CurrentUserHelper';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles({
  actionLogLine: {
    marginTop: '1rem',
    padding: '0.5rem'
  },
  actionLogHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionLogSegment: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  actionLogText:{
    marginRight: '0.2rem'
  },
  actionLogDate: {
    fontSize: '0.75rem'
  },
  autocompleteFilter: { 
    flex: 1, 
    margin: '0 0.5rem',
    '& input.MuiInputBase-input.MuiOutlinedInput-input.MuiAutocomplete-input': {
      height: '2rem'
    }
  }
});

const ActionLogLine = ({ actionLog }) => {
  const classes = useStyles();
  return(
    <Paper elevation={3} className={classes.actionLogLine}>
      <div className={classes.actionLogHead}>
        <Typography className={classes.actionLogText} color="colorPrimary">
          {actionLog.user_text} 
        </Typography>
        <Typography className={classes.actionLogDate} color="textSecondary">
          {actionLog.logged_at} 
        </Typography>
      </div>
      <div className={classes.actionLogSegment}>
        <Typography className={classes.actionLogText} color="error">
          {actionLog.action}
        </Typography>
        <Typography className={classes.actionLogText} color="colorPrimary">
          {`al estudiante ${actionLog.student_text}`}
        </Typography>
      </div>
      <div className={classes.actionLogSegment}>
        <Typography className={classes.actionLogText} color="colorPrimary">
          Justificación:
        </Typography>
        <Typography style={{ whiteSpace: 'pre-line'}} className={classes.actionLogText} color="textSecondary">
          {actionLog.content}
        </Typography>
      </div>
    </Paper>
  );
}

const AutocompleteFilter = ({ options, label, value, onChange}) => {
  const classes = useStyles();
  return (
    <Autocomplete
      className={classes.autocompleteFilter}
      clearOnEscape
      openOnFocus
      options={options}
      value={value}
      getOptionLabel={(option) => option.text}
      onChange={onChange}
      size="small"
      renderInput={(params) => <TextField {...params} style={{}} label={label} margin="normal" variant="outlined" />}
    />
  );
}

class ActionLogList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      actionLogs: [],
      loaded: false,
      userFilter: null,
      studentFilter: null,
      filterResources: {
        students: [],
        users: []
      }
    };
    this.fetchItems = this.fetchItems.bind(this);
    this.filterItems = this.filterItems.bind(this);
    this.fetchFilterResources = this.fetchFilterResources.bind(this);
    this.fetchCurrentUser = this.fetchCurrentUser.bind(this);
    this.handleChangeUser = this.handleChangeUser.bind(this);
    this.handleChangeStudent = this.handleChangeStudent.bind(this);
  }

  fetchCurrentUser() {
    axios.get("/api/v1/active_user", {})
      .then(({ data }) => {
        this.setState({
          currentUser: data,
        })
      })
      .catch((error) => alert(error));
  }

  componentDidMount() {
    this.fetchItems();
    this.fetchFilterResources();
    this.fetchCurrentUser();
  }

  fetchItems() {
    axios.get("/api/v1/action_logs")
      .then(({ data }) => {
        this.setState({
          actionLogs: data,
          loaded: true
        })
      })
      .catch((error) => alert(error));
  }

  filterItems() {
    axios.post("/api/v1/action_logs/filter", {
      student: this.state.studentFilter?.value,
      user: this.state.userFilter?.value
    })
    .then(({ data }) => {
      this.setState({
        actionLogs: data,
        loaded: true
      })
    })
    .catch((error) => alert(error));
  }

  fetchFilterResources() {
    axios.get("/api/v1/action_logs/filter_resources")
      .then(({ data }) => {
        this.setState({
          filterResources: data,
          loaded: true
        })
      })
      .catch((error) => alert(error));
  }

  handleChangeUser = (event, userFilter) => {
    this.setState({ userFilter });
  };

  handleChangeStudent = (event, studentFilter) => {
    this.setState({ studentFilter });
  };

  render() {
    return (
      <Container >
        <Card>
          <CardContent>
            <Typography color="textPrimary" gutterBottom>
              Filtros
            </Typography>
            <Box style={{display: 'flex'}}>
              <AutocompleteFilter
                value={this.state.userFilter}
                options={this.state.filterResources.users}
                onChange={this.handleChangeUser}
                label="Usuario responsable"
              />
              <AutocompleteFilter
                value={this.state.studentFilter}
                options={this.state.filterResources.students}
                onChange={this.handleChangeStudent}
                label="Estudiante"
              />
            </Box>
          </CardContent>
          <CardActions>
            <Button onClick={this.filterItems} variant="outlined" color="primary">
              Filtrar
            </Button>
          </CardActions>
        </Card>
        
        {
          CurrentUserHelper.canPerform(this.state.currentUser) &&
            this.state.actionLogs.map(item => {
              return <ActionLogLine key={`action-log-${item.id}`} actionLog={item}/>
            })
        }
      </Container >
    );
  }
}

export default ActionLogList;
