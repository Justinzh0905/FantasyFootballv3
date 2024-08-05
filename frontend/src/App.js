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
    <>
      <p>
        Welcome to my fantasy football website <br /> <br />
        Click rankings to see my rankings, or use the research tab to compare past player performance <br /> <br />
        This page is slowing being updated with my ranking methodology along with graphs and insights I've seen <br /> <br />
        last updated 8/5/24
      </p>
      <br />
      <Box sx={{textAlign: 'left'}}>
        <Typography variant='h3' gutterBottom> 
          Methodology
        </Typography >

        <p>
          My rankings are primarily based on the idea of value base drafting. This is the idea that you draft players that provide the most value relative to 
          other players that play the same position. The "value" is typically measured as fantasy points scored in excess of a replacement level or average player in the position. This is also known as value over replacement player (VORP).
          <br /> <br />
          This drafting approach intuitely makes sense if you have played fantasy football before. 
          Quarterbacks typically score the most points. however, they are usually not drafted anywhere in the first round. 
          This is because so many quarterbacks can put up big numbers, if the best quarterback scores 20 points per game but the 10th best quarterback is scoring 18 points per game, 
          you aren't getting much of a positional advantages by drafting the best quarterbacks.
          It is all about drafting players that gives you a positional leg up compared to average players. 
          <br /> <br />
          So the base of the ranking is historical VORP performance.
          I compiled the scoring data of players from the past three years using a weighted average. 
          <br /> <br />
          Games last years are weighted twice as much as games the year before that. And games two years ago are weighted twice as much as games three years ago.
          Assuming a player played all games over the past three years, 
          the most recent year accounts for 57.14% of the ranking, the year before accounts for 28.57%, and the last year represents 14.29% of the ranking.
          Football players have short careers and regress quickly so it is important to place a heavy emphasis on recent data and only rely on older data help control to outlier performance.
          <br /> <br /> 
          Here is a look at some of the best performing players in the past 3 years
        </p>
      </Box>
    </>
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
