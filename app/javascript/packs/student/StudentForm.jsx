import React from 'react'
import StudentList from './StudentList'
import TextAreaDialog from '../dialogs/TextAreaDialog';
import CurrentUserHelper from '../helpers/CurrentUserHelper';
import axios from 'axios';


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
        debtor: false,
        total_fines: 0,
        total_fines_value: 0.0,
        age: 0,
        license_type: '',
        available_hours: 0
      },
      error: null,
      students: [],
      loaded: false,
      openDialog: false,
      justification: "",
      label: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchItems = this.fetchItems.bind(this);
    this.fetchCurrentUser = this.fetchCurrentUser.bind(this);
    this.selectStudent = this.selectStudent.bind(this);
    this.newRecord = this.newRecord.bind(this);
    this.deleteStudent = this.deleteStudent.bind(this);
    this.markStudent = this.markStudent.bind(this);
    this.unmarkStudent = this.unmarkStudent.bind(this);
    this.setFineStudent = this.setFineStudent.bind(this);
    this.payFineStudent = this.payFineStudent.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.onChangeJustification = this.onChangeJustification.bind(this);
    this.resetDialogJustification = this.resetDialogJustification.bind(this);
    this.onAccept = () => {};
  }

  closeDialog() {
    this.setState({openDialog: false})
  }

  onChangeJustification({ target: { value } }) {
    this.setState({ justification: value })
  }

  resetDialogJustification() {
    this.setState({ justification: '' })
  }

  newRecord(ev) {
    this.setState({
      student: {
        id: null,
        full_name: '',
        id_number: '',
        email: '',
        phone: '',
        age: 0,
        license_type: '',
        available_hours: 0
      }
    });
    this.forceUpdate();
  }

  fetchCurrentUser() {
    axios.get("/api/v1/active_user", {})
      .then(({data}) => {
        this.setState({
          currentUser: data,
        })
      })
      .catch((error) => alert(error));
  }

  markStudent(e, id) {
    return axios.post(`/api/v1/students/${id}/debtor/mark`, { content: this.state.justification }).then(() => {
      this.resetDialogJustification();
      this.fetchItems();
      this.forceUpdate();
    }).catch((error) => alert(error));
  }

  unmarkStudent(e, id) {
    return axios.post(`/api/v1/students/${id}/debtor/unmark`, { content: this.state.justification }).then(() => {
      this.resetDialogJustification();
      this.fetchItems();
      this.forceUpdate();
    }).catch((error) => alert(error));
  }

  setFineStudent(e, id) {
    return axios.post(`/api/v1/students/${id}/fine/set`, { content: this.state.justification }).then(() => {
      this.resetDialogJustification();
      this.fetchItems();
      this.forceUpdate();
    }).catch((error) => alert(error));
  }

  payFineStudent(e, id) {
    return axios.post(`/api/v1/students/${id}/fine/pay`, { content: this.state.justification }).then(() => {
      this.resetDialogJustification();
      this.fetchItems();
      this.forceUpdate();
    }).catch((error) => alert(error));
  }

  deleteStudent(e, id) {
    if( confirm('Desea borrar el Estudiante seleccionado?')){
      return axios.delete(`/api/v1/students/${id}`, {}).then(() => {
        this.fetchItems();
        this.forceUpdate();
      })
    }
  }

  handleSubmit(ev) {
    const requestOptions = {
        url: this.state.student.id ? `/api/v1/students/${this.state.student.id}` : '/api/v1/students',
        method: this.state.student.id ? 'patch' : 'post',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ student: this.state.student })
    };
    axios(requestOptions)
      .then(({ data }) => {
        this.setState({ student: data })
        this.fetchItems();
        this.forceUpdate();
      })
      .catch((error) => alert(error));
    ev.preventDefault();
    this.forceUpdate();
  }

  selectStudent(student) {
    this.setState({ student: student })
  };

  componentDidMount(){
    this.fetchItems();
    this.fetchCurrentUser();
  }

  fetchItems(){
    axios.get("/api/v1/students", {})
      .then(({data}) => {
        this.setState({
          students: data,
          loaded: true
        })
      })
      .catch((error) => alert(error));
  }

  handleChange(evt) {
    const name = evt.target.name
    const licences = { a2: 16, b1: 21, c1: 31, a2b1: 37, a2c1: 47 }
    const studentParams = this.state.student
    studentParams[name] = evt.target.value
    if(name === 'license_type') {
      studentParams['available_hours'] = licences[evt.target.value]
    }
    this.setState({ student: studentParams })
  }

  render() {
    return (
      <>
        {
          CurrentUserHelper.canPerform(this.state.currentUser) &&
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
                            {/* <label htmlFor="email">Email</label>
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
                                  placeholder="Edad" /> */}

                            <label htmlFor="licenseType">Tipo de licencia</label>
                            <select name="license_type" className="form-control" id="licenseType" onChange={this.handleChange}>
                              <option selected={this.state.student.license_type === 'a2'} value="a2">A2: Moto</option>
                              <option selected={this.state.student.license_type === 'b1'} value="b1">B1: Vehiculo Particular</option>
                              <option selected={this.state.student.license_type === 'c1'} value="c1">C1: Vehiculo Publico</option>
                              <option selected={this.state.student.license_type === 'a2b1'} value="a2b1">A2 y B1</option>
                              <option selected={this.state.student.license_type === 'a2c1'} value="a2c1">A2 y C1</option>
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
        }
        <div className="col-12" style={{overflow: 'auto', height: '300px'}}>
          <StudentList
            currentUser={this.state.currentUser}
            items={this.state.students}
            error={this.state.error}
            itemsLoaded={this.state.loaded}
            selectItem={this.selectStudent}
            deleteItem={this.deleteStudent}
            markAsDebtor={(e, id) => {
              this.setState({ openDialog: true, label: "¿Por que será marcado como moroso?." });
              this.onAccept = () => this.markStudent(e, id)
            }}
            unmarkAsDebtor={(e, id) => {
              this.setState({ openDialog: true, label: "¿Por que deja de ser moroso?." });
              this.onAccept = () => this.unmarkStudent(e, id)
            }}
            payFine={(e, id) => {
              this.setState({ openDialog: true, label: "Descripción del pago de la multa." });
              this.onAccept = () => this.payFineStudent(e, id);
            }}
            setFine={(e, id) => {
              this.setState({ openDialog: true, label: "Motivo por el que se genera la multa." });
              this.onAccept = () => this.setFineStudent(e, id);
            }}
          />
        </div>
        <TextAreaDialog
          label={this.state.label}
          open={this.state.openDialog}
          justification={this.state.justification}
          onChange={this.onChangeJustification}
          onAccept={this.onAccept}
          handleClose={this.closeDialog}
        />
      </>
    );
  }
}

export default StudentForm;
