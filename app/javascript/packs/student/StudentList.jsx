import React, { useState, useEffect } from 'react'
import DeleteIcon from '@material-ui/icons/Delete';

function StudentList(props) {
  const items = props.items;
  const selectStudent = props.selectItem;
  const deleteStudent = props.deleteItem
  const isLoaded = props.itemsLoaded;
  const [error, setError] = useState(props.error);
  const [stats, setStats] = useState(null);
  const [statsToggle, setStatsToggle] = useState(null);


  const selectInstructor = (e) => {
    e.preventDefault();
  };

  if(error) {
    return <div>Error: {error.message}</div>;
  }
  else if(!isLoaded) {
    return <div>Loading...</div>;
  }
  else {
    return (
      <table className="table highlight">
        <thead>
          <tr>
            <th scope="col">Nombre Completo</th>
            <th scope="col">Cedula</th>
            <th scope="col">Email</th>
            <th scope="col">Telefono</th>
            <th scope="col">Licencia</th>
            <th scope="col">Horas disponibles</th>
            <th scope="col">Horas Asignadas</th>
            <th scope="col"> Actions </th>
          </tr>
        </thead>
        <tbody>
        { items.length > 0 && items.map(item => {
              return (
                <tr key={`student-${item.id}`} onClick={(e) => selectStudent(item)}>
                  <td>
                    <span>{item.full_name}</span>
                  </td>
                  <td>
                    <span>{item.id_number}</span>
                  </td>
                  <td>
                    <span>{item.email}</span>
                  </td>
                  <td>
                    <span>{item.phone}</span>
                  </td>
                  <td>
                    <span>{item.license_type}</span>
                  </td>
                  <td>
                    <span>{item.available_hours}</span>
                  </td>
                  <td>
                    <span>{item.assigned_hours}</span>
                  </td>
                  <td>
                    {item.assigned_hours === 0 && ( <DeleteIcon onClick={(ev) => deleteStudent(ev, item.id)}/> )}
                  </td>
                </tr>
              );
          })
        }
        </tbody>
      </table>
    );
  }
}

export default StudentList;
