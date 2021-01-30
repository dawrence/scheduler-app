import React from 'react'
import InstructorList from './InstructorList'
import axios from 'axios';

class InstructorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      instructor: {
        id: null,
        full_name: '',
        id_number: '',
        email: '',
        phone: '',
        license_type: '',
        assigned_hours: 0,
        available_hours: 10
      },
      error: null,
      instructors: [],
      loaded: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchItems = this.fetchItems.bind(this);
    this.selectInstructor = this.selectInstructor.bind(this);
    this.newRecord = this.newRecord.bind(this);
    this.deleteInstructor = this.deleteInstructor.bind(this);
  }

  newRecord(ev) {
    this.setState({
      instructor: {
        id: null,
        full_name: '',
        id_number: '',
        email: '',
        phone: '',
        license_type: '',
        available_hours: 10
      }
    });
    this.forceUpdate();
  }

  deleteInstructor(e, id) {
    if( confirm('Desea borrar el instructor seleccionado?')){
      return axios.delete(`/api/v1/instructors/${id}`, {}).then(() => {
        this.fetchItems();
        this.forceUpdate();
      })
    }
  }

  handleSubmit(ev) {
    const url = this.state.instructor.id ? `/api/v1/instructors/${this.state.instructor.id}` : '/api/v1/instructors'
    const requestOptions = {
        method: this.state.instructor.id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructor: this.state.instructor })
    };
    fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
          this.setState({ instructor: data })
          this.fetchItems();
          this.forceUpdate();
        });
    ev.preventDefault();
    this.forceUpdate();
  }

  componentDidMount(){
    this.fetchItems();
  }

  fetchItems(){
    fetch("/api/v1/instructors")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            instructors: result,
            loaded: true
          })
        },

        (error) => {
          this.setState({
            error: error,
            loaded: false
          })
        }
      )
  }

  selectInstructor(instructor) {
    this.setState({ instructor: instructor })
  };

  handleChange(evt) {
    const name = evt.target.name
    const instructorParams = this.state.instructor
    instructorParams[name] = evt.target.value
    this.setState({ instructor: instructorParams })
  }

  render() {
    return (
      <>
        <div className="col-12 row">
          <div className="col-12">
            <form onSubmit={this.handleSubmit}>
              <div className="card">
                <div className="card-content">
                  <div className="row">
                    <div className="col m8 offset-m2 center-align">
                      <span className="card-title">Instructores</span>
                    </div>
                  </div>
                  <div className="container">
                    <div className="row">
                      <div className="col m12 offset-m2">
                        <div className="form-group">
                          <label htmlFor="full_name">Nombre Completo</label>
                          <input type='text'
                                required={true}
                                name='full_name'
                                value={ this.state.instructor.full_name || '' }
                                onChange={this.handleChange}
                                className='validate form-control'
                                placeholder="Nombre completo" />
                          <label htmlFor="id_number">Cédula</label>
                          <input type='text'
                                required={true}
                                name='id_number'
                                value={ this.state.instructor.id_number || '' }
                                onChange={this.handleChange}
                                className='validate form-control'
                                placeholder="Cedula" />
                          <label htmlFor="email">Email</label>
                          <input type='text'
                                name='email'
                                value={ this.state.instructor.email || '' }
                                onChange={this.handleChange}
                                className='validate form-control'
                                placeholder="Email" />

                          <label htmlFor="phone">Telefono</label>
                          <input type='text'
                                name='phone'
                                value={ this.state.instructor.phone || '' }
                                onChange={this.handleChange}
                                className='validate form-control'
                                placeholder="Telefono"/>

                          <label htmlFor="licenseType">Tipo de licencia</label>
                          <select name="license_type" className="form-control" id="licenseType" onChange={this.handleChange}>
                            <option selected={this.state.instructor.license_type === 'a2'} value="a2">A2: Moto</option>
                            <option selected={this.state.instructor.license_type === 'b1'} value="b1">B1: Vehiculo Particular</option>
                            <option selected={this.state.instructor.license_type === 'c1'} value="c1">C1: Vehiculo Publico</option>
                            <option selected={this.state.instructor.license_type === 'a2b1'} value="a2b1">A2 y B1</option>
                            <option selected={this.state.instructor.license_type === 'b1c1'} value="b1c1">B1 y C1</option>
                            <option selected={this.state.instructor.license_type === 'a2b1c1'} value="a2b1c1">A2, B1 y C1</option>
                          </select>

                          <label htmlFor="available_hours">Horas Disponibles</label>
                          <input type='number'
                                name='available_hours'
                                value={ this.state.instructor.available_hours }
                                onChange={this.handleChange}
                                className='validate form-control'
                                placeholder="Horas disponibles" />
                        </div>
                        <div className='form-group'>
                          <button type="submit" className="waves-effect waves-light btn">Guardar</button>
                        </div>
                        <div className='form-group'>
                          <button className="waves-effect waves-light btn" onClick={this.newRecord}>Nuevo</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="col-12" style={{overflow: 'auto'}}>
          <InstructorList
            items={this.state.instructors}
            error={this.state.error}
            itemsLoaded={this.state.loaded}
            selectItem={this.selectInstructor}
            deleteItem={this.deleteInstructor}/>
        </div>
      </>
    );
  }
}

export default InstructorForm;
