import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom";

function InstructorList(props) {
  const items = props.items;
  const selectInstructor = props.selectItem
  const isLoaded = props.itemsLoaded;
  const [error, setError] = useState(props.error);
  const [stats, setStats] = useState(null);
  const [statsToggle, setStatsToggle] = useState(null);
  const history = useHistory();

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
            <th scope="col">Tipo de Licencia</th>
            <th scope="col">Horas disponibles</th>
            <th scope="col">Horas asignadas</th>
          </tr>
        </thead>
        <tbody>
        { items.length > 0 && items.map(item => {
              return (
                <tr key={`instructor-${item.id}`} onClick={(e) => selectInstructor(item)}>
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
                </tr>
              );
          })
        }
        </tbody>
      </table>
    );
  }
}

export default InstructorList;
