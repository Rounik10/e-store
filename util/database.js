const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(process.env.MONGO_DB_URL)
    .then((client) => {
      console.log('Connedted to MongoDB');
      _db = client.db('e-store');
      callback();
    })
    .catch((err) => console.log(err));
};

exports.mongoConnect = mongoConnect;
exports.getDb = () => {
  if (_db) return _db;
  throw 'Not connected to DB yet';
};
