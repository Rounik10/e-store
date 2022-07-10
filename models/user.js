const { ObjectId } = require('mongodb');
const Product = require('../models/product');

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

  getCart() {
    const cartItems = this.cart.items ? this.cart.items : [];
    const cartItemIds = cartItems.map((it) => it.productId.toString());
    return Product.getManyById(cartItemIds).then((products) =>
      products.map((it, index) => ({
        ...it,
        quantity: cartItems[index].quantity,
      }))
    );
  }

  deleteCartItem(productId) {
    console.log(productId);
    const updatedCartItems = this.cart.items.filter(
      (it) => it.productId.toString() !== productId.toString()
    );

    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  postOrder() {
    const db = getDb();
    return db
      .collection('orders')
      .insertOne({ ...this.cart, userId: this._id })
      .then((result) => {
        console.log(result);
        this.cart = { items: [] };
        return db
          .collection('users')
          .updateOne(
            { _id: ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      });
  }

  getOrders() {
    const db = getDb();
    return db
      .collection('orders')
      .find({ userId: ObjectId(this._id.toString()) })
      .toArray();
  }
}

module.exports = User;
