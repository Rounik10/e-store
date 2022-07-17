require('dotenv').config();

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('62d064fbe91db743c0b6403b')
    .then((user) => {
      console.log(user);
      req.user = user;
      next();
    })
    .catch(console.err);
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

async function initApp() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL, { dbName: 'e-store' });
    app.listen(3000, () => {
      console.log('Server started on http://localhost:3000');
    });
  } catch (err) {
    console.error(err);
  }
}

initApp();
