import 'date-fns';
import React from 'react'
import VehicleList from './VehicleList'
import CurrentUserHelper from '../helpers/CurrentUserHelper';
import { makeStyles } from '@material-ui/core/styles';
import { ColorPicker } from 'material-ui-color'; 
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {format, parse} from 'date-fns';
import Checkbox from '@material-ui/core/Checkbox';
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import DateUtils from '@date-io/date-fns'; 
import Typography from '@material-ui/core/Typography';
import {
  MuiPickersUtilsProvider,
  TimePicker ,
} from '@material-ui/pickers';
import axios from 'axios';

const useStyles = makeStyles({
  root: {
    '& .sc-iBPRYJ': {
      display: 'flex',
      alignItems: 'center'
    },
    '& button, & button:hover ': {
      width: '2rem',
      minWidth: '2rem',
      height: '2rem',
      minHeight: '2rem',
    },
    '& input.MuiInputBase-input.MuiInput-input': {
      margin: 0
    },
    '& .MuiInput-underline:before, & .MuiInput-underline:after': {
      border: 0
    },
  },
  dayTimer: {
    padding: '0.5rem',
    '& .day-name ': {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0 0.75rem',
      borderBottom: '1px solid #9e9e9e'
    },
    '& .time-inputs ': {
      display: 'flex',
      justifyContent: 'space-between',
      '& > *': {
        margin: '0 0.75rem',
        '& input': {
          borderBottom: 'none',
          margin: 0
        }
      }
    }
  },
  allDayText: {
    padding: '0.75rem'
  }
});

const ColorPickerInput = ({value, onChange}) =>{
  const useInnerStyles = makeStyles({
    root: {
      '& button, & button:hover ': {
        backgroundColor: value,
      },
    },
  });
  const variableClasses = useInnerStyles();
  const classes = useStyles();
  return(
    <div className={[variableClasses.root, classes.root].join(' ')}>
      <ColorPicker
        value = { value }
        onChange = { onChange }
      />
    </div>
  );
}

const DayTimePicker = ({ schedule, dayNumber, dayName, onSelect}) => {
  const classes = useStyles();
  const [fromTime, setFromTime] = React.useState(
    typeof schedule === 'string' ? new Date() : parse(schedule.from, "hh:mm aaa", new Date())
  );
  const [toTime, setToTime] = React.useState(
    typeof schedule === 'string' ? new Date() : parse(schedule.to, "hh:mm aaa", new Date())
  );
  const [rangeType, changeRangeType] = React.useState(typeof schedule !== 'string');
  React.useEffect(() => {
    const period = {
      from: format(fromTime, "hh:mm aaa"), 
      to: format(toTime, "hh:mm aaa"), 
    }
    onSelect(dayNumber, rangeType ? period : "allDay");
  }, [rangeType, toTime, fromTime])
  return(
    <div className={classes.dayTimer}>
      <div className="day-name">
        <Typography variant="h6">{dayName}</Typography>
        <FormControlLabel
          control={
            <Checkbox 
              icon={<AccessTimeIcon />} 
              checkedIcon={<WatchLaterIcon />} 
              name="chRT"
              color="primary"
              checked={rangeType}
              onChange={({ target }) => changeRangeType(target.checked)}
            />
          }
          label="Periodo"
        />
      </div>
      <div className="time-inputs">
        {
          rangeType
          ?
            <React.Fragment>
              <TimePicker
                value={fromTime}
                onChange={setFromTime}
              />
              <TimePicker
                value={toTime}
                onChange={setToTime}
              />
            </React.Fragment>
          : 
            <div className={classes.allDayText}>
              <Typography color={'primary'}>Disponible todo el dia</Typography>
            </div>
        }        
      </div>
    </div>
  )
}

