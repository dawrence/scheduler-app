import * as React from 'react';
import  { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import MoreIcon from '@material-ui/icons/MoreVert';
import Grid from '@material-ui/core/Grid';
import Room from '@material-ui/icons/Room';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import classNames from 'clsx';
import Filter from './Filter'
import { ViewState, EditingState, IntegratedEditing} from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  MonthView,
  Appointments,
  AppointmentForm,
  AppointmentTooltip,
  Toolbar,
  DateNavigator,
  DayView,
  TodayButton
} from '@devexpress/dx-react-scheduler-material-ui';
import { withStyles } from '@material-ui/core/styles';

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
      currentDate: moment(),
      visible: false,
      filterType: null,
      filterValue: null,
      data: [],
      currentViewName: 'Month',
      appointmentMeta: {
        target: null,
        data: {},
      },
    };

    this.fetchAppointments();

    this.commitChanges = this.commitChanges.bind(this);
    this.saveAppointment = this.saveAppointment.bind(this);
    this.toggleVisibility = this.toggleVisibility.bind(this);
    this.currentViewNameChange = this.currentViewNameChange.bind(this);
    this.onAppointmentMetaChange = this.onAppointmentMetaChange.bind(this);
    this.myAppointment = this.myAppointment.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
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

  commitChanges({ added, changed, deleted }) {
    if(added) {
      this.saveAppointment(added).then((result) => {
        this.fetchAppointments();
      })
    }
    if (changed) {
      this.updateAppointment(changed).then((result) => {
        this.fetchAppointments();
      })
    }

    if(deleted !== undefined) {
      this.deleteAppoinment(deleted).then((response)=>{
        this.setState(() => { [...data, { id: response.id, ...added}] } )
        data = data.filter(appointment => appointment.id !== deleted);
      })
    }
  }

  saveAppointment(params) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
    };
    return fetch('/api/v1/appointments', requestOptions).then(response => response.json())
  }

  updateAppointment(params) {
    const appt_id = Object.keys(params)[0]
    const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params[appt_id])
    };
    return fetch(`/api/v1/appointments/${appt_id}`, requestOptions).then(response => response.json())
  }

  fetchAppointments(filterValue = null, filterType = null){
    const startOfMonth = encodeURIComponent(moment().startOf('month').format('YYYY-MM-DD hh:mm'));
    const endOfMonth   = encodeURIComponent(moment().endOf('month').format('YYYY-MM-DD hh:mm'));

    let url = `/api/v1/appointments?start_at=${startOfMonth}&end_at=${endOfMonth}`;
    if(filterType && filterValue) {
      url = url+`&filter_type=${filterType}&filter_value=${filterValue}`
    }
    fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            data: result
          })
        },

        (error) => {
          this.setState({
            error: error
          })
        }
      )
  }

  // check why isn't working with the state.
  handleFilter(ev, type) {
    const value = ev.target.value;
    this.fetchAppointments(value, type);
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

  render() {
    const { data, currentViewName, visible, appointmentMeta } = this.state;

    return (
      <>
        <Filter filter={this.handleFilter}/>
        <React.Fragment>
          <ExternalViewSwitcher
            currentViewName={currentViewName}
            onChange={this.currentViewNameChange}
          />
          <Paper>
            <Scheduler
              data={data}
              height={660}
            >
              <ViewState
                defaultCurrentDate={this.state.currentDate}
                currentViewName={currentViewName}
              />
              <DayView
                startDayHour={5}
                endDayHour={20}
              />
              <WeekView
                startDayHour={5}
                endDayHour={20}
              />
              <MonthView />
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
                visible={visible}
                contentComponent={Content}
                commandButtonComponent={CommandButton}
                onVisibilityChange={this.toggleVisibility}
                appointmentMeta={appointmentMeta}
                onAppointmentMetaChange={this.onAppointmentMetaChange}
              />
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
