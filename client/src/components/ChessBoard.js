import React from 'react';
import $ from 'jquery'
import Chessboard from 'chessboardjsx'
import Chess from 'chess.js'
import { useState, useEffect, useContext, memo } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

function ChessBoard(props) {
    return(
        <div>
            <Chessboard orientation={props.orientation} width={props.width} position={props.position} onDrop={props.onDrop} onSquareClick={props.onSquareClick} squareStyles={props.squareStyles}/>
        </div>
    );
}

export default memo(ChessBoard);    
