import * as React from 'react';
import  { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import Room from '@material-ui/icons/Room';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import classNames from 'clsx';
import { blue } from '@material-ui/core/colors';
import Filter from './Filter'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { styled } from '@material-ui/core/styles';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { ViewState, EditingState, IntegratedGrouping, GroupingState, IntegratedEditing} from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  MonthView,
  Appointments,
  AppointmentForm,
  AppointmentTooltip,
  Toolbar,
  Resources,
  GroupingPanel,
  DragDropProvider,
  DateNavigator,
  DayView
} from '@devexpress/dx-react-scheduler-material-ui';
import { withStyles } from '@material-ui/core/styles';
import {
  Link
} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

import SchedulerForm from './SchedulerForm';

const style = ({ palette }) => ({
  icon: {
    color: palette.action.active,
  },
  textCenter: {
    textAlign: 'center',
  },
  firstRoom: {
    background: 'url(https://js.devexpress.com/Demos/DXHotels/Content/Pictures/Lobby-4.jpg)',
  },
  secondRoom: {
    background: 'url(https://js.devexpress.com/Demos/DXHotels/Content/Pictures/MeetingRoom-4.jpg)',
  },
  thirdRoom: {
    background: 'url(https://js.devexpress.com/Demos/DXHotels/Content/Pictures/MeetingRoom-0.jpg)',
  },
  header: {
    height: '260px',
    backgroundSize: 'cover',
  },
  commandButton: {
    backgroundColor: 'rgba(255,255,255,0.65)',
  },
});

const useStyles = makeStyles(theme => ({
  todayCell: {
    backgroundColor: fade(theme.palette.primary.main, 0.1),
    '&:hover': {
      backgroundColor: fade(theme.palette.primary.main, 0.14),
    },
    '&:focus': {
      backgroundColor: fade(theme.palette.primary.main, 0.16),
    },
  },
  weekendCell: {
    backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
    '&:hover': {
      backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
    },
    '&:focus': {
      backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
    },
  },
  today: {
    backgroundColor: fade(theme.palette.primary.main, 0.16),
  },
  weekend: {
    backgroundColor: fade(theme.palette.action.disabledBackground, 0.06),
  },
}));