const DaysList = ({schedule, onSelect}) => {
  const days = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"]
  return (
    <MuiPickersUtilsProvider utils={DateUtils}>
      {
        days.map((dayName, index) => (
          <DayTimePicker 
            key={index}
            schedule={schedule[index+1]}
            dayNumber={index+1} 
            dayName={dayName} 
            onSelect={onSelect} 
          />
        ))
      }
    </MuiPickersUtilsProvider>
  );
 }
class VehicleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vehicle: {
        id: null,
        plate: '',
        status: 'available',
        type: 'Car',
        available_hours: 16,
        color: '#7edbc1',
        schedule: {
          1: "allDAy", 2: "allDAy", 3: "allDAy",4: "allDAy",5: "allDAy",6: "allDAy"
        }
      },
      error: null,
      vehicles: [],
      loaded: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeColor = this.handleChangeColor.bind(this);
    this.handleScheduleSelection = this.handleScheduleSelection.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchItems = this.fetchItems.bind(this);
    this.fetchCurrentUser = this.fetchCurrentUser.bind(this);
    this.selectVehicle = this.selectVehicle.bind(this);
    this.newRecord = this.newRecord.bind(this);
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

  handleSubmit(ev) {
    const requestOptions = {
        url: this.state.vehicle.id ? `/api/v1/vehicles/${this.state.vehicle.id}` : '/api/v1/vehicles',
        method: this.state.vehicle.id ? 'patch' : 'post',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ vehicle: this.state.vehicle })
    };
    axios(requestOptions)
      .then(({ data }) => {
          this.setState({ vehicle: data })
          this.fetchItems();
          this.forceUpdate();
        })
        .catch((error) => alert(error));
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
        available_hours: 16,
        color: '#7edbc1',
        schedule: {
          1: "allDAy", 2: "allDAy", 3: "allDAy",4: "allDAy",5: "allDAy",6: "allDAy"
        }
      },
    });
    this.forceUpdate();
  }

  componentDidMount(){
    this.fetchCurrentUser();
    this.fetchItems();
  }

  fetchItems(){
    axios.get("/api/v1/vehicles")
      .then(({ data }) => {
        this.setState({
          vehicles: data,
          loaded: true
        })
      })
      .catch((error) => alert(error));
  }

  handleChange(evt) {
    const name = evt.target.name
    const vehicleParams = this.state.vehicle
    vehicleParams[name] = evt.target.value
    this.setState({ vehicle: vehicleParams })
  }

  handleChangeColor(color){
    color = color === "" 
            ? '#' 
            : color?.hex
            ? `#${color.hex}`
            : color;
    this.setState((oldState) => ({
        vehicle: {...oldState.vehicle, color}
      })
    );
  }

  handleScheduleSelection(day, schedule){
    this.setState((oldState) => ({
      vehicle: { 
        ...oldState.vehicle, 
        schedule: { 
          ...oldState.vehicle.schedule, 
          [day]: schedule
        } 
      }
    }));
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
                        <span className="card-title">Vehículos</span>
                      </div>
                    </div>
                    <div className="container">
                      <div className="row">
                        <div className="col m12 offset-m1">
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
                            <ColorPickerInput
                              disablePlainColor
                              value = {this.state.vehicle.color}
                              onChange = {this.handleChangeColor}
                            />
                          </div>
                          <div className='form-group'>
                            <button type="submit" className="waves-effect waves-light btn">Guardar</button>
                          </div>
                          <div className='form-group'>
                            <button className="waves-effect waves-light btn" onClick={this.newRecord}>Nuevo</button>
                          </div>
                        </div>
                        <div className="col m12 offset-m1">
                          <DaysList 
                            schedule={this.state.vehicle.schedule} 
                            onSelect={this.handleScheduleSelection}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        }
        {
          CurrentUserHelper.canPerform(this.state.currentUser) &&
          <div className="col-12" style={{overflow: 'auto'}}>
            <VehicleList items={this.state.vehicles} error={this.state.error} itemsLoaded={this.state.loaded} selectItem={this.selectVehicle}/>
          </div>
        }
      </>
    );
  }
}

export default VehicleForm;
