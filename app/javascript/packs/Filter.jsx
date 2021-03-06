import React from 'react'
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ErrorDialog from './dialogs/ErrorDialog'

class Filter extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      vehicles: [],
      students: [],
      instructors: []
    };
    this.fetchVehicles = this.fetchVehicles.bind(this)
    this.fetchInstructors = this.fetchInstructors.bind(this)
    this.fetchStudents = this.fetchStudents.bind(this)
    this.onStudentIdChange = this.onStudentIdChange.bind(this)
    this.onInstructorChange = this.onInstructorChange.bind(this)
  }

  componentDidMount(){
    this.fetchVehicles();
    this.fetchInstructors();
    this.fetchStudents();
  }

  onStudentIdChange(id){
    this.props.filterWithId(id, 'student')
  }

  onInstructorChange(id){
    this.props.filterWithId(id, 'instructor')
  }

  fetchVehicles(){
    fetch('/api/v1/vehicles')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({ vehicles: result });
        },

        (error) => {
          this.setState({ vehicles: [] });
        }
      )
  }

  fetchInstructors() {
    axios.get('/api/v1/instructors', {})
      .then(({data}) => {
        this.setState({ instructors: data });
      })
      .catch((error) => {
        this.setState({ instructors: [] });
      });
  }

  fetchStudents(){
    axios.get('/api/v1/students/', {})
      .then(({data}) => {
        this.setState({ students: data });
      })
      .catch((error) => {
        alert(error.message)
        this.setState({ students: [] });
      });
  }

  render(){
    const vehicleOptions = this.state.vehicles?.map((v) => {  return { id: v.id, text: `${v.plate} - ${v.string_type}` }}) || [];
    const instructorOptions = this.state.instructors?.map((v) => {  return { id: v.id, text: v.full_name}}) || [];
    const studentOptions = this.state.students?.map((v) => {  return { id: v.id, text: v.full_name}}) || [];

    return (
      <>
        <div className='row'>
          <div className='col m4'>
            <div className='form-group'>
              <label htmlFor="vehicle">Filtrar por vehiculo</label>
              <select name="vehicle" className="form-control"
                      id="vehicle"
                      defaultValue='-1'
                      onChange={(ev) => { this.props.filter(ev, 'vehicle') }}>
                <option disable='true' value='-1'> -- Vehículo --</option>
                { vehicleOptions.length > 0 && vehicleOptions.map(item => {
                  return (
                    <option key={`vhcl-${item.id}`} value={item.id}>{item.text}</option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className='col m4'>
            <div className='form-group'>
              <label htmlFor="student">Filtrar por Estudiante</label>
              <Autocomplete
                id="combo-box-instructor"
                options={studentOptions}
                getOptionLabel={(option) => option.text}
                style={{ width: 300 }}
                onChange={ (ev, next)=>{ this.onStudentIdChange(next.id)} }
                renderInput={(params) => <TextField {...params} label="Estudiante" variant="outlined" />}
              />
            </div>
          </div>
          <div className='col m4'>
            <div className='form-group'>
              <label htmlFor="instructor">Filtrar por Instructor</label>
              <Autocomplete
                id="combo-box-instructor"
                options={instructorOptions}
                getOptionLabel={(option) => option.text}
                style={{ width: 300 }}
                onChange={ (ev, next)=>{ this.onInstructorChange(next.id)} }
                renderInput={(params) => <TextField {...params} label="Instructor" variant="outlined" />}
              />
            </div>
          </div>
        </div>
      </>

    );
  }
}

export default Filter;
