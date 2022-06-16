const db = require('../util/database');

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    db.execute(
      'INSERT INTO Products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)',
      [this.title, this.price, this.description, this.imageUrl]
    );
  }

  static updateProduct(updatedProduct) {
    return db.execute(
      `
      UPDATE products 
      SET 
        title = '${updatedProduct.title}',
        price = ${updatedProduct.price}, 
        description = '${updatedProduct.description}', 
        imageUrl = '${updatedProduct.imageUrl}'
      `
    );
  }

  static deleteById(id) {
    return db.execute(`DELETE FROM products WHERE id = ${id}`);
  }

  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }

  static findById(id) {
    return db.execute(`SELECT * FROM products WHERE id = ${id} LIMIT 1`);
  }
};
