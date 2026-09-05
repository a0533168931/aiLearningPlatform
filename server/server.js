require('dotenv').config();

const runSeed = require('./prisma/seed');
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

runSeed()
  .catch((error) => {
    console.error('Seed failed:', error);
  })
  .finally(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
