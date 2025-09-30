var express = require('express');
var path = require('path');
var cors = require('cors');
var mongoose = require('mongoose');

require('dotenv').config();

var app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('API is running...');
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

module.exports = app;
