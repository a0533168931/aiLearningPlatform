/**
 * User Service
 * Encapsulates all business logic related to users.
 */

const bcrypt = require('bcryptjs');
const prisma = require('../db/client');
const httpError = require('../utils/httpError');

const SALT_ROUNDS = 10;
const DUMMY_PASSWORD_HASH =
  '$2b$10$BaXscdLooQWPv28coaCaR.p.gFrXzrCReop.GjUHM2WJhghjS9Txi';

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

const toPublicUser = (user) => {
  if (!user) return user;
  const { passwordHash, ...safeUser } = user;
  return safeUser;
};

const normalizeEmail = (email) => email.trim().toLowerCase();

/**
 * Registers a new user with a hashed password.
 * Role is always USER — callers cannot set it.
 *
 * @param {{ name: string, email: string, password: string }} data
 * @returns {Promise<object>}
 */
const registerUser = async ({ name, email, password }) => {
  const normalizedEmail = normalizeEmail(email);

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    throw httpError(409, 'A user with this email already exists.');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'USER',
    },
    select: publicUserSelect,
  });

  return user;
};

/**
 * Authenticates by email and password.
 * Always returns 401 for invalid credentials (no email-existence leak).
 *
 * @param {{ email: string, password: string }} data
 * @returns {Promise<object>}
 */
const loginUser = async ({ email, password }) => {
  const normalizedEmail = normalizeEmail(email);

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  const hashToCompare = user?.passwordHash || DUMMY_PASSWORD_HASH;
  let matches = false;
  try {
    matches = await bcrypt.compare(password, hashToCompare);
  } catch {
    matches = false;
  }

  if (!user || !matches) {
    throw httpError(401, 'Invalid email or password.');
  }

  return toPublicUser(user);
};

/**
 * Returns all users ordered by id ascending (never includes passwordHash).
 *
 * @returns {Promise<object[]>}
 */
const getAllUsers = () =>
  prisma.user.findMany({
    select: publicUserSelect,
    orderBy: { id: 'asc' },
  });

/**
 * Returns a single user by id (never includes passwordHash).
 * Throws 404 if not found.
 *
 * @param {number} id
 * @returns {Promise<object>}
 */
const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: publicUserSelect,
  });

  if (!user) {
    throw httpError(404, `User with id ${id} not found.`);
  }

  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  toPublicUser,
};
