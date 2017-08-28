// server.js
"use strict";

// =========================
// BASE SET UP
// =========================
const express      = require('express');
const app          = express();
const path         = require('path');
const morgan       = require('morgan');
const bodyParser   = require('body-parser');
const mongoose     = require('mongoose');
const env          = require('dotenv').config();


// =========================
// CONFIGURATIONS
// =========================

// Database connection
// ====================
const currentEnv = process.env.NODE_ENV || 'development';

if (currentEnv === 'development') {
  mongoose.connect(env.DB_LOCAL);
}else {
  mongoose.connect(env.DB_HOSTED);
}

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'CONNECT TO DATABASE FAILED'));
db.once('open', function(){
  console.log('SUCCESSFULLY CONNECTED TO DATABASE');
});


// Middlewares
// ====================
// Use body-parser to grab info from POST requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// Handle CORS requests
app.use(function(req,res,next){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  next();
});
// Log all requests to console
app.use(morgan('dev'));

// Get all routes from /app/controllers/index.js
const apiRoutes = require("./app/controllers");

// routes prefixed with "api"
app.use('/api', apiRoutes);


// =========================
// START SERVER
// =========================
app.listen(process.env.PORT || 3000);
console.log('LISTENING ON PORT', env.PORT);
