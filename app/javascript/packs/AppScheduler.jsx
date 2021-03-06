import * as React from 'react';
import  { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import MoreIcon from '@material-ui/icons/MoreVert';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import Room from '@material-ui/icons/Room';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import classNames from 'clsx';
import { blue } from '@material-ui/core/colors';
import Filter from './Filter'
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
      currentDate: new Date(),
      visible: false,
      filterType: null,
      filterValue: null,
      data: [],
      vehicles: [],
      currentViewName: 'Month',
      appointmentMeta: {
        target: null,
        data: {},
      },
    };
    this.fetchVehicles();
    this.fetchAppointments();
    this.fetchAppointments = this.fetchAppointments.bind(this);
    this.commitChanges = this.commitChanges.bind(this);
    this.saveAppointment = this.saveAppointment.bind(this);
    this.toggleVisibility = this.toggleVisibility.bind(this);
    this.currentViewNameChange = this.currentViewNameChange.bind(this);
    this.onAppointmentMetaChange = this.onAppointmentMetaChange.bind(this);
    this.myAppointment = this.myAppointment.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleFilterWithId = this.handleFilterWithId.bind(this);
    this.onCurrentDateChange = this.onCurrentDateChange.bind(this);
  }

  handleError(res) {
    const data = res.response.data;
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
    return axios.delete(`/api/v1/appointments/${params}`, {})
  }

  saveAppointment(params) {
    return axios.post('/api/v1/appointments', params)
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
    return axios.patch(`/api/v1/appointments/${appt_id}`, params[appt_id])
  }

  fetchAppointments(filterValue = null, filterType = null, currentDate=this.state.currentDate){
    const startOfMonth = encodeURIComponent(moment(currentDate).startOf('month').toISOString());
    const endOfMonth   = encodeURIComponent(moment(currentDate).endOf('month').toISOString());

    let url = `/api/v1/appointments?start_at=${startOfMonth}&end_at=${endOfMonth}`;
    if(filterType && filterValue) {
      url = url+`&filter_type=${filterType}&filter_value=${filterValue}`
    }
    return axios.get(url)
      .then((result) => {
          this.setState({
            data: result.data
          })
        })
      .catch((error) => {
          this.setState({
            error: error
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

  render() {
    const { data, currentViewName, currentDate, visible, appointmentMeta, vehicles } = this.state;
    const resources = [{
      fieldName: 'vehicle_id',
      title: 'Vehicle',
      instances: vehicles?.map((r, i) => { return {text: `${r.string_type} - ${r.plate}`, id: r.id, color: blue[i*100] }; }) || []
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
        <Filter filter={this.handleFilter} filterWithId={this.handleFilterWithId}/>
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
              />
              <MonthView
                timeTableCellComponent={TimeTableCell}
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
