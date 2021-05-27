import React from 'react'
import CurrentUserHelper from '../helpers/CurrentUserHelper';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Button from '@material-ui/core/Button';
import capitalize from 'capitalize';
import numeral from 'numeral';

const useStyles = makeStyles({
  textField: {
    '& .MuiInput-underline': {
      '&:hover:not(.Mui-disabled):before, &:before, &:after': {
        border: 0
      },
    }
  },
  autocompleteFilter: {
    '& .MuiFormControl-marginNormal': {
      marginTop: 0,
    },
    '& .MuiInputBase-input.MuiOutlinedInput-input.MuiAutocomplete-input': {
      height: '2rem'
    }
  }
});


const AutocompleteFilter = ({ style, options, label, value, onChange }) => {
  const classes = useStyles();
  return (
    <Autocomplete
      style={style}
      className={classes.autocompleteFilter}
      clearOnEscape
      openOnFocus
      options={options}
      value={value}
      getOptionLabel={(option) => option.text}
      onChange={onChange}
      size="small"
      renderInput={(params) => <TextField {...params} style={{}} label={label} margin="normal" variant="outlined" />}
    />
  );
}

const TextFieldInput = ({ style, value, label, id, onChange }) => {
  const classes = useStyles();
  return (
    <TextField 
      className={classes.textField}
      value={value}
      style={style}
      autoComplete="off"
      id={`cash-flow-${id}`}
      label={label}
      onChange={onChange}
    />
  );
}

const DebtOrPaySelector = ({value, onChange}) => {
  return(
    <ToggleButtonGroup
      exclusive
      value={value}
      size="small"
      onChange={onChange}
    >
      <ToggleButton value="pay" size='large'>
        <Typography variant="h5" color="textSecondary">
          PAGA
        </Typography>
      </ToggleButton>
      <ToggleButton value="debt" size='small'>
        <Typography variant="h5" color="textSecondary">
          DEBE
        </Typography>
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

const CashFlowCard = ({ studentSelected, cashFlow }) => {
  return(
    <Paper style={{ marginBottom: '1rem', padding: '0.5rem  1rem' }} elevation={1}>
      <Box style={{display: 'flex', flexDirection: 'row'}}>
        <Typography style={{ marginRight: '0.25rem' }} color="textPrimary">
          {capitalize.words(studentSelected.full_name)}
        </Typography>
        <Typography style={{ marginRight: '0.25rem' }} color={cashFlow.kind_id === 1 ? "secondary" : "primary"}>
          {cashFlow.kind}
        </Typography>
        <Typography style={{ marginRight: '0.25rem' }} color="textPrimary">
          {numeral(cashFlow.amount).format('$ 0,0')}
        </Typography>
      </Box>
      <Box style={{ display: 'flex', flexDirection: 'row' }}>
        <Typography style={{ marginRight: '0.25rem' }} color="textPrimary">
          Por concepto de:
        </Typography>
        <Typography style={{marginRight: '0.25rem'}} color="textSecondary">
          { cashFlow.concept }
        </Typography>
      </Box>
    </Paper>
  );
}
const CashFlowCards = ({ studentSelected }) => {
  if (!studentSelected){
    return (
      <Typography variant="subtitle1" color="primary">
        Debe seleccionar un estudiante.
      </Typography>
    );
  }
  else if (studentSelected.cash_flows.length == 0){
    return(
      <Typography variant="subtitle1" color="primary">
        No tiene movimientos aún.
      </Typography>
    );
  }
  return(
    <>
      <Typography style={{marginBottom: '1rem'}} variant="subtitle1" color={studentSelected.total_cash_flow_debt > 0 ? "secondary" : "primary"}>
        {studentSelected.total_cash_flow_debt > 0 ? "Debe: " : "Saldo: " }
        {numeral(studentSelected.total_cash_flow_debt).format('$ 0,0')}
      </Typography>
      {
        studentSelected.cash_flows.map(item => <CashFlowCard key={`cash-flow-${item.id}`} studentSelected={studentSelected} cashFlow={item} />)
      } 
    </>
  )
}
class CashFlowList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      studentSelected: null,
      students: [],
      student: null,
      studentFilter: null,
      concept: '',
      value: '',
      flow: 'pay',
      loaded: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleChangeStudent = this.handleChangeStudent.bind(this);
    this.handleStudentFilter = this.handleStudentFilter.bind(this);
    this.fetchCashFlows = this.fetchCashFlows.bind(this);
    this.fetchStudents = this.fetchStudents.bind(this);
    this.fetchCurrentUser = this.fetchCurrentUser.bind(this);
  }

  fetchCurrentUser() {
    axios.get("/api/v1/active_user", {})
      .then(({ data }) => {
        this.setState({
          currentUser: data,
        })
      })
      .catch((error) => alert(error));
  }

  componentDidMount() {
    this.fetchStudents();
    this.fetchCurrentUser();
  }

  handleStudentFilter(event, studentFilter) {
    this.setState(
      { studentFilter }, () => {
        if (this.state.studentFilter){
          this.fetchCashFlows();
        }
        else{
          this.setState({ studentSelected: null });
        }
      }
    );
  }

  fetchCashFlows() {
    axios.get(`/api/v1/cash_flows/filter/${this.state.studentFilter.value}`)
      .then(({ data }) => {
        this.setState({
          studentSelected: data,
          loaded: true
        })
      })
      .catch((error) => alert(error))
  }

  fetchStudents() {
    axios.get("/api/v1/cash_flows/students")
      .then(({ data }) => {
        this.setState({
          students: data,
          loaded: true
        })
      })
      .catch((error) => alert(error));
  }

  handleSubmit(ev){
    const requestOptions = {
      url: '/api/v1/cash_flows/',
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({ 
        kind: this.state.flow,
        amount: this.state.value,
        concept: this.state.concept,
        student_id: this.state.student?.value
      })
    };
    this.setState({ loading: true })
    axios(requestOptions)
      .then(({ data }) => {
        this.setState({
          student: null,
          concept: '',
          value: '',
          flow: 'pay',
          loaded: false
        })
        this.fetchCashFlows();
        this.forceUpdate();
      })
      .catch((error) => {
        this.setState({ loading: false })
        alert(error)
      });
    ev.preventDefault();
    this.forceUpdate();
  }

  handleTextChange(key, event){
    this.setState({ 
      [key]: event.target.value 
    })
  }

  handleChangeStudent = (event, student) => {
    this.setState({ student });
  };

  render() {
    return (
      <Container style={{marginTop: '1.5rem'}}>
        {
          CurrentUserHelper.canPerform(this.state.currentUser) &&
          <>
            <Typography variant="h3" color="textSecondary">
              Flujo de caja
            </Typography>
            <Paper style={{marginTop: '1.25rem', padding: '1rem'}} elevation={3}>
              <Box style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between'}}>
                <DebtOrPaySelector 
                  value={this.state.flow} 
                  onChange={(e, flow) => {
                    if (flow) this.setState({flow});
                }}/>
                <AutocompleteFilter
                  style={{flex: 1, marginLeft: '1rem'}}
                  value={this.state.student}
                  options={this.state.students}
                  onChange={this.handleChangeStudent}
                  label="Estudiante"
                />
              </Box>
              <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <TextFieldInput 
                  style={{ flex: 1 }}
                  id="concept" 
                  label="Concepto" 
                  value={this.state.concept}
                  onChange={(event) => this.handleTextChange('concept', event)}
                  />
                <TextFieldInput 
                  style={{ flex: 1, marginLeft: '1rem' }}
                  id="value" 
                  label="Valor" 
                  value={this.state.value}
                  onChange={(event) => this.handleTextChange('value', event)}
                />
              </Box>
              <Button variant="contained" color="primary" onClick={this.handleSubmit}>
                Crear movimiento
              </Button> 
            </Paper>
            <Paper style={{ margin: '1rem 0', padding: '0.5rem 1rem' }} elevation={3}>
              <Paper style={{ marginBottom: '1rem', padding: '0.5rem  1rem' }} elevation={2}>
                <Typography variant="h6" color="primary">
                  Seleccione un estudiante
                </Typography>
                <Box style={{marginTop: '1rem'}}>
                  <AutocompleteFilter
                    value={this.state.studentFilter}
                    options={this.state.students}
                    onChange={this.handleStudentFilter}
                    label="Estudiante"
                    />
                </Box>
              </Paper>
              <CashFlowCards 
                studentSelected={this.state.studentSelected}
              />
            </Paper>
          </>
        }
      </Container >
    );
  }
}

export default CashFlowList;
