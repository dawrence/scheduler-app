import * as React from 'react';
import  { useState, useEffect } from 'react';
import moment from 'moment';

import {
  AppointmentForm,
} from '@devexpress/dx-react-scheduler-material-ui';

const SchedulerForm = ({ onFieldChange, appointmentData, ...restProps }) => {
  const [vehicles, setVehicles] = useState([])
  const [instructors, setInstructors] = useState([])
  const [students, setStudents] = useState([])
  const start_date = moment(appointmentData.startDate).toISOString()
  const end_date = moment(appointmentData.endDate).toISOString()

  const fetchVehicles=() => {
    fetch(`/api/v1/vehicles/available?start_at=${encodeURIComponent(start_date)}&end_at=${encodeURIComponent(end_date)}`)
      .then(res => res.json())
      .then(
        (result) => {
          setVehicles(result);
        },

        (error) => {
          setVehicles([]);
        }
      )
  }
  const fetchInstructors=() => {
    fetch(`/api/v1/instructors/available?start_at=${encodeURIComponent(start_date)}&end_at=${encodeURIComponent(end_date)}`)
      .then(res => res.json())
      .then(
        (result) => {
          setInstructors(result);
        },

        (error) => {
          setInstructors([]);
        }
      )
  }
  const fetchStudents=() => {
    fetch(`/api/v1/students/available?start_at=${encodeURIComponent(start_date)}&end_at=${encodeURIComponent(end_date)}`)
      .then(res => res.json())
      .then(
        (result) => {
          setStudents(result);
        },

        (error) => {
          setStudents([]);
        }
      )
  }

  useEffect(()=>{
    fetchVehicles();
    fetchStudents();
    fetchInstructors();
  }, []);

  const onVehicleIdChange = (nextValue) => {
    onFieldChange({ vehicle_id: nextValue });
  };

  const onInstructorIdChange = (nextValue) => {
    onFieldChange({ instructor_id: nextValue });
  };

  const onStudentIdChange = (nextValue) => {
    onFieldChange({ student_id: nextValue });
  };

  const vehicleOptions = vehicles?.map((v) => {  return { id: v.id, text: `${v.plate} - ${v.string_type}` }}) || [];
  const instructorOptions = instructors?.map((v) => {  return { id: v.id, text: v.full_name}}) || [];
  const studentOptions = students?.map((v) => {  return { id: v.id, text: v.full_name}}) || [];

  return (
    <AppointmentForm.BasicLayout
      appointmentData={appointmentData}
      onFieldChange={onFieldChange}
      {...restProps}
    >
      <div>
        <AppointmentForm.Label
          text="Vehiculo"
          type="title"
        />
        <AppointmentForm.Select
          value={appointmentData?.vehicle_id || ''}
          availableOptions={vehicleOptions}
          onValueChange={onVehicleIdChange}
          placeholder="Vehiculo"
        />
      </div>
      <div>
        <AppointmentForm.Label
          text="Instructor"
          type="title"
        />
        <AppointmentForm.Select
          value={appointmentData?.instructor_id || ''}
          availableOptions={instructorOptions}
          onValueChange={onInstructorIdChange}
          placeholder="Instructor"
        />
      </div>
      <div>
        <AppointmentForm.Label
          text="Estudiante"
          type="title"
        />
        <AppointmentForm.Select
          value={appointmentData?.student_id || ''}
          availableOptions={studentOptions}
          onValueChange={onStudentIdChange}
          placeholder="Estudiante"
        />
      </div>
    </AppointmentForm.BasicLayout>
  );
};

export default SchedulerForm;