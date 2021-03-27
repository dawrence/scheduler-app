import React, { useState, useEffect } from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import BeenhereOutlinedIcon from '@material-ui/icons/BeenhereOutlined';
import AssignmentIndRoundedIcon from '@material-ui/icons/AssignmentIndRounded';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import numeral from 'numeral';
import CurrentUserHelper from '../helpers/CurrentUserHelper';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  restrictedStudent: {
    backgroundColor: red[50],
  },
  table: {
    minWidth: 650,
  },
});

function StudentList({currentUser, ...props}) {
  const classes = useStyles();
  const items = props.items;
  const selectStudent = props.selectItem;
  const deleteStudent = props.deleteItem
  const isLoaded = props.itemsLoaded;
  const { markAsDebtor, unmarkAsDebtor, payFine, setFine, changeStatus } = props;
  const [error, setError] = useState(props.error);
  const [stats, setStats] = useState(null);
  const [statsToggle, setStatsToggle] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const selectInstructor = (e) => {
    e.preventDefault();
  };

  const handleChangePage = (e, newPage) => {
    e.preventDefault();
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if(error) {
    return <div>Error: {error.message}</div>;
  }
  else if(!isLoaded) {
    return <div>Loading...</div>;
  }
  else {
    return (
      <Paper className={classes.paper}>
        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Nombre Completo</TableCell>
                <TableCell align="right">Cedula</TableCell>
                <TableCell align="right">Deudor moroso</TableCell>
                <TableCell align="right">Multas</TableCell>
                <TableCell align="right">Multas Valor</TableCell>
                <TableCell align="right">Licencia</TableCell>
                <TableCell align="right">Estado</TableCell>
                <TableCell align="right">Horas disponibles</TableCell>
                <TableCell align="right">Horas Asignadas</TableCell>
                {
                  CurrentUserHelper.canPerform(currentUser) &&
                  <TableCell align="right"> Acciones </TableCell>
                }
              </TableRow>
            </TableHead>
            <TableBody>
              { items.length > 0 && items.map(item => {
                    return (
                      <TableRow
                        key={`student-${item.id}`}
                        className={item.is_debtor_or_has_fines ? classes.restrictedStudent : {}}
                        onClick={(e) => selectStudent(item)}
                      >
                        <TableCell align="right"><a href={`/students/${item.id}`} target='_blank'>{item.full_name}</a></TableCell>
                        <TableCell align="right">{item.id_number}</TableCell>
                        <TableCell align="right">
                          <Typography color={item.debtor ? "error" : "initial"}>
                            {item.debtor ? "Moroso" : "No moroso"}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">{item.total_fines}</TableCell>
                        <TableCell align="right">{numeral(item.total_fines_value).format('$ 0,0')}</TableCell>
                        <TableCell align="right">{item.license_type}</TableCell>
                        <TableCell align="right">{item.status_text}</TableCell>
                        <TableCell align="right">{item.available_hours}</TableCell>
                        <TableCell align="right">{item.assigned_hours}</TableCell>
                        {
                          CurrentUserHelper.canPerform(currentUser) &&
                          <TableCell align="right">
                            {
                              CurrentUserHelper.canPerform(currentUser, "admin", "scheduler", "certifier") &&
                              item.status == 0 &&
                              <BeenhereOutlinedIcon onClick={(ev) => changeStatus(ev, item)} />
                            }{
                              CurrentUserHelper.canPerform(currentUser, "admin", "certifier") &&
                              item.status == 1 &&
                              <AssignmentIndRoundedIcon onClick={(ev) => changeStatus(ev, item)} />
                            }
                            {
                              item.assigned_hours === 0 &&
                              <DeleteIcon onClick={(ev) => deleteStudent(ev, item.id)}/>
                            }
                            {
                              CurrentUserHelper.canPerform(currentUser, "admin", "treasurer", "certifier") &&
                              (
                                item.debtor
                                ? <AssignmentLateIcon color={"error"} onClick={(ev) => unmarkAsDebtor(ev, item.id)}/>
                                : <AssignmentTurnedInIcon onClick={(ev) => markAsDebtor(ev, item.id)}/>
                              )
                            }
                            {
                              CurrentUserHelper.canPerform(currentUser, "admin", "treasurer", "certifier") &&
                              <NewReleasesIcon onClick={(ev) => setFine(ev, item.id)}/>
                            }
                            {
                              (CurrentUserHelper.canPerform(currentUser, "admin", "treasurer", "certifier") && item.total_fines > 0) &&
                              <AttachMoneyIcon onClick={(ev) => payFine(ev, item.id)}/>
                            }
                          </TableCell>
                        }
                      </TableRow>
                    );
                })
              }
            </TableBody>
          </Table>
      </TableContainer>
      {/* <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={items.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      /> */}
    </Paper>
    );
  }
}

export default StudentList;
