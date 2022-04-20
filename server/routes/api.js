const express = require('express');
const router = express.Router();
const stockfish = require('stockfish');

router.get('/stockfish/move', (req, res, next) => {
    res.json(stockfish)
})

module.exports = router;