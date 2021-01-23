import React from 'react'
import VehicleList from './VehicleList'

class VehicleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vehicle: {
        id: null,
        plate: '',
        status: 'available',
        type: 'Car',
        available_hours: 16
      },
      error: null,
      vehicles: [],
      loaded: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchItems = this.fetchItems.bind(this);
    this.selectVehicle = this.selectVehicle.bind(this);
    this.newRecord = this.newRecord.bind(this);
  }

  handleSubmit(ev) {
    const url = this.state.vehicle.id ? `/api/v1/vehicles/${this.state.vehicle.id}` : '/api/v1/vehicles'
    const requestOptions = {
        method: this.state.vehicle.id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicle: this.state.vehicle })
    };
    fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
          this.setState({ vehicle: data })
          this.fetchItems();
          this.forceUpdate();
        });
    ev.preventDefault();
    this.forceUpdate();
  }

  selectVehicle(vehicle) {
    this.setState({ vehicle: vehicle })
  };

  newRecord(ev) {
    this.setState({
      vehicle: {
        id: null,
        plate: '',
        status: 'available',
        type: 'Car',
        available_hours: 16
      },
    });
    this.forceUpdate();
  }

  componentDidMount(){
    this.fetchItems();
  }

  fetchItems(){
    fetch("/api/v1/vehicles")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            vehicles: result,
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
    const vehicleParams = this.state.vehicle
    vehicleParams[name] = evt.target.value
    this.setState({ vehicle: vehicleParams })
  }

  render() {
    return (
      <>
       <div className="row">
          <div className="col m12">
            <form onSubmit={this.handleSubmit}>
              <div className="card">
                <div className="card-content">
                  <div className="row">
                    <div className="col m8 offset-m2 center-align">
                      <span className="card-title">Vehículos</span>
                    </div>
                  </div>
                  <div className="container">
                    <div className="row">
                      <div className="col m12 offset-m2">
                        <div className="form-group">
                          <label htmlFor="plate">Placa</label>
                          <input type='text'
                                required={true}
                                name='plate'
                                value={ this.state.vehicle.plate || '' }
                                onChange={this.handleChange}
                                className='validate form-control'
                                placeholder="Placa" />

                          <label htmlFor="type">Tipo de Vehículo</label>
                          <select name="type"
                                  className="form-control"
                                  id="vehicle-type"
                                  onChange={this.handleChange}
                                  defaultValue={this.state.vehicle.type}>
                            <option selected={this.state.vehicle.type === 'Car'} value="Car">Carro</option>
                            <option selected={this.state.vehicle.type === 'Motorcycle'} value="Motorcycle">Moto</option>
                          </select>

                          <label htmlFor="status">Estado</label>
                          <select name="status"
                                  className="form-control"
                                  defaultValue={this.state.vehicle.status}
                                  id="status"
                                  onChange={this.handleChange}>
                            <option selected={this.state.vehicle.status === 'available'} value="available">Disponible</option>
                            <option selected={this.state.vehicle.status === 'mainteinance'} value="mainteinance">En Mantenimiento</option>
                            <option selected={this.state.vehicle.status === 'unavailable'} value="unavailable">No Disponible</option>
                          </select>

                          <label htmlFor="phone">Horas Disponibles</label>
                          <input type='number'
                                onChange={this.handleChange}
                                value={ this.state.vehicle.available_hours }
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
          <VehicleList items={this.state.vehicles} error={this.state.error} itemsLoaded={this.state.loaded} selectItem={this.selectVehicle}/>
        </div>
      </>
    );
  }
}

export default VehicleForm;
