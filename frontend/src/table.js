import * as React from 'react';
import { Table, TableContainer,TableHead, TableBody, TableRow, TableCell, TableSortLabel, Box, Toolbar, Button, Stack } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { styled } from '@mui/material/styles';
import { positions } from '@mui/system'


const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
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

const headCells = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Dessert (100g serving)',
    },
    {
        id: 'calories',
        numeric: true,
        disablePadding: false,
        label: 'Calories',
    },
    {
        id: 'fat',
        numeric: true,
        disablePadding: false,
        label: 'Fat (g)',
    },
    {
        id: 'carbs',
        numeric: true,
        disablePadding: false,
        label: 'Carbs (g)',
    },
    {
        id: 'protein',
        numeric: true,
        disablePadding: false,
        label: 'Protein (g)',
    },
    {   id: 'type', 
        numeric: true,
        disablePadding: true,
        label: 'type (1-3)'
    }
];

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    return array.slice().sort(comparator)
}

function PositionBar(props) {
    const {pos, setPos} = props;

    const changePos = (pos) => (event) => {
        setPos(pos)
    }
    return (
        <Toolbar variant="dense">
            {[1,2,3].map( pos => {
                return (<Button key={pos} onClick={changePos(pos)} size="small"> {pos} </Button>)
            })}
        </Toolbar>
    )
}

function SortableTableHead(props) {
    const {order, orderBy, onRequestSort} =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableRow variant="dense">
        {headCells.map((headCell) => (
            <TableCell
                key={headCell.id}
                align={headCell.numeric ? 'right' : 'left'}
                padding={headCell.disablePadding ? 'none' : 'normal'}
                sortDirection={orderBy === headCell.id ? order : false}
            >
                <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={createSortHandler(headCell.id)}
                >

                {headCell.label}
                {orderBy === headCell.id ? (
                    <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                ) : null}
                </TableSortLabel>
            </TableCell>
            ))}
        </TableRow>
    )
}


export default function StatTable() {
    const [order, setOrder] = React.useState('asc')
    const [orderBy, setOrderBy] = React.useState('calories')
    const [pos, setPos] = React.useState(1)

    const handleRequestSort = (event, property) => {
        // flip sort direction or default to asc if the orderBy changed
        const currAsc = orderBy === property && order === 'asc';
        setOrder(currAsc ? 'desc': 'asc')
        setOrderBy(property);
    }

    const sortedRows = stableSort(rows, getComparator(order, orderBy)).filter( elem => pos === elem.type || pos === 1)


    return (
        <TableContainer>
            <PositionBar pos={pos} setPos={setPos} />  
            <Table>       
                <TableHead>  
                        <SortableTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort}  /> 
                </TableHead>
                <TableBody>
                    {sortedRows.map(row => {
                    return (
                        <StyledTableRow key={row.id}>
                            <TableCell> {row.name} </TableCell>
                            <TableCell align="right">{row.calories}</TableCell>
                            <TableCell align="right">{row.fat}</TableCell>
                            <TableCell align="right">{row.carbs}</TableCell>
                            <TableCell align="right">{row.protein}</TableCell>
                            <TableCell align="right">{row.type}</TableCell>
                        </StyledTableRow>
                    )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}