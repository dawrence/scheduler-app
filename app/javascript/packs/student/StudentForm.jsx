import React from 'react'
import StudentList from './StudentList'

class StudentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      student: {
        id: null,
        full_name: '',
        id_number: '',
        email: '',
        phone: '',
        age: 0,
        license_type: '',
        available_hours: 0
      },
      error: null,
      students: [],
      loaded: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchItems = this.fetchItems.bind(this);
    this.selectStudent = this.selectStudent.bind(this);
  }

  handleSubmit(ev) {
    const url = this.state.student.id ? `/api/v1/students/${this.state.student.id}` : '/api/v1/students'
    const requestOptions = {
        method: this.state.student.id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student: this.state.student })
    };
    fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
          this.setState({ student: data })
          this.fetchItems();
          this.forceUpdate();
        });
    ev.preventDefault();
    this.forceUpdate();
  }

  selectStudent(student) {
    this.setState({ student: student })
  };

  componentDidMount(){
    this.fetchItems();
  }

  fetchItems(){
    fetch("/api/v1/students")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            students: result,
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

  handleChange(evt) {
    const name = evt.target.name
    const licences = { a2: 16, b1: 21, c1: 31}
    const studentParams = this.state.student
    studentParams[name] = evt.target.value
    if(name === 'license_type') {
      studentParams['available_hours'] = licences[evt.target.value]
    }
    this.setState({ student: studentParams })
  }

  render() {
    console.log(this.state);
    return (
      <>
        <div className="row">
          <div className="col m12">
            <form onSubmit={this.handleSubmit}>
              <div className="card">
                <div className="card-content">
                  <div className="row">
                    <div className="col m8 offset-m2 center-align">
                      <span className="card-title">Estudiantes</span>
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
                                value={ this.state.student.full_name || '' }
                                onChange={this.handleChange}
                                className='validate form-control'
                                placeholder="Nombre completo" />
                          <label htmlFor="id_number">Cédula</label>
                          <input type='text'
                                required={true}
                                name='id_number'
                                value={ this.state.student.id_number || '' }
                                onChange={this.handleChange}
                                className='validate form-control'
                                placeholder="Cedula" />
                          <label htmlFor="email">Email</label>
                          <input type='text'
                                name='email'
                                value={ this.state.student.email || '' }
                                onChange={this.handleChange}
                                className='validate form-control'
                                placeholder="Email" />

                          <label htmlFor="phone">Telefono</label>
                          <input type='text'
                                name='phone'
                                value={ this.state.student.phone || '' }
                                onChange={this.handleChange}
                                className='validate form-control'
                                placeholder="Telefono"/>

                          <label htmlFor="age">Edad</label>
                          <input type='number'
                                name='age'
                                value={ this.state.student.age || 0 }
                                onChange={this.handleChange}
                                className='validate form-control'
                                placeholder="Edad" />

                          <label htmlFor="licenseType">Tipo de licencia</label>
                          <select name="license_type" className="form-control" id="licenseType" onChange={this.handleChange}>
                            <option selected={this.state.student.license_type === 'a2'} value="a2">A2: Moto</option>
                            <option selected={this.state.student.license_type === 'b1'} value="b1">B1: Vehiculo Particular</option>
                            <option selected={this.state.student.license_type === 'c1'} value="c1">C1: Vehiculo Publico</option>
                          </select>
                          <input type='number'
                                disabled={true}
                                value={ this.state.student.available_hours }
                                className='validate form-control'
                                onChange={() => {}}
                                placeholder="Horas disponibles" />
                        </div>
                        <div className='form-group'>
                          <button type="submit" className="waves-effect waves-light btn">Guardar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <StudentList items={this.state.students} error={this.state.error} itemsLoaded={this.state.loaded} selectItem={this.selectStudent} />
      </>
    );
  }
}

export default StudentForm;
