import React from 'react';
import $ from 'jquery'
import ChessBoard from './ChessBoard.js'
import Chess from 'chess.js'
import { useState, useEffect, useContext, memo } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
var engine = new Worker('stockfish.js');
var evaler = new Worker('stockfish.js');
var engineStatus = {}

function Board(props) {
    const [selected, setSelected] = useState('x')
    const [position, setPosition] = useState('start')
    const [chess, setChess] = useState(new Chess())
    const [squareStyles, setSquareStyles] = useState({})
    const [moves, setMoves] = useState([])
    const [positions, setPositions] = useState(['start'])
    const [positionIndex, setPositionIndex] = useState(0)
    const [moveable, setMoveable] = useState('false')
    const [whiteTimer, setWhiteTimer] = useState(props.timer)
    const [blackTimer, setBlackTimer] = useState(props.timer)
    const [gameRunning, setGameRunning] = useState('running')
    const [gameEndReason, setGameEndReason] = useState('')
    const [evalBar, setEvalBar] = useState('0.00')

    const bot = props.color.charAt(0) === 'w' ? 'b' : 'w';

    const changePosition = (index) => {
        if (index >= 0 && index <= positions.length - 1) {
            setPosition(positions[index]);
            setPositionIndex(index);
            if (positions[index] === positions[positions.length - 1])
                setMoveable('true')
            else
                setMoveable('false')
            setTimeout(() => {
                if(index < positions.length) {
                    uciCmd("position startpos moves" + get_moves2(index), evaler);
                    uciCmd("eval", evaler);
                }
            }, 1000)
        }
    }

    const convertToTuples = (array) => {
        //[a, b, c, d, e] => [[a, b], [c, d], [e]]
        var newArray = [];
        for (var i = 0; i < array.length; i = i + 2) {
            if (i >= array.length)
                break;
            else if (i + 1 < array.length) {
                newArray.push([array[i], array[i + 1]])
            }
            else {
                newArray.push([array[i]])
            }
        }
        return newArray;
    }
    const move = (theMove) => {
        if (moveable && gameRunning === "running" && theMove.piece.charAt(0) === chess.turn()) {
            console.log(theMove)
            chess.move({ from: theMove.sourceSquare, to: theMove.targetSquare, promotion: 'q' })
            setMoves(convertToTuples(chess.history()))
            var newArray = positions
            newArray.push(chess.fen())
            setPositions(newArray)
            setPositionIndex(positionIndex + 1);
            setPosition(chess.fen())
            if (chess.turn() === "b") {
                setTimeout(() => setWhiteTimer(whiteTimer + parseInt(props.increment)), 1000)
            }
            else {
            }
            prepareMove();
        }
    }

    const movePiece = (square) => {
        if (moveable && gameRunning === "running") {
            if (chess.get(square) && chess.get(square).color === chess.turn()) {
                setSelected(square)
                let highlightedSquares = {};
                highlightedSquares[square] =
                {
                    backgroundColor: "#0000ff"
                }
                let moves = chess.moves({
                    square: square,
                    verbose: true
                });
                if (moves.length === 0) {
                    setSelected('x');
                    setSquareStyles({})
                    return;
                }

                let squaresToHighlight = [];
                for (var i = 0; i < moves.length; i++) {
                    squaresToHighlight.push(moves[i].to);
                }
                for (var i = 0; i < squaresToHighlight.length; i++) {
                    highlightedSquares[squaresToHighlight[i]] =
                    {
                        background:
                            "radial-gradient(circle, #0000ff 20%, transparent 40%)",
                        borderRadius: "50%"
                    }
                }
                setSquareStyles(highlightedSquares)
            }
            else if (selected !== 'x') {
                setSelected('x');
                setSquareStyles({});
                chess.move({ from: selected, to: square, promotion: 'q' });
                setMoves(convertToTuples(chess.history()));
                var newArray = positions;
                newArray.push(chess.fen());
                setPositions(newArray);
                changePosition(newArray.length - 1);
                if (chess.turn() === "b") {
                    setTimeout(() => setWhiteTimer(whiteTimer + parseInt(props.increment)), 1000)
                }
                else {
                    setTimeout(() => setBlackTimer(blackTimer + parseInt(props.increment)), 1000)
                }
                prepareMove();
            }
        }
    }

    const formatTime = (stopwatch) => {
        var time = new Date(stopwatch * 1000).toISOString().substr(14, 5);
        return time;
    }

    useEffect(() => {
        if (whiteTimer > 0 && blackTimer > 0 && chess.in_checkmate() === false &&
            chess.in_threefold_repetition() === false && chess.in_stalemate() === false) {
            if (chess.turn() === "w") {
                setTimeout(() => setWhiteTimer(whiteTimer - 1), 1000)
            }
            else {
                setTimeout(() => setBlackTimer(blackTimer - 1), 1000)
            }
        }
        else {
            if (chess.in_checkmate() === true) {
                if (chess.turn() === 'w')
                    setGameRunning('Black')
                else
                    setGameRunning('White')
                setGameEndReason('checkmate')
            }
            else if (chess.in_stalemate() === true) {
                if (chess.turn() === 'w')
                    setGameRunning('Black')
                else
                    setGameRunning('White')
                setGameEndReason('stalemate')
            }
            else if (chess.in_threefold_repetition() === true) {
                if (chess.turn() === 'w')
                    setGameRunning('Black')
                else
                    setGameRunning('White')
                setGameEndReason('threefold repetition')

            }
            else if (whiteTimer <= 0) {
                setGameRunning('Black')
                setGameEndReason('timeout')
            }
            else if (blackTimer <= 0) {
                setGameRunning('White')
                setGameEndReason('timeout')
            }
        }
    }, [whiteTimer, blackTimer, chess])

    function uciCmd(cmd, which) {
         console.log('UCI: ' + cmd);

        (which || engine).postMessage(cmd);
    }
    

    function get_moves() {
        let moves = "";
        let history = chess.history({ verbose: true });
        for (let i = 0; i < history.length; ++i) {
            let move = history[i];
            moves +=
                " " + move.from + move.to + (move.promotion ? move.promotion : "");
        }

        return moves;
    }

    function get_moves2(index) {
        let moves = "";
        let history = chess.history({ verbose: true });
        console.log(index)
        console.log(history.length)
        for (let i = 0; i < index; ++i) {
            let move = history[i];
            moves +=
                " " + move.from + move.to + (move.promotion ? move.promotion : "");
        }
        return moves;
    }
    

    const prepareMove = () => {
        if (gameRunning) {
            if (chess.turn() === bot) {
                // playerColor = playerColor === 'white' ? 'black' : 'white';
                console.log("we are here now!")
                uciCmd("position startpos moves" + get_moves());
                uciCmd("position startpos moves" + get_moves(), evaler);
                uciCmd("eval", evaler);
                }
                if (whiteTimer && blackTimer) {
                    uciCmd(
                      "go " +
                        "depth " + 20 +
                        " wtime " +
                        whiteTimer*1000 +
                        " winc " +
                        props.increment*1000 +
                        " btime " +
                        blackTimer*1000 +
                        " binc " +
                        props.increment*1000
                    );
                  } else {
                    uciCmd("go " + "depth " + 10);
                  }

                // isEngineRunning = true;
            }
    };

    evaler.onmessage = function (event) {
        let line;

        if (event && typeof event === "object") {
            line = event.data;
        } else {
            line = event;
        }

        console.log('evaler: ' + line);
        var evalMatch = line.match(/^Final evaluation\s+([+-][0-9]+.[0-9][0-9]|M[0-])/)
        if(evalMatch) {
            setEvalBar(evalMatch[1])
        }
        /// Ignore some output.
        if (
            line === "uciok" ||
            line === "readyok" ||
            line.substr(0, 11) === "option name"
        ) {
            return;
        }
    };

    engine.onmessage = event => {
        if(chess.turn() != bot) {
            return
        }
        let line;
        if (event && typeof event === "object") {
            line = event.data;
        } else {
            line = event;
        }
        //console.log(line)
        console.log(engineStatus)
        if (line === "uciok") {
            engineStatus.engineLoaded = true;
        } else if (line === "readyok") {
            engineStatus.engineReady = true;
        } else {
            //console.log(line)
            let match = line.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);
            /// Did the AI move?
            if (match) {
                // isEngineRunning = false;
                chess.move({ from: match[1], to: match[2], promotion: match[3] });
                setMoves(convertToTuples(chess.history()));
                var newArray = positions;
                newArray.push(chess.fen());
                setPositions(newArray);
                changePosition(newArray.length - 1);
                if (chess.turn() === "b") {
                    setTimeout(() => setWhiteTimer(whiteTimer + parseInt(props.increment)), 1000)
                }
                else {
                    setTimeout(() => setBlackTimer(blackTimer + parseInt(props.increment)), 1000)
                }
                prepareMove();
                uciCmd("eval", evaler);
                //uciCmd("eval");
                /// Is it sending feedback?
            } else if (
                (match = line.match(/^info .*\bdepth (\d+) .*\bnps (\d+)/))
            ) {
                engineStatus.search = "Depth: " + match[1] + " Nps: " + match[2];
            }

            /// Is it sending feed back with a score?
            if ((match = line.match(/^info .*\bscore (\w+) (-?\d+)/))) {
                let score = parseInt(match[2], 10) * (chess.turn() === "w" ? 1 : -1);
                /// Is it measuring in centipawns?
                if (match[1] === "cp") {
                    engineStatus.score = (score / 100.0).toFixed(2);
                    /// Did it find a mate?
                } else if (match[1] === "mate") {
                    engineStatus.score = "Mate in " + Math.abs(score);
                }

                /// Is the score bounded?
                if ((match = line.match(/\b(upper|lower)bound\b/))) {
                    engineStatus.score =
                        ((match[1] === "upper") === (chess.turn() === "w")
                            ? "<= "
                            : ">= ") + engineStatus.score;
                }
            }
        }
        // displayStatus();
    };

    return (
        <div>
            <div>
                <ChessBoard orientation={props.color} width={600}
                    position={position} onDrop={move} onSquareClick={movePiece} squareStyles={squareStyles} />
            </div>
            <div style={{
                position: 'absolute', backgroundColor: 'white',
                fontSize: '36px', width: '140px', textAlign: 'right',
                borderRadius: '6px', left: '460px', top: '624px'
            }}>
                {props.color === "white" ?
                    formatTime(whiteTimer)
                    :
                    formatTime(blackTimer)
                }
            </div>
            <div style={{
                position: 'absolute', backgroundColor: 'white',
                fontSize: '36px', width: '140px', textAlign: 'right',
                borderRadius: '6px', left: '460px', top: '-30px'
            }}>
                {props.color === "white" ?
                    formatTime(blackTimer)
                    :
                    formatTime(whiteTimer)
                }
            </div>

            <div style={{ overflow: 'scroll', display: 'inline-block', height: '600px', width: '200px', position: 'absolute', top: '20px', right: '-250px', color: 'white', backgroundColor: 'black' }}>
                <div style={{ width: 'auto', textAlign: 'center', fontSize: '24px' }}>Game Moves</div>

                {
                    moves.map((move, i) => (
                        <p style={{ display: 'flex', justifyContent: 'space-between', width: '160px' }}>
                            <span style={{ position: 'absolute', left: '0px' }}>&nbsp;{i + 1}</span>
                            {positionIndex === 2 * i + 1 ?
                                <span onClick={() => changePosition(2 * i + 1)} style={{ position: 'absolute', left: '40px', backgroundColor: 'white', color: 'black' }}>{move[0]}</span>
                                :
                                <span onClick={() => changePosition(2 * i + 1)} style={{ position: 'absolute', left: '40px' }}>{move[0]}</span>
                            }
                            {positionIndex === 2 * i + 2 ?
                                <span onClick={() => changePosition(2 * i + 2)} style={{ position: 'absolute', left: '120px', backgroundColor: 'white', color: 'black' }}>{move[1]}</span>
                                :
                                <span onClick={() => changePosition(2 * i + 2)} style={{ position: 'absolute', left: '120px' }}>{move[1]}</span>
                            }

                            <br />
                        </p>
                    ))
                }
            </div>
            <div style={{ textAlign: 'center', backgroundColor: 'white', width: '200px', position: 'absolute', top: '620px', right: '-250px', height: '40px' }}>
                <span onClick={() => changePosition(0)} style={{ fontSize: '36px' }}>&laquo;</span>
                &nbsp;
                &nbsp;
                <span onClick={() => changePosition(positionIndex - 1)} style={{ fontSize: '36px' }}>&lt;</span>
                &nbsp;
                &nbsp;
                &nbsp;
                <span onClick={() => changePosition(positionIndex + 1)} style={{ fontSize: '36px' }}>&gt;</span>
                &nbsp;
                &nbsp;
                <span onClick={() => changePosition(positions.length - 1)} style={{ fontSize: '36px' }}>&raquo;</span>
            </div>
            <div style={{position: 'absolute', top: '20px', left: '-150px'}}>
                Evaluation: {evalBar}
            </div>
            {
                gameRunning !== 'running' ?
                    gameEndReason === 'checkmate' || gameEndReason === 'timeout' ?
                        <div style={{
                            position: 'absolute', fontSize: '36px',
                            backgroundColor: 'white', bottom: '-100px',
                            borderRadius: '8px'
                        }}>
                            {gameRunning} won the game by {gameEndReason}!
                        </div>
                        :
                        <div style={{
                            position: 'absolute', fontSize: '36px',
                            backgroundColor: 'white', bottom: '-100px',
                            borderRadius: '8px'
                        }}>
                            Game ended in a draw by {gameEndReason}!
                        </div>
                    :
                    null
            }
        </div>
    );
}

export default memo(Board);
