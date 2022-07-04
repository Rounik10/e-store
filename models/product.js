const getDb = require('../util/database').getDb;
const ObjectId = require('mongodb').ObjectId;
class Product {
  constructor(title, price, description, imageUrl, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this.createdBy = userId;
  }

  save() {
    const db = getDb();
    return db
      .collection('products')
      .insert(this)
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }

  static async getAll() {
    try {
      const db = getDb();
      const products = await db.collection('products').find().toArray();
      console.log(products);
      return products;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static async getById(id) {
    try {
      const db = getDb();
      const product = await db
        .collection('products')
        .findOne({ _id: ObjectId(id) });
      return product;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static async update(id, updatedProduct) {
    try {
      const db = getDb();
      const updateDoc = {
        $set: {
          ...updatedProduct,
        },
      };
      console.log(updateDoc);
      return await db
        .collection('products')
        .updateOne({ _id: ObjectId(id) }, updateDoc);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static deleteById(id) {
    const db = getDb();
    return db.collection('products').deleteOne({ _id: ObjectId(id) });
  }
}

module.exports = Product;
