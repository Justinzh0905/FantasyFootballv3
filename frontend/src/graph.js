import * as React from 'react';
import { useState, useEffect } from 'react';
import {LineChart} from '@mui/x-charts/LineChart'
import { Autocomplete, TextField } from '@mui/material';


function update_data(json, setX, setY) {
    for(const [player, data] of Object.entries(json)) {
        const xvalues = data.map( elem => elem['Year'])
        const yvalues = data.map( elem => elem['RecYds'])
        setX(xvalues)
        setY(yvalues)
    }
}

const sample = ['Stefon Diggs', 'Derrick Henry', 'Aaron Jones', 'Aaron Rodgers', 'Josh Allen']
function Selector(props) {
    
    return (
        <Autocomplete 
            onChange={(e, value) => props.setP1(value)}
            options = {sample}
            renderInput={(params) => <TextField {...params} label="Player" />}
        />
    )
}
export default function GraphView() {
    const [player1, setPlayer1] = useState('Stefon Diggs')
    const [xdata, setXdata] = useState([1, 2, 3, 5, 8, 10])
    const [ydata, setYdata] = useState([2, 5.5, 2, 8.5, 1.5, 5])

    useEffect(() => {

        async function get_data() {
            const response = await fetch("https://football.justin-zhai.com/stat?" + new URLSearchParams({
                    players: player1,
                    stat: 'RecYds'
            }).toString())
            const data = await response.json()
            
            update_data(data, setXdata, setYdata)
        }

        get_data()
    })
    return (
        <>
        <Selector setP1={setPlayer1} />
            <LineChart
                xAxis={[{ data: xdata }]}
                series={[
                    {
                    data: ydata,
                    },
                ]}
                height={600}
            />
        </>
    )
}