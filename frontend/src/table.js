import React, { useState, useEffect} from 'react';
import { Toolbar, Button, Divider, Tabs, Tab, TabScrollButton } from '@mui/material';
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
    {field: 'RK', headerName: 'Rank', flex: 1, valueGetter: (value, row) => Number(row.RK)},
    {field: 'POS', headerName: 'Position', flex: 1},
    {field: 'Pos Rank', headerName: 'Position Rank', flex: 1},
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
    data = data['Rankings'].filter(elem => elem['BYE WEEK'] !== '-').sort((a, b) => Number(a.RK) - Number(b.RK))

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
                <StatTable get_data={get_rankings} columns={ranking_columns}/>
            </div>
            <div hidden={currentTab !== 1}>
                <StatTable get_data={get_adp} columns={adp_columns}/>
            </div>
        </>
    )
}