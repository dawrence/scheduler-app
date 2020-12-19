import React from 'react'
import InstructorList from './InstructorList'

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
        available_hours: 16
      },
      error: null,
      instructors: [],
      loaded: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchItems = this.fetchItems.bind(this);
    this.selectInstructor = this.selectInstructor.bind(this);
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

                          <label htmlFor="phone">Horas Disponibles</label>
                          <input type='number'
                                value={ this.state.instructor.available_hours }
                                onChange={()=>{}}
                                className='validate form-control'
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
        <InstructorList items={this.state.instructors} error={this.state.error} itemsLoaded={this.state.loaded} selectItem={this.selectInstructor}/>
      </>
    );
  }
}

export default InstructorForm;
