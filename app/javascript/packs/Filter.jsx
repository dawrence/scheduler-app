import React from 'react'

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
  }

  componentDidMount(){
    this.fetchVehicles();
    this.fetchInstructors();
    this.fetchStudents();
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
    fetch('/api/v1/instructors')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({ instructors: result });
        },

        (error) => {
          this.setState({ instructors: [] });
        }
      )
  }

  fetchStudents(){
    fetch('/api/v1/students/')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({ students: result });
        },

        (error) => {
          this.setState({ students: [] });
        }
      )
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
              <select name="student" className="form-control"
                      id="vehicle"
                      defaultValue='-1'
                      onChange={(ev) => { this.props.filter(ev, 'student') }}>
                <option disable='true' value='-1'> -- Estudiante --</option>
                { studentOptions.length > 0 && studentOptions.map(item => {
                  return (
                    <option key={`stdt-${item.id}`} value={item.id}>{item.text}</option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className='col m4'>
            <div className='form-group'>
              <label htmlFor="instructor">Filtrar por Instructor</label>
              <select key={'instru'} name="instructor"
                      className="form-control" id="vehicle"
                      defaultValue='-1'
                      onChange={(ev) => { this.props.filter(ev, 'instructor') }}>
                <option disable='true' value='-1'> -- Instructor --</option>
                { instructorOptions.length > 0 && instructorOptions.map(item => {
                  return (
                    <option key={`inst-${item.id}`} value={item.id}>{item.text}</option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
      </>

    );
  }
}

export default Filter;
