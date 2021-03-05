import React from 'react'
import CurrentUserHelper from '../helpers/CurrentUserHelper';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
const useStyles = makeStyles({
  actionLogLine: {
    marginTop: '1rem',
    padding: '0.5rem'
  },
  actionLogText:{
    marginRight: '0.2rem'
  }
});

const ActionLogLine = ({ actionLog }) => {
  const classes = useStyles();
  return(
    <Paper elevation={3} className={classes.actionLogLine}>
      <Typography className={classes.actionLogText} color="colorPrimary">
        {actionLog.user.email} 
        <Typography className={classes.actionLogText} color="error">
          {actionLog.action}
        </Typography>
        {`a ${actionLog.student.full_name}; motivo: `}
        <Typography className={classes.actionLogText} color="textSecondary">
          {actionLog.content}
        </Typography>
      </Typography>
    </Paper>
  );
}

class ActionLogList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      actionLogs: [],
      loaded: false
    };
    this.fetchItems = this.fetchItems.bind(this);
    this.fetchCurrentUser = this.fetchCurrentUser.bind(this);
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

  render() {
    return (
      <Container >
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
