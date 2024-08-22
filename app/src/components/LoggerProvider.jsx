import React, { useState } from 'react';
import { Snackbar, SnackbarContent } from '@mui/material';

import LoggerContext from '../context/LoggerContext';

function LoggerProvider({ children }) {
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');
  const [open, setOpen] = useState(false);

  const showLog = (msg, sev = 'info') => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const severityColor = {
    info: 'blue',
    success: 'green',
    error: 'red',
    warning: 'orange',
  };

  return (
    <LoggerContext.Provider value={{ showLog }}>
      { children }
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <SnackbarContent
          style={{ backgroundColor: severityColor[severity] }}
          message={message}
        />
      </Snackbar>
    </LoggerContext.Provider>
  );
}

export default LoggerProvider;
