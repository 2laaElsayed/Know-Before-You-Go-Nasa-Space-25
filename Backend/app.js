var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ErrorHandler = require('./middelwares/ErrorHandler');
var cors = require('cors');   

var authRouter = require('./routes/auth');
var eventRouter = require('./routes/event');
var userRouter = require('./routes/user');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


const allowedOrigins = [
  "http://localhost:5173", 
  "https://know-before-you-go.netlify.app"
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

/* Homepage route to check if server is running */
app.get("/", (req, res) => {
  res.send("Server is running!");
});

/* Routes */
app.use('/api/auth', authRouter);
app.use('/api/events', eventRouter);
app.use('/api/user', userRouter);


app.use(ErrorHandler);

module.exports = app;
