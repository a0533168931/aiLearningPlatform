/**
 * User Routes
 * Connects endpoints to controllers with optional middleware.
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const validate = require('../middlewares/validate.middleware');
/** POST /api/users/create — create a new user */
router.post('/create', validate(['name', 'phone']), userController.createUser);
/** GET /api/users/all — get all users */
router.get('/all', userController.getAllUsers);
/** GET /api/users/view/:id — get user by id */
router.get('/view/:id', userController.getUserById);

module.exports = router;