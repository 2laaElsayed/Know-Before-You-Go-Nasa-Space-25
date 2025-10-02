var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ErrorHandler = require('./middelwares/ErrorHandler');

var authRouter = require('./routes/auth');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/* Homepage route to check if server is running */
app.get("/", (req, res) => {
  res.send("Server is running!");
});

/* Routes */
app.use('/api/auth', authRouter);

app.use(ErrorHandler);

module.exports = app;