const styles = theme => ({
  button: {
    color: theme.palette.background.default,
    padding: 0,
  },
  text: {
    paddingTop: theme.spacing(1),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

const messages = {
  moreInformationLabel: '',
};

const WeekTimeTableCell = (props) => {
  const classes = useStyles();
  const { startDate } = props;
  const date = new Date(startDate);

  if (date.getDate() === new Date().getDate()) {
    return <WeekView.TimeTableCell {...props} className={classes.todayCell} />;
  } if (date.getDay() === 0 || date.getDay() === 6) {
    return <WeekView.TimeTableCell {...props} className={classes.weekendCell} />;
  } return <WeekView.TimeTableCell {...props} />;
};

const DayScaleCell = (props) => {
  const classes = useStyles();
  const { startDate, today } = props;

  if (today) {
    return <WeekView.DayScaleCell {...props} className={classes.today} />;
  } if (startDate.getDay() === 0 || startDate.getDay() === 6) {
    return <WeekView.DayScaleCell {...props} className={classes.weekend} />;
  } return <WeekView.DayScaleCell {...props} />;
};

const ExternalViewSwitcher = ({
  currentViewName,
  onChange,
}) => (
  <RadioGroup
    aria-label="Views"
    style={{ flexDirection: 'row' }}
    name="views"
    value={currentViewName}
    onChange={onChange}
  >
    <FormControlLabel value="Day" control={<Radio />} label="Día" />
    <FormControlLabel value="Week" control={<Radio />} label="Semana" />
    <FormControlLabel value="Month" control={<Radio />} label="Mes" />
  </RadioGroup>
);

const Content = withStyles(style, { name: 'Content' })(({
  children, appointmentData, classes, ...restProps
}) => (
  <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
    <Grid container alignItems="center">
      <Grid item xs={2} className={classes.textCenter}>
        <Room className={classes.icon} />
      </Grid>

      {
        appointmentData.student.is_debtor_or_has_fines &&
        <div className='alert alert-danger' role="alert">
          Estudiante presenta mora o multas
        </div>
      }

      <Grid item xs={10}>
        <span>Instructor: {appointmentData.instructor.full_name}</span>
      </Grid>
      <Grid item xs={10}>
        <span>Estudiante: {appointmentData.student.full_name}</span>
      </Grid>
      <Grid item xs={10}>
        <span>{appointmentData.vehicle.type} - {appointmentData.vehicle.plate}</span>
      </Grid>
    </Grid>
  </AppointmentTooltip.Content>
));

const CommandButton = withStyles(style, { name: 'CommandButton' })(({
  classes, ...restProps
}) => (
  <AppointmentTooltip.CommandButton {...restProps} className={classes.commandButton} />
));

const AppointmentBase = ({
  children,
  data,
  onClick,
  classes,
  toggleVisibility,
  onAppointmentMetaChange,
  ...restProps
}) => (
  <Appointments.Appointment
    {...restProps}
  >
    <React.Fragment>
      <IconButton
        className={classes.button}
        onClick={({ target }) => {
          toggleVisibility();
          onAppointmentMetaChange({ target: target.parentElement.parentElement, data });
        }}
      >
        <InfoIcon fontSize="small" />
      </IconButton>
      {children}
    </React.Fragment>
  </Appointments.Appointment>
);

const TextEditor = (props) => {
  // eslint-disable-next-line react/destructuring-assignment
  if (props.type === 'multilineTextEditor') {
    return null;
  } return <AppointmentForm.TextEditor {...props} />;
};

const Appointment = withStyles(styles, { name: 'Appointment' })(AppointmentBase);

// Crazy code over here. Consider moving this into several components.
export default class AppScheduler extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      currentDate: new Date(),
      visible: false,
      loading: true,
      filterType: null,
      filterValue: null,
      currentGroup: 'all',
      data: [],
      vehicles: [],
      currentViewName: 'Month',
      appointmentMeta: {
        target: null,
        data: {},
      },
    };

    this.fetchAppointments = this.fetchAppointments.bind(this);
    this.fetchVehicles = this.fetchVehicles.bind(this);
    this.commitChanges = this.commitChanges.bind(this);
    this.saveAppointment = this.saveAppointment.bind(this);
    this.toggleVisibility = this.toggleVisibility.bind(this);
    this.currentViewNameChange = this.currentViewNameChange.bind(this);
    this.onAppointmentMetaChange = this.onAppointmentMetaChange.bind(this);
    this.myAppointment = this.myAppointment.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleFilterWithId = this.handleFilterWithId.bind(this);
    this.onCurrentDateChange = this.onCurrentDateChange.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleGroupChange = this.handleGroupChange.bind(this);
  }


  componentDidMount() {
    this.fetchVehicles();
    this.fetchAppointments();
  }

  handleError(res) {
    const data = res.response.data;
    this.setState({ loading: false })
    alert(data.error)
  }

  toggleVisibility(){
    const { visible: tooltipVisibility } = this.state;
    this.setState({ visible: !tooltipVisibility });
  }

  currentViewNameChange(e){
    this.setState({ currentViewName: e.target.value });
  };

  onAppointmentMetaChange({ data, target }){
    this.setState({ appointmentMeta: { data, target } });
  };

  // think a way to handle responses an errors more beautiful.
  commitChanges({ added, changed, deleted }) {
    if(added) {
      this.saveAppointment(added).then((result) => {
        this.fetchAppointments();
      }).catch(this.handleError)
    }
    if (changed) {
      this.updateAppointment(changed).then((result) => {
        this.fetchAppointments();
      }).catch(this.handleError)
    }

    if(deleted !== undefined) {
      this.deleteAppoinment(deleted).then((response)=>{
        this.fetchAppointments();
      }).catch(this.handleError)
    }
  }

  deleteAppoinment(params) {
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: ''
    };
    this.setState({ loading: true })
    return axios.delete(`/api/v1/appointments/${params}`, {})
          .then(() => this.setState({ loading: false }))
  }

  saveAppointment(params) {
    this.setState({ loading: true })
    return axios.post('/api/v1/appointments', params)
                .then(() => this.setState({ loading: false }))
  }

  onCurrentDateChange(params){
    this.setState({ currentDate: params });
    if (params.getMonth() !== this.state.currentDate.getMonth()) {
      this.fetchAppointments(null, null, params);
      this.fetchVehicles();
    }
  }

  updateAppointment(params) {
    const appt_id = Object.keys(params)[0]
    this.setState({ loading: true })
    return axios.patch(`/api/v1/appointments/${appt_id}`, params[appt_id])
                .then(() => this.setState({ loading: false }))
  }

  fetchAppointments(filterValue = null, filterType = null, currentDate=this.state.currentDate){
    const startOfMonth = encodeURIComponent(moment(currentDate).startOf('month').toISOString());
    const endOfMonth   = encodeURIComponent(moment(currentDate).endOf('month').toISOString());

    let url = `/api/v1/appointments?start_at=${startOfMonth}&end_at=${endOfMonth}`;
    if(filterType && filterValue) {
      url = url+`&filter_type=${filterType}&filter_value=${filterValue}`
    }
    this.setState({ loading: true })
    return axios.get(url)
      .then((result) => {
          this.setState({
            data: result.data,
            loading: false
          })
        })
      .catch((error) => {
          this.setState({
            error: error,
            loading: false
          })
        }
      )
  }

  fetchVehicles(){
    const startOfMonth = encodeURIComponent(moment(this.state.currentDate).startOf('month').toISOString());
    const endOfMonth   = encodeURIComponent(moment(this.state.currentDate).endOf('month').toISOString());
    axios.get(`/api/v1/vehicles/available?start_at=${startOfMonth}&end_at=${endOfMonth}`)
    .then((result) => {
      this.setState({ vehicles: result.data });
    })
    .catch((error) => {
        alert(error)
        this.setState({ vehicles: [], error: error });
      }
    )
  }

  // check why isn't working with the state.
  handleFilter(ev, type) {
    const value = ev.target.value;
    this.fetchAppointments(value, type);
  }

  handleFilterWithId(id, type) {
    this.fetchAppointments(id, type);
  }

  myAppointment(props) {
    return (
      <Appointment
        {...props}
        toggleVisibility={this.toggleVisibility}
        onAppointmentMetaChange={this.onAppointmentMetaChange}
      />
    );
  }

  useStyles() {
    return makeStyles((theme) => ({
      backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
      },
    }))
  }

  handleGroupChange(event, newGroup) {
    if(newGroup) {
      this.setState({ currentGroup: newGroup })
    }
    else{
      this.setState({ currentGroup: 'all' })
    }
  }

  render() {
    const { data, currentViewName, currentDate, visible, appointmentMeta, vehicles, loading } = this.state;
    const BackdropStyled = styled(Backdrop)({
      zIndex: 9999,
      color: '#fff',
    });
    const resources = [{
      fieldName: 'vehicle_id',
      title: 'Vehicle',
      instances: vehicles?.filter((v) => this.state.currentGroup === 'all' ? true : v.type === this.state.currentGroup)
                          .map((r) => { return {text: `${r.string_type} - ${r.plate}`, id: r.id, color: r.color }; }) || []
    }];
    const grouping = vehicles.length > 0 ? [{
      resourceName: 'vehicle_id',
    }] : [];

    const TimeTableCell = props => (
      <MonthView.TimeTableCell
        {...props}
        onDoubleClick={(() => {
          this.setState({
            currentDate: props.startDate ,
            currentViewName: 'Day'
          });
        }).bind(this)}
      />
    )
    return (
      <>
        <BackdropStyled open={loading}>
          <CircularProgress color="inherit" />
        </BackdropStyled>
        <Filter filter={this.handleFilter} filterWithId={this.handleFilterWithId}/>
        <ToggleButtonGroup
          value={this.state.currentGroup}
          exclusive
          onChange={this.handleGroupChange}
          aria-label="text alignment"
        >
          <ToggleButton value="Car" aria-label="left aligned">
            Carro
          </ToggleButton>
          <ToggleButton value="Motorcycle" aria-label="left aligned">
            Moto
          </ToggleButton>
        </ToggleButtonGroup>

        <React.Fragment>
          <ExternalViewSwitcher
            currentViewName={currentViewName}
            onChange={this.currentViewNameChange}
          />
          <Paper>
            <Scheduler
              data={data}
              height={660}
              locale='es-ES'
            >
              <ViewState
                currentDate={currentDate}
                onCurrentDateChange={this.onCurrentDateChange}
                currentViewName={currentViewName}
              />
              <DayView
                startDayHour={5}
                endDayHour={23}
              />
              <WeekView
                startDayHour={5}
                endDayHour={23}
                timeTableCellComponent={WeekTimeTableCell}
                dayScaleCellComponent={DayScaleCell}
              />
              <MonthView
                timeTableCellComponent={TimeTableCell}
                dayScaleCellComponent={DayScaleCell}
              />
              <Toolbar />
              <DateNavigator />
              <EditingState
                onCommitChanges={this.commitChanges}
              />
              <IntegratedEditing />
              <Appointments
                appointmentComponent={this.myAppointment}
              />
              <AppointmentTooltip
                showCloseButton
                showOpenButton
                showDeleteButton
                visible={visible}
                contentComponent={Content}
                commandButtonComponent={CommandButton}
                onVisibilityChange={this.toggleVisibility}
                appointmentMeta={appointmentMeta}
                onAppointmentMetaChange={this.onAppointmentMetaChange}
              />
              { vehicles.length > 0 && (<Resources data={resources} mainResourceName="vehicle_id"/>) }
              { grouping.length > 0 && ( <GroupingState grouping={grouping}/>) }
              { grouping.length > 0 && ( <IntegratedGrouping />) }
              { grouping.length > 0 && (<GroupingPanel />) }
              <DragDropProvider/>
              <AppointmentForm
                basicLayoutComponent={SchedulerForm}
                textEditorComponent={TextEditor}
                messages={messages}
              />
            </Scheduler>
          </Paper>
        </React.Fragment>
      </>
    );
  }
}
