require('dotenv').config();

const bcrypt = require('bcryptjs');
const prisma = require('../src/db/client');
const {
  createCategory,
  createSubCategory,
} = require('../src/services/category.service');

const SALT_ROUNDS = 10;

/**
 * Bootstrap an ADMIN user from environment variables.
 *
 * Required:
 *   ADMIN_EMAIL
 *   ADMIN_PASSWORD
 * Optional:
 *   ADMIN_NAME  (defaults to "Admin")
 *
 * Run:
 *   cd server
 *   npx prisma db seed
 *
 * Also runs automatically when the server starts (existing project behavior).
 * Safe to run repeatedly: upserts by email, hashes the password, sets role=ADMIN.
 */
const ensureAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME?.trim() || 'Admin';

  if (!adminEmail || !adminPassword) {
    console.log(
      'Admin seed skipped: set ADMIN_EMAIL and ADMIN_PASSWORD in .env to create an admin user.'
    );
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, SALT_ROUNDS);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      passwordHash,
      role: 'ADMIN',
    },
    create: {
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: 'ADMIN',
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  console.log(`Admin user ready: ${admin.email} [role=${admin.role}]`);
};

const runSeed = async () => {
  console.log(' Starting Prisma seed...');

  await ensureAdminUser();

  const existing = await prisma.category.findMany();

  if (existing.length > 0) {
    console.log('✔ Seed skipped - category data already exists');
    return;
  }

  console.log(' Creating categories + subcategories...');

  const programming = await createCategory('Programming');
  const ai = await createCategory('AI');
  const design = await createCategory('Design');
  const business = await createCategory('Business');
  const science = await createCategory('Science');
  const lifestyle = await createCategory('Lifestyle');

  await createSubCategory(programming.id, 'JavaScript');
  await createSubCategory(programming.id, 'Node.js');
  await createSubCategory(programming.id, 'React');
  await createSubCategory(programming.id, 'TypeScript');

  await createSubCategory(ai.id, 'Prompt Engineering');
  await createSubCategory(ai.id, 'LLMs');
  await createSubCategory(ai.id, 'Machine Learning');
  await createSubCategory(ai.id, 'Deep Learning');

  await createSubCategory(design.id, 'UI Design');
  await createSubCategory(design.id, 'UX Research');
  await createSubCategory(design.id, 'Figma');
  await createSubCategory(design.id, 'Prototyping');

  await createSubCategory(business.id, 'Startups');
  await createSubCategory(business.id, 'Marketing');
  await createSubCategory(business.id, 'Finance');
  await createSubCategory(business.id, 'Strategy');

  await createSubCategory(science.id, 'Physics');
  await createSubCategory(science.id, 'Biology');
  await createSubCategory(science.id, 'Chemistry');
  await createSubCategory(science.id, 'Mathematics');

  await createSubCategory(lifestyle.id, 'Fitness');
  await createSubCategory(lifestyle.id, 'Nutrition');
  await createSubCategory(lifestyle.id, 'Productivity');
  await createSubCategory(lifestyle.id, 'Mindfulness');

  console.log('✔ Seed completed successfully');
};

if (require.main === module) {
  runSeed()
    .catch((err) => {
      console.error(' Seed failed:', err);
      process.exitCode = 1;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
} else {
  module.exports = runSeed;
}
