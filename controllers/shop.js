const Product = require('../models/product');

exports.getProducts = async (req, res, next) => {
  try {
    const prods = await Product.getAll();
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
    const product = await Product.getById(prodId);

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
    const prods = await Product.getAll();
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

exports.getCart = (req, res, next) => {
  const cartItems = req.user.cart.items;
  const cartItemIds = cartItems.map((it) => it.productId.toString());
  console.log(cartItemIds);
  Product.getManyById(cartItemIds)
    .then((products) => {
      const prodcutData = products.map((it, index) => {
        return { ...it, quantity: cartItems[index].quantity };
      });

      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: prodcutData,
      });
    })
    .catch((err) => console.error(err));
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

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders({ include: ['products'] }).then((orders) => {
    // res.send(JSON.stringify(orders));
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders,
    });
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  });
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch((err) => console.log(err));
    })
    .then(() => {
      return fetchedCart.setProducts(null);
    })
    .then(() => {
      res.redirect('orders');
    })
    .catch((err) => console.log(err));
};
