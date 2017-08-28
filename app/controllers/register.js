const express = require('express');
const router = express.Router();
const User  = require('../models/user');

// ==================================================
// ROUTE FOR: /api/register
// ==================================================
router.post('/', (req, res) => {
  // create new user instance
  const user = new User();

  // Attach user's info from body
  user.name = req.body.name;
  user.username = req.body.username;
  user.password = req.body.password;
  user.admin = req.body.admin;

  // save users info
  user.save((err) => {
    if (err) {
      // check for duplicate usernames
      if (err.errors.username !== null) {
        const username = err.errors.username;

        // Send errors of username or email
        return res.send({
          username_error: username
        });
      }
    }

    // Send success response
    res.json({
      success: true,
      message: "Success! Your account has been created!"
    });

  });

});


module.exports = router;
