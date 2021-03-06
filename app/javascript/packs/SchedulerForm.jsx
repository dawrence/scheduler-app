import * as React from 'react';
import  { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import moment from 'moment';

import {
  AppointmentForm,
} from '@devexpress/dx-react-scheduler-material-ui';

const SchedulerForm = ({ onFieldChange, appointmentData, ...restProps }) => {
  const [vehicleId, setVehicleId] = useState(appointmentData.vehicle_id)
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
          alert(error)
          setVehicles([]);
        }
      )
  }
  const fetchInstructors=(vehicleId = null) => {
    fetch(`/api/v1/instructors/available?start_at=${encodeURIComponent(start_date)}&end_at=${encodeURIComponent(end_date)}&vehicle_id=${vehicleId}`)
      .then(res => res.json())
      .then(
        (result) => {
          setInstructors(result);
        },

        (error) => {
          alert(error)
          setInstructors([]);
        }
      )
  }
  const fetchStudents=(vehicleId = null) => {
    fetch(`/api/v1/students/available?start_at=${encodeURIComponent(start_date)}&end_at=${encodeURIComponent(end_date)}&vehicle_id=${vehicleId}`)
      .then(res => res.json())
      .then(
        (result) => {
          setStudents(result);
        },

        (error) => {
          alert(error)
          setStudents([]);
        }
      )
  }

  useEffect(()=>{
    fetchVehicles();
    fetchStudents(vehicleId);
    fetchInstructors(vehicleId);
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

  const onLicenseChange = (nextValue) => {
    onFieldChange({ license_type: nextValue });
  }

  const onClassTypeChange = (nextValue) => {
    onFieldChange({ class_type: nextValue });
  }

  const vehicleOptions = vehicles?.map((v) => {  return { id: v.id, text: `${v.plate} - ${v.string_type}` }}) || [];
  const instructorOptions = instructors?.map((v) => {  return { id: v.id, text: v.full_name}}) || [];
  const studentOptions = students?.map((v) => {  return { id: v.id, text: v.full_name}}) || [];
  const licenseOptions = ['a2', 'b1', 'c1'].map((v) => {  return { id: v, text: v.toUpperCase()} });
  const classTypeOptions = [{ id: 'practice', text: 'Práctica'}, { id:'test', text: 'Validación' }];

  return (
    <AppointmentForm.BasicLayout
      appointmentData={appointmentData}
      onFieldChange={(evt) => {
        console.log(evt)
        if(evt.vehicle_id){
          setVehicleId(evt.vehicle_id)
          fetchStudents(evt.vehicle_id);
          fetchInstructors(evt.vehicle_id);
        }
        onFieldChange(evt)
      }}
      {...restProps}
    >
      <div>
        <AppointmentForm.Label
          text="Instructor"
          type="title"
        />
        <Autocomplete
          id="combo-box-demo"
          options={instructorOptions}
          getOptionLabel={(option) => option.text}
          style={{ width: 300 }}
          onChange={(ev, next)=>{ onInstructorIdChange(next.id) } }
          renderInput={(params) => <TextField {...params} label="Instructor" variant="outlined" />}
        />
      </div>
      <div>
        <AppointmentForm.Label
          text="Estudiante"
          type="title"
        />
        <Autocomplete
          id="combo-box-demo"
          options={studentOptions}
          getOptionLabel={(option) => option.text}
          style={{ width: 300 }}
          onChange={(ev, next)=>{ onStudentIdChange(next.id) } }
          renderInput={(params) => <TextField {...params} label="Estudiante" variant="outlined" />}
        />
      </div>
      <div>
        <AppointmentForm.Label
          text="Licencia"
          type="title"
        />
        <AppointmentForm.Select
          value={appointmentData?.license_type || ''}
          availableOptions={licenseOptions}
          onValueChange={onLicenseChange}
          placeholder="Tipo de Licencia"
        />
      </div>
      <div>
        <AppointmentForm.Label
          text="Tipo de Clase"
          type="title"
        />
        <AppointmentForm.Select
          value={appointmentData?.class_type || ''}
          availableOptions={classTypeOptions}
          onValueChange={onClassTypeChange}
          placeholder="Tipo de Clase"
        />
      </div>
    </AppointmentForm.BasicLayout>
  );
};

export default SchedulerForm;
