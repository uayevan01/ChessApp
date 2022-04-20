import React from 'react'
import Board from './Board.js'
import { useState, useEffect, useContext } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

function Gamepage(props) {
    return(
        <div style={{backgroundColor: 'grey', height: '100vh', width: '100vw', top: '8vh', position: 'absolute'}}>
            <div style={{position: 'absolute', left: '25%', top: '5%'}}>
                <div style={{position: 'absolute', color: 'white', left: '0%', top: '-1%'}}>Bob (1200)</div>
                <br/>
                <Board color={props.location.state[0].player} timer={props.location.state[0].timer} increment={props.location.state[0].increment}/>
                <div style={{color: 'white', position: 'absolute', top: '101%', left: '0%'}}>{props.location.state[0].name} ({props.location.state[0].elo})</div>
            </div>
            <br/>
        </div>
    );
}

export default Gamepage;
