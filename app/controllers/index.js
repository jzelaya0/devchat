// INDEX JS
// app/controllers/index.js
const express        = require('express');
const apiRouter      = express.Router();
const userRoute      = require('./users');
const registerRoute  = require('./register');

// ==================================================
// ALL ROUTES: Gather all routes here
// ==================================================
// Routes don't require token
apiRouter.get('/', function(req, res){
  res.json({message: "Welcome to the API"});
});

apiRouter.use('/register', registerRoute);

// Routes require token
apiRouter.use('/users',userRoute);

// export all routes
module.exports = apiRouter;
