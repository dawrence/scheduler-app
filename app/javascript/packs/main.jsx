import React from 'react'
import ReactDOM from 'react-dom'
import AppScheduler from './AppScheduler'
import InstructorForm from './instructor/InstructorForm'
import StudentForm from './student/StudentForm'
import VehicleForm from './vehicle/VehicleForm'

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
  }

  render(){
    return (
      <Router>
        <div>
          <Navbar collapseOnSelect bg="light" expand="lg">
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto">
                <Link className="nav-link" to="/">Calendario</Link>
                <Link className="nav-link" to="/students">Estudiantes</Link>
                <Link className="nav-link" to="/instructors">Instructores</Link>
                <Link className="nav-link" to="/vehicles">Vehiculos</Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>

          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/students">
              <StudentForm />
            </Route>
            <Route path="/instructors">
              <InstructorForm />
            </Route>
            <Route path="/vehicles">
              <VehicleForm />
            </Route>
            <Route path="/">
              <AppScheduler name="AppScheduler" />
            </Route>
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
