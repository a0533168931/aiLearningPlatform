const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const userRoutes = require('./routes/user.routes');
const userCategoryRoutes = require('./routes/category.user.routes');
const adminCategoryRoutes = require('./routes/category.admin.routes');
const promptRoutes = require('./routes/prompt.routes');

const notFound = require('./middlewares/notFound.middleware');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(cors());

app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}


app.use('/api/users', userRoutes);
app.use('/api/categories', userCategoryRoutes);
app.use('/api/admin/categories', adminCategoryRoutes);
app.use('/api/prompts', promptRoutes);
app.use(notFound);
app.use(errorMiddleware);

module.exports = app;