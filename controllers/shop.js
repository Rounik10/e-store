const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = async (req, res, next) => {
  try {
    const prods = await Product.find();
    res.render('shop/product-list', {
      prods: prods,
      pageTitle: 'All Products',
      path: '/products',
    });
  } catch (err) {
    console.log(err);
    res.status(500);
    res.render('error', { error: err });
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const prodId = req.params.productId;
    const product = await Product.findOne({ _id: prodId });

    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products',
    });
  } catch (err) {
    console.log(err);
    res.status(500);
    res.render('error', { error: err });
  }
};

exports.getIndex = async (req, res, next) => {
  try {
    const prods = await Product.find();
    res.render('shop/index', {
      prods: prods,
      pageTitle: 'All Products',
      path: '/',
    });
  } catch (err) {
    console.log(err);
    res.status(500);
    res.render('error', { error: err });
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const products = await req.user.getCart();
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products,
    });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .addToCart(prodId)
    .then((result) => {
      console.log(result);
      res.redirect('/cart');
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.postCartDeleteProduct = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    await req.user.deleteCartItem(prodId);
    res.redirect('/cart');
  } catch (err) {
    console.log(err);
    res.redirect('/cart');
  }
};

exports.getOrders = async (req, res, next) => {
  const orders = await Order.find({ userId: req.user._id });
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
    orders: orders,
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  });
};

exports.postOrder = async (req, res, next) => {
  try {
    // Add new order
    const orderItems = await req.user.getCart();

    const newOrder = new Order({
      userId: req.user._id,
      items: orderItems,
    });

    await newOrder.save();

    // Clear cart
    await req.user.clearCart();

    // Redirect to orders
    res.redirect('/orders');
  } catch (err) {
    console.log(err);
    res.status(500).send('Something went wrong!');
  }
};
