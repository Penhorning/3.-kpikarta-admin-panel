import React,{forwardRef,useState} from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = forwardRef(function Alert(props, ref) {

  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomizedSnackbars(props) {
  const {open} = props;
  const [opens, setOpen] = useState(false);


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
         onClose={handleClose}
          severity="success"
           sx={{ width: '100%' }}
           elevation={6}
          variant="filled"
           >
          This is a success message props!
        </Alert>
      </Snackbar>
    </div>
  );
}
