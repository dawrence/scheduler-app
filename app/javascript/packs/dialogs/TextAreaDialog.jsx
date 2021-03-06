import React from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';



const DialogTextArea = ({ open, handleClose, justification, label, onChange, onAccept }) => {
  return (
    <Dialog
      open={open}
      onClose={(handleClose)}
      fullWidth={true}
      maxWidth="sm"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Justificación requerida.</DialogTitle>
      <DialogContent>
        <TextField
          id="standard-textarea"
          fullWidth
          autoFocus={open}
          label={label}
          value={justification}
          onChange={(evt) => onChange(evt)}
          multiline
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancelar
        </Button>
        <Button disabled={justification == ''}  onClick={() => {
          handleClose(); onAccept()
        }} color="primary">
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogTextArea;