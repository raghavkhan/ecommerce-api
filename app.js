require('dotenv').config();
require('express-async-errors');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// to avoid deprecation warning
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

//express
const express = require('express');
const app = express();
l;
//extra packages
const morgan = require('morgan');
//database
const connectDB = require('./db/connect');
//routes
const authRouter = require('./routes/authRoute');

app.use(morgan('tiny'));
app.use(express.json());

app.get('/', (req, res) => {
  // throw new Error('raghav khandelwal');
  // throw Error('raghav khandelwal');
  res.send(`ecommerce api`);
});

app.use('/api/v1/auth', authRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log(`db connected!`);
    app.listen(port, () => {
      console.log(`server is listening at port: ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
