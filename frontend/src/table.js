import React, { useState, useEffect} from 'react';
import { Toolbar, Button } from '@mui/material';
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

function createData(id, name, calories, fat, carbs, protein, type) {
    return {
      id,
      name,
      calories,
      fat,
      carbs,
      protein,
      type
    };
  }
  
const rows = [
    createData(1, 'Cupcake', 305, 3.7, 67, 4.3,1),
    createData(2, 'Donut', 452, 25.0, 51, 4.9,2),
    createData(3, 'Eclair', 262, 16.0, 24, 6.0,3),
    createData(4, 'Frozen yoghurt', 159, 6.0, 24, 4.0,3),
    createData(5, 'Gingerbread', 356, 16.0, 49, 3.9,2),
    createData(6, 'Honeycomb', 408, 3.2, 87, 6.5, 1),
    createData(7, 'Ice cream sandwich', 237, 9.0, 37, 4.3,2),
    createData(8, 'Jelly Bean', 375, 0.0, 94, 0.0,3),
    createData(9, 'KitKat', 518, 26.0, 65, 7.0,2),
    createData(10, 'Lollipop', 392, 0.2, 98, 0.0,1),
    createData(11, 'Marshmallow', 318, 0, 81, 2.0, 3),
    createData(12, 'Nougat', 360, 19.0, 9, 37.0, 2),
    createData(13, 'Oreo', 437, 18.0, 63, 4.0, 1),
];

const columns = [
    {field: 'Player', headerName: 'Player', flex: 2},
    {field: 'TM', headerName: 'Team', flex: 1},
    {field: 'RK', headerName: 'Rank', flex: 1, valueGetter: (value, row) => Number(row.RK)},
    {field: 'POS', headerName: 'Position', flex: 1},
    {field: 'Pos Rank', headerName: 'Position Rank', flex: 1},
    {field: 'BYE WEEK', headerName: 'Bye Week', flex: 1, valueGetter: (value, row) => Number(row["BYE WEEK"])},
]

const positions = ['Overall', 'QB', 'RB', 'WR', 'TE']
function PositionBar(props) {
    const {setPos} = props;

    const changePos = (pos) => (event) => {
        setPos(pos)
    }
    return (
        <Toolbar variant="dense">
            {positions.map( pos => {
                return (<Button key={pos} onClick={changePos(pos)} size="small"> {pos} </Button>)
            })}
        </Toolbar>
    )
}

export default function StatTable() {

    const [pos, setPos] = useState('Overall')
    const [rankings, setRankings] = useState([])
    const loading = rankings.length === 0
    const filteredRows = rankings.filter( elem => (pos === elem.POS || pos === 'Overall'))

    useEffect(() => {
        async function get_rankings() {
            const response = await fetch('https://api.justin-zhai.com/ranking')
            const data = await response.json()
            setRankings(data['Ranking'].filter(elem => elem['BYE WEEK'] !== '-').sort((a, b) => Number(a.RK) - Number(b.RK)))
        }

        get_rankings()
    }, [])
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
                    setPos: setPos
                }
            }}
        />
    )
}
