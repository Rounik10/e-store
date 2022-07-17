const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (productId) {
  const cartItems = this.cart.items;

  const index = cartItems.findIndex(
    (it) => it.productId.toString() === productId.toString()
  );

  if (index >= 0) cartItems[index].quantity++;
  else cartItems.push({ productId: productId, quantity: 1 });

  const updatedCart = { items: cartItems };

  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.getCart = async function () {
  const populated = await this.populate('cart.items.productId');
  return populated.cart.items.map((it) => {
    return {
      ...it.productId._doc,
      quantity: it.quantity,
    };
  });
};

userSchema.methods.deleteCartItem = async function (productId) {
  this.cart.items = this.cart.items.filter(
    (it) => it.productId.toString() !== productId.toString()
  );
  await this.save();
};

module.exports = mongoose.model('User', userSchema);
