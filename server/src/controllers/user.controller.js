const userService = require('../services/user.service');
const asyncHandler = require('../middlewares/asyncHandler');
const { signAuthToken } = require('../utils/jwt');

const authResponse = (res, statusCode, user) => {
  const token = signAuthToken(user);

  return res.status(statusCode).json({
    status: 'success',
    user,
    token,
  });
};

/** POST /api/users/register */
const registerUser = asyncHandler(async (req, res) => {
  const user = await userService.registerUser(req.body);
  return authResponse(res, 201, user);
});

/** POST /api/users/login */
const loginUser = asyncHandler(async (req, res) => {
  const user = await userService.loginUser(req.body);
  return authResponse(res, 200, user);
});

/** GET /api/users/all */
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();

  res.status(200).json({
    status: 'success',
    data: users,
  });
});

/** GET /api/users/view/:id */
const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(Number(req.params.id));

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

module.exports = {
  registerUser,
  createUser: registerUser,
  loginUser,
  getAllUsers,
  getUserById,
};
