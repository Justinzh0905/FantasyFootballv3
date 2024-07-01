import logo from './logo.svg';
import './App.css';
import * as React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Paper} from '@mui/material';
import { Outlet, Link} from 'react-router-dom';

function NavBar() {

  return (
    <AppBar position="sticky"> 
      <Toolbar>  
        <Typography variant="h6" sx={{ mr: 2}}>
          Website
        </Typography>
        <Button component={Link} to="/football/rankings" variant="contained" disableElevation sx={{ mr: 2}}> Tab A </Button>
        <Button component={Link} to="/football/research" variant="contained" disableElevation sx={{ mr: 2}}> Tab B </Button>
      </Toolbar>
    </AppBar>

  )
}

function App() {
  return (
    <div className="App">
      <NavBar />

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Paper elevation= {3} sx={{width: 0.8, p: 2}}> 
          <Outlet />
        </Paper>
      </Box>
    </div>
  );
}

export default App;
