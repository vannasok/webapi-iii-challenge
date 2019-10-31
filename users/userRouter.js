const express = require('express');
const router = express.Router();
const users = require('./userDb');
const posts = require('../posts/postDb');

//add user #########################
router.post('/', validateUser, (req, res) => {
   users
      .insert(req.body)
      .then(user => {
         res.status(201).json(user);
      })
      .catch(err => {
         console.log('*post /* err :', err);
         res.status(400).json({ message: 'missing required name field' });
      });
});

//add post to a user ########################
router.post('/:id/posts', [validateUserId, validatePost], (req, res) => {
   req.body.user_id = req.params.id;
   posts
      .insert(req.body)
      .then(post => {
         res.status(200).json(post);
      })
      .catch(err => {
         console.log('*post /id/post* err :', err);
         res.status(400).json({ message: 'missing required text field' });
      });
});

//get all users ##############################
router.get('/', (req, res) => {
   users
      .get(req.query)
      .then(users => {
         res.status(200).json(users);
      })
      .catch(err => {
         console.log('*get all user* err :', err);
         res.status(400).json({
            message: 'Error retrieving users.'
         });
      });
});

//get uses by id #####################
router.get('/:id', validateUserId, (req, res) => {
   const { id } = req.params; //req.params.id didn't work
   users
      .getById(id)
      .then(user => {
         res.status(200).json(user);
      })
      .catch(err => {
         console.log('*get user id* err :', err);
         res.status(400).json({
            message: 'invalid user id'
         });
      });
});

//get user post ##################
router.get('/:id/posts', validateUserId, (req, res) => {
   users
      .getUserPosts(req.params.id)
      .then(posts => {
         res.status(201).json(posts);
      })
      .catch(err => {
         res.status(400).json({
            message: "Error getting user's posts."
         });
      });
});

//delete a user #######################
router.delete('/:id', validateUserId, (req, res) => {
   const { id } = req.params;
   users
      .remove(id)
      .then(removed => {
         if (removed) {
            res.status(200).json({ message: 'User has been deleted.' });
         } else {
            res.status(404).json({ error: 'User was not found' });
         }
      })
      .catch(err => {
         res.status(500).json({ error: 'Could not delete user' });
      });
});

//edit user #######################
router.put('/:id', validateUserId, (req, res) => {
   const id = req.params.id;

   users
      .update(id, req.body)
      .then(update => {
         res.status(201).json(update);
      })
      .catch(err => {
         console.log(err);
         res.status(500).json({
            message: 'Error updating user'
         });
      });
});

//custom middleware

function validateUserId(req, res, next) {
   const id = req.params.id;
   users
      .getById(id)
      .then(user => {
         if (user) {
            req.user = user;
            next();
         } else {
            res.status(400).json({ message: 'No user with given id' });
         }
      })
      .catch(err => {
         res.status(500).json({ message: 'Error process the request' });
      });
}

function validateUser(req, res, next) {
   if (!req.body) {
      res.status(400).json({ message: 'missing user data' });
   } else if (!req.body.name) {
      res.status(400).json({ message: 'missing required name field' });
   } else {
      next();
   }
}

function validatePost(req, res, next) {
   const body = req.body;
   const text = req.body.text;
   if (!body) {
      res.status(400).json({ message: 'missing post data' });
   } else if (!text) {
      res.status(400).json({ message: 'missing required text field' });
   } else {
      next();
   }
}

module.exports = router;
