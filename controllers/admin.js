const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const newProduct = new Product(
    title,
    price,
    description,
    imageUrl,
    req.user._id
  );

  newProduct
    .save()
    .then((result) => {
      console.log(result);
      res.redirect('/admin/products');
    })
    .catch((err) => {
      res.status(500).send('Insertion failed');
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.getById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
      });
    })
    .catch(() => console.log('Error'));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const updatedProduct = {
    title: updatedTitle,
    price: updatedPrice,
    imageUrl: updatedImageUrl,
    description: updatedDesc,
  };
  Product.update(prodId, updatedProduct)
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log(err);
      res.status(503);
      res.send('Error!');
    });
};

exports.getProducts = async (req, res, next) => {
  const products = await Product.getAll();
  res.render('admin/products', {
    prods: products,
    pageTitle: 'Admin Products',
    path: '/admin/products',
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId)
    .then(() => res.redirect('/admin/products'))
    .catch((err) => {
      console.log(err);
      res.redirect('/admin/products');
    });
};
