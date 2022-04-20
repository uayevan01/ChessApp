import React from 'react'
import Board from './Board.js'
import { useState, useEffect, useContext } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

function Homepage() {
    const [name, setName] = useState('')
    const [elo, setELO] = useState('')
    const [timer, setTimer] = useState('600')
    const [increment, setIncrement] = useState('0')

    const changeName = (event) => {
        setName(event.target.value)
    } 

    const changeELO = (event) => {
        setELO(event.target.value)
    }

    const setTimeControl = (event) => {
        //convert time to seconds!
        const eventSplit = event.split("|");
        console.log(eventSplit);
        var time = eventSplit[0];
        var inc = eventSplit[1];
        setTimer(parseInt(time) * 60);
        setIncrement(parseInt(inc));
    }

    

    return(
        <body style={{backgroundColor: 'grey', height: '100vh', width: '100vw', top: '8vh', position: 'absolute'}}>
            <div style={{fontSize: '144px', textAlign: 'center'}}>CHESS GAME</div>
            <div>
                <div style={{textAlign: 'center'}}>
                    <div>Enter Your Name:</div>
                    <input type="text" onChange={changeName}></input>
                    <div>Enter Your ELO</div>
                    <input type="text" onChange={changeELO}></input>
                    <br/>
                    <select name='Time Control' onChange={e=>setTimeControl(e.target.value)}>
                        <option value="10|0">10 min</option>
                        <option value="5|0">5 min</option>
                        <option value="3|0">3 min</option>
                        <option value="1|0">1 min</option>
                        <option value="15|10">15 | 10</option>
                        <option value="3|2">3 | 2</option>
                        <option value="1|1">1 | 1</option>
                        <option value="60|0">60 min</option>
                        <option value="30|0">30 min</option>

                    </select>
                    <br/>
                    <br/>
                    <Link to={{
                        pathname: '/play',
                        state: [{name: name, elo: elo, player: 'white', timer: timer, increment: increment}]
                    }}>
                        <input type="button" value="Play as White!"/>
                    </Link>
                    &nbsp;
                    <Link to={{
                        pathname: '/play',
                        state: [{name: name, elo: elo, player: 'black', timer: timer, increment: increment}]
                    }}>
                        <input type="button" value="Play as Black!"/>
                    </Link>
                </div>
            </div>
        </body>
    );
}

export default Homepage;
