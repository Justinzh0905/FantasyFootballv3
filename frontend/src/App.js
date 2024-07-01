import './App.css';
import * as React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Paper} from '@mui/material';
import { useOutlet, Link} from 'react-router-dom';

function NavBar() {

  return (
    <AppBar position="sticky"> 
      <Toolbar>  
        <Button component={Link} to="/" variant="contained" disableElevation sx={{ mr: 2}}>  
          <Typography variant="h6" sx={{ mr: 2}}>
              Fantasy Football
          </Typography>
        </Button>

        <Button component={Link} to="/rankings" variant="contained" disableElevation sx={{ mr: 2}}> Rankings </Button>
        <Button component={Link} to="/research" variant="contained" disableElevation sx={{ mr: 2}}> Research </Button>
      </Toolbar>
    </AppBar>

  )
}

function HomeBlurb() {
  return (
    <p>
      Welcome to my fantasy football website <br /> <br />
      click rankings to see my rankings, or use the research tab to compare past player performance <br /> <br />
      This page will be updated soon with my methodology for rankings
    </p>
  )
}

function App() {
  const outlet = useOutlet()

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
          {outlet || <HomeBlurb />}
        </Paper>
      </Box>
    </div>
  );
}

export default App;
