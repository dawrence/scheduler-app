import React, { useState, useEffect } from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import AssignmentIcon from '@material-ui/icons/Assignment';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import numeral from 'numeral';
import CurrentUserHelper from '../helpers/CurrentUserHelper';

const useStyles = makeStyles({
  restrictedStudent: {
    backgroundColor: red[50],
  },
});

function StudentList({currentUser, ...props}) {
  const classes = useStyles();
  const items = props.items;
  const selectStudent = props.selectItem;
  const deleteStudent = props.deleteItem
  const isLoaded = props.itemsLoaded;
  const { markAsDebtor, unmarkAsDebtor, payFine, setFine } = props;
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
            <th scope="col">Deudor moroso</th>
            <th scope="col">Multas</th>
            <th scope="col">Multas Valor</th>
            <th scope="col">Telefono</th>
            <th scope="col">Licencia</th>
            <th scope="col">Horas disponibles</th>
            <th scope="col">Horas Asignadas</th>
            {
              CurrentUserHelper.canPerform(currentUser) &&
              <th scope="col"> Actions </th>
            }
          </tr>
        </thead>
        <tbody>
        { items.length > 0 && items.map(item => {
              return (
                <tr
                  key={`student-${item.id}`}
                  className={item.is_debtor_or_has_fines ? classes.restrictedStudent : {}}
                  onClick={(e) => selectStudent(item)}
                >
                  <td>
                    <span><a href={`/students/${item.id}`} target='_blank'>{item.full_name}</a></span>
                  </td>
                  <td>
                    <span>{item.id_number}</span>
                  </td>
                  <td>
                    <span>{item.email}</span>
                  </td>
                  <td>
                    <Typography color={item.debtor ? "error" : "initial"}>
                      {item.debtor ? "Moroso" : "No moroso"}
                    </Typography>
                  </td>
                  <td>
                    <span>{item.total_fines}</span>
                  </td>
                  <td>
                    <span>{numeral(item.total_fines_value).format('$ 0,0')}</span>
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
                  {
                    CurrentUserHelper.canPerform(currentUser) &&
                    <td>
                      {
                        item.assigned_hours === 0 &&
                        <DeleteIcon onClick={(ev) => deleteStudent(ev, item.id)}/>
                      }
                      {
                        CurrentUserHelper.canPerform(currentUser, "admin", "treasurer") &&
                        (
                          item.debtor
                          ? <AssignmentLateIcon color={"error"} onClick={(ev) => unmarkAsDebtor(ev, item.id)}/>
                          : <AssignmentTurnedInIcon onClick={(ev) => markAsDebtor(ev, item.id)}/>
                        )
                      }
                      {
                        CurrentUserHelper.canPerform(currentUser, "admin", "treasurer") &&
                        <NewReleasesIcon onClick={(ev) => setFine(ev, item.id)}/>
                      }
                      {
                        (CurrentUserHelper.canPerform(currentUser, "admin", "treasurer") && item.total_fines > 0) &&
                        <AttachMoneyIcon onClick={(ev) => payFine(ev, item.id)}/>
                      }
                    </td>
                  }

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
