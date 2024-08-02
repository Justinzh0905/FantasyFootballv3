import React, { useState, useEffect} from 'react';
import { Toolbar, Button, Divider, Tabs, Tab, Typography, Box, Link} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';


const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
        backgroundColor: theme.palette.grey[200]
    },
    "& .MuiDataGrid-row:hover": {
        backgroundColor: alpha(theme.palette.primary.light,0.2)
    }
}));

const ranking_columns = [
    {field: 'Player', headerName: 'Player', flex: 2},
    {field: 'TM', headerName: 'Team', flex: 1},
    {field: 'Age', headerName: 'Age', flex: 1},
    {field: 'Composite Rank', headerName: 'Rank', flex: 1, valueGetter: (value, row) => Number(row['Composite Rank'])},
    {field: 'POS', headerName: 'Position', flex: 1},
    {field: 'ECR', headerName: 'Expert Consess Rank', flex: 1, valueGetter: (value, row) => Number(row.ECR)},
    {field: 'Vs. Expert', headerNmae: 'Vs. Expert', flex: 1, valueGetter: (value, row) => Number(row['Vs. Expert'])},
    {field: 'BYE WEEK', headerName: 'Bye Week', flex: 1, valueGetter: (value, row) => Number(row["BYE WEEK"])},
]

const adp_columns = [
    {field: 'Player', headerName: 'Player', flex: 2},
    {field: 'TM', headerName: 'Team', flex: 1},
    {field: 'POS', headerName: 'Position', flex: 1},
    {field: 'Rank', headerName: 'Rank', flex: 1, valueGetter: (value, row) => Number(row.Rank)},
    {field: 'AVG PICK', headerName: 'ADP', flex: 1, valueGetter: (value, row) => Number(row['AVG PICK'])},
    {field: '7 DAY +/-', headerName: '7 DAY +/-', flex: 1,  valueGetter: (value, row) => Number(row['7 DAY +/-'])},
    {field: '%ROST', headerName: 'Percent Rostered', flex: 1, valueGetter: (value, row) => Number(row["%ROST"])},
]

const positions = ['Overall', 'QB', 'RB', 'WR', 'TE']
function PositionBar(props) {
    const {pos, setPos} = props;

    const changePos = (pos) => (event) => {
        setPos(pos)
    }
    return (
        <>
            <Toolbar variant="dense">
                {positions.map( position => {
                    return (<Button key={position} onClick={changePos(position)} size="small" variant={position === pos ? "outlined" : "text"}> {position} </Button>)
                })}
            </Toolbar>
            <Divider variant='middle'/>
        </>
    )
}

async function get_rankings() {
    const response = await fetch('https://api.justin-zhai.com/ranking')
    let data = await response.json()
    data = data['Rankings'].filter(elem => elem['BYE WEEK'] !== '-').sort((a, b) => Number(a['Composite Rank']) - Number(b['Composite Rank']))

    return data
}

async function get_adp() {
    const response = await fetch('https://api.justin-zhai.com/adp')
    let data = await response.json()
    data = data['adp'].filter(elem => !elem['Player'].includes('ST')).sort((a, b) => Number(a.Rank) - Number(b.Rank))

    return data
}

function StatTable(props) {
    const {get_data, columns} = props
    const [pos, setPos] = useState('Overall')
    const [rankings, setRankings] = useState([])
    const loading = rankings.length === 0
    const filteredRows = rankings.filter( elem => (pos === elem.POS || pos === 'Overall'))

    useEffect(() => {
        
        get_data().then(x => setRankings(x))
    }, [get_data])
    return (
        <StripedDataGrid 
            rows={filteredRows}
            columns={columns}
            autoHeight={true}
            hideFooter={false}
            getRowId={(row) => row.Player}
            disableColumnMenu={true}
            loading={loading}
            getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
              }
            slots={{
                toolbar: PositionBar
            }}
            slotProps={{
                toolbar: {
                    pos: pos,
                    setPos: setPos
                }
            }}
        />
    )
}

export default function Ranking() {

    const [currentTab, setCurrentTab] = useState(0)

    const handleTabChange = (e, tabIndex) => {
        setCurrentTab(tabIndex)
    }

    return(
        <>
            <Tabs value={currentTab} onChange={handleTabChange}>
                <Tab label="Ranking" />
                <Tab label="ADP" />
            </Tabs>

            <div hidden={currentTab !== 0}>
                <Box p={2}>
                    <Typography align='left'>
                        Draft rankings based on a mixture of data analytics/projections, expert consesus opinion, and ADP. Exact methodology will be added on the home page in the future.
                    </Typography>
                </Box>
                <StatTable get_data={get_rankings} columns={ranking_columns}/>
            </div>
            <div hidden={currentTab !== 1}>
                <Box p={2}>
                    <Typography align='left'>
                        Average Draft Position (ADP) data based on draft trends on ESPN. This data represents how fantasy players as a whole are actually valuing and drafting players.
                        Consesus from this large amount of players can constitute as <Link underline='hover' target='_blank' href='https://en.wikipedia.org/wiki/Wisdom_of_the_crowd' rel="noopener"> wisdom of the crowd </Link>, which could be more accurate than opinions of experts. 
                    </Typography>
                </Box>
                <StatTable get_data={get_adp} columns={adp_columns}/>
            </div>
        </>
    )
}