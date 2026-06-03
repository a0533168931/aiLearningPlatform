const prisma = require('../src/db/client');
const {
  createCategory,
  createSubCategory,
} = require('../src/services/category.service');

const runSeed = async () => {
  try {
    console.log(' Starting Prisma seed...');

    const existing = await prisma.category.findMany();

    if (existing.length > 0) {
      console.log('✔ Seed skipped - data already exists');
      return;
    }

    console.log(' Creating categories + subcategories...');

    // ========================
    // CATEGORIES
    // ========================

    const programming = await createCategory('Programming');
    const ai = await createCategory('AI');
    const design = await createCategory('Design');
    const business = await createCategory('Business');
    const science = await createCategory('Science');
    const lifestyle = await createCategory('Lifestyle');

    // ========================
    // SUBCATEGORIES
    // ========================

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
  } catch (err) {
    console.error(' Seed failed:', err);
  } finally {
    await prisma.$disconnect();
  }
};

runSeed();