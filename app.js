require('dotenv').config();
require('express-async-errors');


const bcrypt = require('bcryptjs');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// to avoid deprecation warning
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

//express
const express = require('express');
const app = express();
//extra packages
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
//database
const connectDB = require('./db/connect');
//routes
const authRouter = require('./routes/authRoute');
const userRouter = require('./routes/userRoute');
const productRouter = require('./routes/productRoute');
const reviewRouter = require('./routes/reviewRoute');

app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use(express.static('./public'));
app.use(fileUpload());

app.get('/', (req, res) => {
  // throw new Error('raghav khandelwal');
  // throw Error('raghav khandelwal');

  res.send(`ecommerce api`);
});

app.get('/api/v1', (req, res) => {
  // console.log(req.signedCookies.token);
  // console.log(req.signedCookies);
  if (Object.keys(req.signedCookies).length !== 0) {
    // console.log(req.signedCookies);
    res.send(`e-commerce api with cookies`);
  } else res.send(`can't find cookies`);
  // res.send(`I will get the response`);
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);

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
