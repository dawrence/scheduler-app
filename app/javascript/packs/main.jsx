import React from 'react'
import ReactDOM from 'react-dom'
import AppScheduler from './AppScheduler'
import InstructorForm from './instructor/InstructorForm'
import StudentForm from './student/StudentForm'
import VehicleForm from './vehicle/VehicleForm'

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
          <nav>
            <ul>
              <li>
                <Link to="/">Calendario</Link>
              </li>
              <li>
                <Link to="/students">Estudiantes</Link>
              </li>
              <li>
                <Link to="/instructors">Instructores</Link>
              </li>
              <li>
                <Link to="/vehicles">Vehiculos</Link>
              </li>
            </ul>
          </nav>

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
