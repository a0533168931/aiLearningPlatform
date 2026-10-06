/**
 * User Routes
 * Connects endpoints to controllers with optional middleware.
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const validate = require('../middlewares/validate.middleware');
const auth = require('../middlewares/auth.middleware');
const adminOnly = require('../middlewares/admin.middleware');

/** POST /api/users/register — create a new user (email + password) */
router.post(
  '/register',
  validate(['name', 'email', 'password']),
  userController.registerUser
);

/** POST /api/users/create — alias of register (existing path) */
router.post(
  '/create',
  validate(['name', 'email', 'password']),
  userController.createUser
);

/** POST /api/users/login — login existing user */
router.post('/login', validate(['email', 'password']), userController.loginUser);

/** GET /api/users/all — get all users */
router.get('/all', auth, adminOnly, userController.getAllUsers);

/** GET /api/users/view/:id — get user by id */
router.get('/view/:id', auth, userController.getUserById);

module.exports = router;
