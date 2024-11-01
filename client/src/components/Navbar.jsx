import React from 'react';
import { NavLink } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <img src="/src/assets/LogoITS.png" alt="Logo" style={{ marginRight: '10px', height: '40px' }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Face Recognition R2S2
        </Typography>
        <Button color="inherit" component={NavLink} to="/" startIcon={<HomeIcon/>}>
          Home
        </Button>
        <Button color="inherit" component={NavLink} to="/admin" startIcon={<PersonIcon/>}>
          Admin
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
