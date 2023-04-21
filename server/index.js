const express = require('express');
const app = express();

const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const cors = require('cors');

const URI = 'mongodb+srv://nhat:F0zwwyPdfQ9lumQw@cluster0.gmbddls.mongodb.net/session';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const userRoutes = require('./routes/user');
app.use('/users', userRoutes);

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