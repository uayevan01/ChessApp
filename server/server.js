const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const dotenv = require('dotenv');
dotenv.config();

const db = {};
db.mongoose = mongoose;
db.url = process.env.MONGO_DB_URL;
db.models = require('./models/models.js');

module.exports = db;