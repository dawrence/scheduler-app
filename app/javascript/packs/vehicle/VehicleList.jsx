import React, { useState, useEffect } from 'react'

function VehicleList(props) {
  const items = props.items;
  const selectVehicle = props.selectItem;
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
            <th scope="col">Placa</th>
            <th scope="col">Tipo</th>
            <th scope="col">Estado</th>
            <th scope="col">Horas disponibles</th>
            <th scope="col">Horas Asignadas</th>
          </tr>
        </thead>
        <tbody>
        { items.length > 0 && items.map(item => {
              return (
                <tr key={`vehicle-${item.id}`} onClick={(e) => selectVehicle(item)}>
                  <td>
                    <span>{item.plate}</span>
                  </td>
                  <td>
                    <span>{item.type}</span>
                  </td>
                  <td>
                    <span>{item.status}</span>
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

export default VehicleList;
