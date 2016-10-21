// server.js
"use strict";

// =========================
// BASE SET UP
// =========================
let express      = require('express');
let app          = express();
let path         = require('path');
let morgan       = require('morgan');
let bodyParser   = require('body-parser');
let env          = require('dotenv').config();


// =========================
// CONFIGURATIONS
// =========================

// Middlewares
// ====================
// Use body-parser to grab info from POST requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// Handle CORS requests
app.use(function(req,res,next){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
})
// Log all requests to console
app.use(morgan('dev'));

// Temporary root route
app.get('/', function(req, res) {
  res.send('Hello World!')
});

// =========================
// START SERVER
// =========================
app.listen(env.PORT)
console.log('LISTENING ON PORT', env.PORT);
