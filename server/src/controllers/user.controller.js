const userService = require('../services/user.service');
const asyncHandler = require('../middlewares/asyncHandler');

/** POST /api/users */
const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);

  res.status(201).json({
    status: 'success',
    data: user,
  });
});

/** GET /api/users */
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();

  res.status(200).json({
    status: 'success',
    data: users,
  });
});

/** GET /api/users/:id */
const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(Number(req.params.id));

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
};