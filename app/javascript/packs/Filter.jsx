import React from 'react'

class Filter extends React.Component {
  render(){
    return (
      <select className="form-select" defaultValue='1' style={ {display: "block" }}>
        <option value="1">Carros</option>
        <option value="2">Motos</option>
        <option value="3">Instructores</option>
        <option value="3">Estudiantes</option>
      </select>
    );
  }
}

export default Filter;
