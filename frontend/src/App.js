import './App.css';
import * as React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Paper, Table, TableHead, TableBody, TableCell, TableRow, TableContainer, tableCellClasses} from '@mui/material';
import { useOutlet, Link} from 'react-router-dom';
import { styled } from '@mui/material/styles';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(
  rank,
  player,
  position,
  age,
  vbd,
) {
  return { rank, player, position, age, vbd };
}

const rows = [
  createData(1,'Christian McCaffrey','RB',28,8.323809523809524),
  createData(2,'Josh Allen','QB',28,7.247863247863248),
  createData(3,'CeeDee Lamb','WR',25,5.966101694915254),
  createData(4,'Tyreek Hill','WR',30,6.556521739130435),
  createData(5,'Jalen Hurts','QB',26,5.283185840707965),
  createData(6,'Nick Chubb','RB',29,4.642857142857143),
  createData(7,'Derrick Henry','RB',30,4.62962962962963),
  createData(8,'Justin Jefferson','WR',25,3.879120879120879),
  createData(9,'Sam LaPorta','TE',23,3.823529411764706),
  createData(10,'Amon-Ra St. Brown','WR',25,3.672566371681416),
  createData(11,'Travis Kelce','TE',35,4.2),
  createData(12,'Kyren Williams','RB',24,3.588235294117647),
  createData(13,'Patrick Mahomes','QB',29,3.7217391304347824),
  createData(14,'Puka Nacua','WR',23,3.5294117647058822),
  createData(15,'Davante Adams','WR',32,3.7796610169491527),
  createData(16,'A.J. Brown','WR',27,3.356521739130435),
  createData(17,'Dak Prescott','QB',31,3.2685185185185186),
  createData(18,'Joe Mixon','RB',28,3.4285714285714284),
  createData(19,'Mike Evans','WR',31,3.5701754385964914),
  createData(20,'Deebo Samuel','WR',28,3.2941176470588234),
];

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
          Here is a look at some of the best performing players in the past 3 years:
        </p>
        <TableContainer component={Box} sx={{display: 'flex', justifyContent: 'center'}}>
          <Table size="small" sx={{width: '90%'}}> 
            <TableHead>
              <TableRow>
                <StyledTableCell sx={{borderRadius: '10px 0px 0px 0px'}}> Rank</StyledTableCell>
                <StyledTableCell> Player</StyledTableCell>
                <StyledTableCell align="right"> Position</StyledTableCell>
                <StyledTableCell align="right"> Age</StyledTableCell>
                <StyledTableCell align="right" sx={{borderRadius: '0px 10px 0px 0px'}}> VBD</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <StyledTableRow key={row.rank}>
                  <StyledTableCell component="th" scope="row">{row.rank}</StyledTableCell>
                  <StyledTableCell> {row.player}</StyledTableCell>
                  <StyledTableCell align="right">{row.position}</StyledTableCell>
                  <StyledTableCell align="right">{row.age}</StyledTableCell>
                  <StyledTableCell align="right">{row.vbd.toFixed(2)}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table >
        </TableContainer>
        <br /><br />
        <Typography variant='h3' gutterBottom> Age </Typography>
        <p>
          Of course this data shows past performance, and as the saying goes "Past performance is no guarantee of future results."
          <br /><br />
          To be continued...
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
