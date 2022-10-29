const express = require('express');
require('./db/mongoose')
const path = require('path');
const cors = require('cors');

const app = express();

app.use(express.json());

const userRoutes = require("./router/user");

app.use(userRoutes);

// app.use(express.static(path.join(__dirname, 'public')))
// app.use(express.urlencoded({ extended: true }));

module.exports = app;