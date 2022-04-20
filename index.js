const express = require("express");
const path = require("path");
const dotenv = require('dotenv')
dotenv.config()
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const Stockfish = require("stockfish")
const app = express();

 //var corsOptions = {
  //   origin: 'http://localhost:4000/'
 //};

const db = require("./server/server.js");
/*db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
     
  })
  .catch((err) => {
     
    process.exit();
  });*/

//app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  res.header("Cross-Origin-Embedder-Policy", "require-corp")
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", require("./server/routes/api"));
app.use(express.static(path.join(__dirname, "client", "build")));
app.use("*", express.static(path.join(__dirname, "client", "build")));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
   
});