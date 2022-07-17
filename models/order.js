const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  items: [
    {
      product: {
        type: {
          _id: mongoose.Types.ObjectId,
          title: String,
          price: Number,
          imageUrl: String,
        },
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model('Order', orderSchema);
