import './App.css';
import * as React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Paper, Table, TableHead, TableBody, TableCell, TableRow, TableContainer, tableCellClasses, Grid} from '@mui/material';
import { useOutlet, Link} from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { chartsGridClasses } from '@mui/x-charts/ChartsGrid';


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
        last updated 8/8/24
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
          This is especially relevant in football, where players have incredibly short careers. Often players will "hit a wall" and decline 
          out of nowhere when they get older. So it is important to pinpoint player's best performing years. 
          <br /><br />
          So here is the number of top 15 finishes by age in the last 5 years:
        </p>

        <Grid container >
            <Grid sm={12} md={6} sx={{textAlign: 'center'}}>
              QB
              <BarChart
                series={[
                  { data: [5, 13, 17, 17, 9, 9, 9, 10, 3, 6, 6, 11, 6, 6, 5, 4, 6, 2, 2, 1, 1, 1, 1] },
                ]}
                height={290}
                yAxis={[{ label: '# of Players' }]}
                xAxis={[{ data: [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44] , scaleType: 'band', label: 'Age', labelStyle: {
                  // Move the x-axis label with style
                  transform: 'translateY(-5px)',
                } }]}
                margin={{ top: 10, bottom: 40, left: 40, right: 10 }}
              />
            </Grid>
            <Grid sm={12} md={6} sx={{textAlign: 'center'}}>
              RB
              <BarChart
                series={[
                  { data: [8, 17, 21, 23, 20, 21, 16, 12, 4, 5, 1, 1, 1] },
                ]}
                height={290}
                yAxis={[{ label: '# of Players' }]}
                xAxis={[{ data: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33] , scaleType: 'band', label: 'Age', labelStyle: {
                  // Move the x-axis label with style
                  transform: 'translateY(-5px)',
                } }]}
                margin={{ top: 10, bottom: 40, left: 40, right: 10 }}
              />
            </Grid>
            <Grid sm={12} md={6} sx={{textAlign: 'center'}}>
              WR
              <BarChart
                series={[
                  { data: [4, 9, 16, 14, 15, 22, 20, 17, 13, 9, 6, 2, 2, 1] },
                ]}
                height={290}
                yAxis={[{ label: '# of Players' }]}
                xAxis={[{ data: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34] , scaleType: 'band', label: 'Age', labelStyle: {
                  // Move the x-axis label with style
                  transform: 'translateY(-5px)',
                } }]}
                margin={{ top: 10, bottom: 40, left: 40, right: 10 }}
              />
            </Grid>
            <Grid sm={12} md={6} sx={{textAlign: 'center'}}>
              TE
              <BarChart
                series={[
                  { data: [1, 2, 6, 15, 18, 24, 14, 16, 12, 8, 10, 10, 4, 4, 3, 1, 2] },
                ]}
                height={290}
                yAxis={[{ label: '# of Players' }]}
                xAxis={[{ data: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37] , scaleType: 'band', label: 'Age', labelStyle: {
                  // Move the x-axis label with style
                  transform: 'translateY(-5px)',
                } }]}
                margin={{ top: 10, bottom: 40, left: 40, right: 10 }}
              />
            </Grid>
        </Grid>

        <p>
          This data confirms several trends of modern football:
        </p>
        <ul>
          <li>
          <b>Quarterback:</b>
          There is an abundance of young, high performing quarterbacks. There has been a huge influx of talent at quarterback. As a result, teams are letting rookie quarterbacks take reign of the offense as soon as possible rather
          than letting them develop on the bench. In addition, it is increasing common to see dual threat quarterbacks that can run and score rushing touchdowns. This means that some young quarterbacks have been putting up huge numbers in recent years.
          But these young rushing quarterbacks tend to run less as they age, reducing their upside. The general trend seems to be the elite producing quarterbacks are young but you are generally safe to pick any quarterbacks until about age 33/34+.  
          </li>
          <br />
          <li>
          <b>Runningback:</b>
          The data comfirms that running backs regress very fast, in fact the decline starts at age 24. Nowadays runningbacks are cheap and easy to replace, 
          so teams simply run their young runningbacks to thr ground. So beware of 27+ year old running backs. It takes truly generation runningbacks like Christian McCaffrey to break this trend. 
          </li>
          <br />
          <li>
          <b>Wide Receiver:</b>
          The same could be said for wide receivers, the sheer althetism needed to be a wide receiver means that you quickly regress statistically once you lose a step.
          Wide receivers are good for a little bit longer than runningbacks, but you should still be wary of drafting any receivers aged 29+. 
          </li>
          <br />
          <li>
          <b>Tightend:</b>
          Lastly, tight ends fare a bit better than runningbacks and wide receiver as they get older. This is likely due to the fact that tight ends rely on their size and less on game breaking speed. 
          </li>
        </ul>

        <br /><br /><br />

        <p>
        To verify these trends I looked at the stats in another way. I compiled the average points per game of the top 5 (top 3 for quarterbacks) performing player by age in each position for the past 5 years.
        </p>
        <Grid container >
            <Grid sm={12} md={6} sx={{textAlign: 'center'}}>
              QB
              <BarChart
                series={[
                  { data: [10.287293956043955, 15.450023252890901, 18.106518009768013, 18.033435257552906, 18.11473199594523, 17.718560606060606, 18.04591230936819, 14.346400129690572, 15.46485379000085, 15.965284090909089, 18.504722222222224, 15.951704545454545, 14.824912464985994, 15.213202614379085, 13.777777777777777] },
                ]}
                height={290}
                yAxis={[{ label: '# of Players' }]}
                xAxis={[{ data: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35] , scaleType: 'band', label: 'Age', labelStyle: {
                  // Move the x-axis label with style
                  transform: 'translateY(-5px)',
                } }]}
                margin={{ top: 10, bottom: 40, left: 40, right: 10 }}
              />
            </Grid>
            <Grid sm={12} md={6} sx={{textAlign: 'center'}}>
              RB
              <BarChart
                series={[
                  { data: [12.86104503775092, 13.82029466122113, 13.215612066365006, 13.595151290865997, 11.998006017022192, 10.917832815713698, 10.768295809582575, 8.414473589319178, 14.109826923076923] },
                ]}
                height={290}
                yAxis={[{ label: '# of Players' }]}
                xAxis={[{ data: [22, 23, 24, 25, 26, 27, 28, 29, 30] , scaleType: 'band', label: 'Age', labelStyle: {
                  // Move the x-axis label with style
                  transform: 'translateY(-5px)',
                } }]}
                margin={{ top: 10, bottom: 40, left: 40, right: 10 }}
              />
            </Grid>
            <Grid sm={12} md={6} sx={{textAlign: 'center'}}>
              WR
              <BarChart
                series={[
                  { data: [10.988445451607216, 11.956152780063075, 13.608887389571214, 13.785604997453527, 13.766342619635271, 14.718802285949346, 13.794875193923724, 12.872283941548647, 12.472224288238994, 10.712571143842151, 9.61257792501616, 10.678074175824175, 9.981333333333334] },
                ]}
                height={290}
                yAxis={[{ label: '# of Players' }]}
                xAxis={[{ data: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33] , scaleType: 'band', label: 'Age', labelStyle: {
                  // Move the x-axis label with style
                  transform: 'translateY(-5px)',
                } }]}
                margin={{ top: 10, bottom: 40, left: 40, right: 10 }}
              />
            </Grid>
            <Grid sm={12} md={6} sx={{textAlign: 'center'}}>
              TE
              <BarChart
                series={[
                  { data: [5.859780748663101, 4.848207706509178, 6.75394553338818, 7.790921162171162, 8.4181054332922, 6.763649988247048, 6.776523996101937, 6.0330099569548095, 5.064633431694356, 7.004708333333335, 7.5405] },
                ]}
                height={290}
                yAxis={[{ label: '# of Players' }]}
                xAxis={[{ data: [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32] , scaleType: 'band', label: 'Age', labelStyle: {
                  // Move the x-axis label with style
                  transform: 'translateY(-5px)',
                } }]}
                margin={{ top: 10, bottom: 40, left: 40, right: 10 }}
              />
            </Grid>
        </Grid>

        <p>
          The same trend is generally present when the data is presented this way. So age is very import factor to consider when projecting player performance. 
          Players tend to improve for the first few years and then hit their prime for 2-3 years before they begin declining. So I adjusted the VBD ranking by projecting young players outside 
          the observed 2-3 year prime to improve and older players to decline. The decline is incrementing, with players projected to decline more the further they are from their prime. 

          <br /> <br />
          Here is the ranking after adjustment based on age:

          <br />
          to be continued...
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
