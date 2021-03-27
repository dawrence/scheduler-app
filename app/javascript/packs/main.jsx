import React from 'react'
import ReactDOM from 'react-dom'
import AppScheduler from './AppScheduler'
import ActionLogList from './ActionLog/ActionLogList'
import InstructorForm from './instructor/InstructorForm'
import StudentForm from './student/StudentForm'
import VehicleForm from './vehicle/VehicleForm'
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Alert, AlertTitle } from '@material-ui/lab';
import CurrentUserHelper from './helpers/CurrentUserHelper';
import axios from 'axios';
import { Navbar, Nav } from 'react-bootstrap';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      notifyCloseDebtors: false
    }
    this.fetchCurrentUser = this.fetchCurrentUser.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  fetchCloseDebtorsNotification() {
    this.setState({ loading: true })
    axios.get("/api/v1/appointments/with/debtor/student", {})
      .then(({ data }) => {
        this.setState({
          loading: false,
          ...data,
        })
      })
      .catch((error) => {
        this.setState({ loading: false })
        alert(error)
      });
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
    this.fetchCloseDebtorsNotification();
    this.fetchCurrentUser();
  }
  handleClose (event, reason){
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  }

  render(){
    return (
      <Router>
        <div>
          <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={this.state.open && this.state.notifyCloseDebtors}
            autoHideDuration={6000}
            onClose={this.handleClose}
            action={
              <React.Fragment>
                <Alert severity="warning">
                  <AlertTitle>Alerta</AlertTitle>
                  <Link to="/students">
                    Hay estudiantes morosos próximos a iniciar clases
                  </Link>
                </Alert>
                <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleClose}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            }
          />
          <Navbar collapseOnSelect bg="light" expand="lg">
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto">
                {
                  CurrentUserHelper.canPerform(this.state.currentUser, 'admin', 'scheduler') &&
                  <Link className="nav-link" to="/">Calendario</Link>
                }
                {
                  CurrentUserHelper.canPerform(this.state.currentUser) &&
                  <Link className="nav-link" to={CurrentUserHelper.canPerform(this.state.currentUser, "treasurer", "certifier") ? "/" : "/students"}>Estudiantes</Link>
                }
                {
                  CurrentUserHelper.canPerform(this.state.currentUser, "admin") &&
                  <Link className="nav-link" to="/instructors">Instructores</Link>
                }
                {
                  CurrentUserHelper.canPerform(this.state.currentUser, 'admin', 'scheduler') &&
                  <Link className="nav-link" to="/vehicles">Vehiculos</Link>
                }
                {
                  CurrentUserHelper.canPerform(this.state.currentUser) &&
                  <Link className="nav-link" to="/action_logs">Log de acciones</Link>
                }
              </Nav>
            </Navbar.Collapse>
          </Navbar>

          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            {
              CurrentUserHelper.canPerform(this.state.currentUser) &&
              <Route exact path={CurrentUserHelper.canPerform(this.state.currentUser, "treasurer", "certifier") ? "/" : "/students"}>
                <StudentForm />
              </Route>
            }
            {
              CurrentUserHelper.canPerform(this.state.currentUser, "admin") &&
              <Route path="/instructors">
                <InstructorForm />
              </Route>
            }
            {
              CurrentUserHelper.canPerform(this.state.currentUser, 'admin', 'scheduler') &&
              <Route path="/vehicles">
                <VehicleForm />
              </Route>
            }
            {
              CurrentUserHelper.canPerform(this.state.currentUser) &&
              <Route path="/action_logs">
                <ActionLogList />
              </Route>
            }
            {
              CurrentUserHelper.canPerform(this.state.currentUser, "admin", "scheduler") &&
              <Route path="/">
                <AppScheduler name="AppScheduler" />
              </Route>
            }
          </Switch>
        </div>
      </Router>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Main />,
    document.getElementsByTagName('main')[0],
  )
})
