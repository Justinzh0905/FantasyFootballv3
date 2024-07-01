import * as React from 'react';
import { useState, useEffect } from 'react';
import {LineChart} from '@mui/x-charts/LineChart'
import { Autocomplete, TextField, Grid } from '@mui/material';



const sample = ['Stefon Diggs', 'Derrick Henry', 'Aaron Jones', 'Aaron Rodgers', 'Josh Allen']
const stats = ['PPR','TD','G','GS','Cmp','PassAtt','PassYds','PassTD','Int','RushAtt','RushYds','Y/A','RushTD','Tgt','Rec','RecYds','Y/R','RecTD','Fmb','FL','PPR','VBD','PosRank']
function Selector(props) {
    const { numPlayers, setNumPlayers, players, setPlayers, stat, setStat} = props
    function updatePlayers(pos, value) {
        let newPlayers = [...players]
        newPlayers[pos] = value
        newPlayers = newPlayers.filter(x => x !== null)
        setPlayers(newPlayers)

        
        if (newPlayers.length === numPlayers && newPlayers.length < 4) {
            setNumPlayers(numPlayers + 1)
        } else if (newPlayers.length === numPlayers - 2 && newPlayers.length > 0) {
            setNumPlayers(numPlayers - 1)
        }

    }
    
    return (
        <Grid container spacing="2">
            <Grid container xs={12}>
                {[...Array(numPlayers).keys()].map((i) => {
                    return (
                        <Grid item xs={3}>
                        <Autocomplete 
                            readOnly={(numPlayers !== i + 2 || players.length === 4) && i !== 3 && numPlayers !==1 && numPlayers !== i + 1}
                            onChange={(e, value) => updatePlayers(i, value)}
                            options = {sample}
                            renderInput={(params) => <TextField {...params} label="Player" variant="standard" />}
                        />
                        </Grid>
                    )
                })}
            </Grid>
            <Grid item xs={3}>
                <Autocomplete 
                    onChange={(e, value) => props.setStat(value)}
                    options = {stats}
                    renderInput={(params) => <TextField {...params} label="Choose Stat" variant="standard"/>}
                />
            </Grid>
            
        </Grid>

    )
}
export default function GraphView() {
    const [players, setPlayers] = useState([])
    const [stat, setStat] = useState('')
    const [xdata, setXdata] = useState([])
    const [ydata, setYdata] = useState({})
    const [numPlayers, setNumPlayers] = useState(1)

    function update_data(json) {

        let yvalues = {}
        //x axis value of last 5 years 
        const currYear = new Date().getFullYear()
        const years = Array.from({length: 5}, (_, i) => i + currYear - 5)


        for(const [player, data] of Object.entries(json)) {
            let stats = []
            //fill missing year data will null

            for (const year of years) {
                if (data[year]) {
                    stats.push(data[year])
                } else {
                    stats.push(null)
                }
            }

            
            yvalues[player] = stats
        }

        //transform x axis values to date form 
        const xvalues = years.map( elem => new Date(elem, 0, 1))
        setXdata(xvalues)
        setYdata(yvalues)
    }

    useEffect(() => {

        async function get_data() {
            if (stat && (players.length !== 0)) {
                const response = await fetch("https://api.justin-zhai.com/stat?" + new URLSearchParams({
                        players: players,
                        stat: stat
                }).toString())
                const data = await response.json()

                update_data(data)
            } else {
                setXdata([])
                setYdata([])
            }
        
        }

        get_data()
    })
    return (
        <>
        <Selector numPlayers={numPlayers} setNumPlayers={setNumPlayers} players={players} setPlayers={setPlayers} setStat={setStat}/>
            <LineChart
                xAxis={[{ 
                    data: xdata,  
                    scaleType: 'time',
                    tickNumber: 5,
                    valueFormatter: (date) => date.getFullYear().toString(),
                }]}
                series={
                    Object.keys(ydata).map( key => {
                        return { data: ydata[key], label: key}
                    })
                }
                yAxis={[{
                    min: 0
                }]}
                height={600}
            />
        </>
    )
}