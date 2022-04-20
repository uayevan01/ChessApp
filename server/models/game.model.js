const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema( {
    white: {
        type: String,
        required: true
    },
    whiteELO: {
        type: String,
        required: true
    },
    black: {
        type: String,
        required: true
    },
    blackELO: {
        type: String,
        required: true
    },
    winner: {
        type: Boolean,
        required: true
        //true means white won, false means black won
    }
}, {timestamps: true});

const Game = mongoose.model('Game', GameSchema)
module.exports = Game;