const express = require('express');
const app = express();

const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const cors = require('cors');
const User = require('./models/user');

const URI = 'mongodb+srv://nhat:F0zwwyPdfQ9lumQw@cluster0.gmbddls.mongodb.net/session';
const store = new MongoDBStore(
  {
    uri: URI,
    collection: 'sessions'
  }
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session(
  {
    secret: 'your-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1*3600*1000,
      secure: true,
    },
    store: store
  }
));

app.use(async(req, res, next) => {
  console.log(session);
  if(!req.session.user) {
    return next();
  };
  try {
    const user = await User.findById(req.session.user._id);
    req.user = user;
    console.log(req.user);
    next();
  } catch(err) {
    console.log(err);
  };
});

const userRoutes = require('./routes/user');
app.use('/users', userRoutes);
const productRoutes = require('./routes/products');
app.use('/products', productRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  return res.status(status).json({ message: message, data: data });
});

const PORT = 5000;
mongoose.connect(URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log('Server Listening on port ' + PORT);
    });
  })
  .catch(err => console.log(err));