/**
 * User Service
 * Encapsulates all business logic related to users.
 */

const prisma = require('../db/client');

/**
 * Creates a new user.
 * Throws 409 if the phone number is already taken.
 *
 * @param {{ name: string, phone: string }} data
 * @returns {Promise<User>}
 */
const createUser = async ({ name, phone }) => {
  const existing = await prisma.user.findUnique({ where: { phone } });

  if (existing) {
    const error = new Error('A user with this phone number already exists.');
    error.statusCode = 409;
    throw error;
  }

  return prisma.user.create({ data: { name, phone } });
};

/**
 * Returns all users ordered by id ascending.
 *
 * @returns {Promise<User[]>}
 */
const getAllUsers = () =>
  prisma.user.findMany({ orderBy: { id: 'asc' } });

/**
 * Returns a single user by id.
 * Throws 404 if not found.
 *
 * @param {number} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    const error = new Error(`User with id ${id} not found.`);
    error.statusCode = 404;
    throw error;
  }

  return user;
};

module.exports = { createUser, getAllUsers, getUserById };