
/**
 * Generic request validation middleware.
 *
 * Ensures required fields exist and match
 * predefined validation rules.
 */

const rules = {
  name: {
    test: (v) => /^[\p{L}\s]{2,100}$/u.test(v.trim()),
    message: 'Name must contain letters only (min 2 characters)',
  },
  phone: {
    test: (v) => /^[0-9+\-() ]{7,20}$/.test(v.trim()),
    message: 'Invalid phone number',
  },
  userId: {
    test: (v) => Number.isInteger(Number(v)) && Number(v) > 0,
    message: 'userId must be a positive integer',
  },
  categoryId: {
    test: (v) => Number.isInteger(Number(v)) && Number(v) > 0,
    message: 'categoryId must be a positive integer',
  },
  subCategoryId: {
    test: (v) => Number.isInteger(Number(v)) && Number(v) > 0,
    message: 'subCategoryId must be a positive integer',
  },
  prompt: {
    test: (v) => v.trim().length >= 3,
    message: 'Prompt must be at least 3 characters',
  },
};

const validate = (fields, source = 'body') => (req, res, next) => {
  const data = req[source] || {};

  const missing = fields.filter((field) => {
    const value = data[field];
    return value === undefined || value === null || value === '';
  });

  if (missing.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: `Missing required fields: ${missing.join(', ')}`,
    });
  }

  for (const field of fields) {
    const rule = rules[field];
    if (rule && !rule.test(data[field])) {
      return res.status(400).json({
        status: 'error',
        message: rule.message,
      });
    }
  }

  next();
};

module.exports = validate;