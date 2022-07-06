const { ObjectId } = require('mongodb');

const getDb = require('../util/database').getDb;

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  static findById(id) {
    const db = getDb();
    return db.collection('users').findOne({ _id: ObjectId(id) });
  }

  addToCart(productId) {
    const cartItems = this.cart && this.cart.items ? this.cart.items : [];

    const index = cartItems.findIndex(
      (it) => it.productId.toString() === productId.toString()
    );

    if (index >= 0) {
      cartItems[index].quantity++;
    } else {
      cartItems.push({ productId: productId, quantity: 1 });
    }

    const updatedCart = {
      items: cartItems,
    };

    const db = getDb();

    return db
      .collection('users')
      .updateOne({ _id: ObjectId(this._id) }, { $set: { cart: updatedCart } });
  }
}

module.exports = User;
