import React from 'react'
import ReactDOM from 'react-dom'
import AppScheduler from './AppScheduler'
import InstructorForm from './instructor/InstructorForm'
import StudentForm from './student/StudentForm'
import VehicleForm from './vehicle/VehicleForm'
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
    this.state = {}
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
    this.fetchCurrentUser();
  }

  render(){
    return (
      <Router>
        <div>
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
                  <Link className="nav-link" to={CurrentUserHelper.canPerform(this.state.currentUser, "treasurer") ? "/" : "/students"}>Estudiantes</Link>
                }
                {
                  CurrentUserHelper.canPerform(this.state.currentUser, "admin") &&
                  <Link className="nav-link" to="/instructors">Instructores</Link>
                }
                {
                  CurrentUserHelper.canPerform(this.state.currentUser, 'admin', 'scheduler') &&
                  <Link className="nav-link" to="/vehicles">Vehiculos</Link>
                }
              </Nav>
            </Navbar.Collapse>
          </Navbar>

          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            {
              CurrentUserHelper.canPerform(this.state.currentUser) &&
              <Route path={CurrentUserHelper.canPerform(this.state.currentUser, "treasurer") ? "/" : "/students"}>
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
