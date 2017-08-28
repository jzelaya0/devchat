"use strict";
// USERS ROUTES
const express = require('express');
const router  = express.Router();
const User    = require('../models/user');

// ==================================================
// ROUTE: api/users/
// ==================================================
/* GET */
router.route('/')
  .get((req, res) => {
    User.find((err, users) => {
      if (err) res.send(err);
      // return all users
      res.json(users)
    });
  });

// ==================================================
// ROUTE: api/users/:user_id
// ==================================================
router.route('/:user_id')
  /* GET */
  .get((req, res) => {
    User.findById(req.params.user_id, (err, user) => {
      if (err) res.send(err);
      // return user
      res.json(user);
    });
  })

  /* PUT */
  .put((req, res) => {
    User.findById(req.params.user_id, (err, user) => {
      if (err) res.send(err);

      // Request params
      if(req.body.name) user.name = req.body.name;
      if (req.body.username) user.username = req.body.username;
      if (req.body.password) user.password = req.body.password;

      // save changes
      user.save((err) => {
        if (err) res.send(err);

        // success response
        res.json({success: true, message: "Successfully updated"});
      });
    });
  })

  /* DELETE */
  .delete((req, res) => {
    User.remove({_id: req.params.user_id}, (err) => {
      if (err) res.send(err);

      // success response
      res.json({ success: true, message: "Successfully deleted user"});
    });
  });

// Export User routes
module.exports = router;
