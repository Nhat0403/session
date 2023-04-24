const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const Product = require('../models/products');

exports.postDummyProducts = (req, res, next) => {
  const { products } = req.body;
  fs.writeFile(p, JSON.stringify(products), (err) => {
    console.log(err);
  });
  console.log(products)
};

exports.getAllProducts = async(req, res, next) => {
  try {
    // console.log(req.session.user);
    const products = await Product.find();
    return res.status(200).json({ message: 'ok', data: products })
  } catch(err) {
    if(!err.statusCode) {
      err.statusCode = 500;
      next(err);
    };
  };
};

exports.getProductById = async(req, res, next) => {
  const { prodId } = req.query;
  try {
    const product = await Product.findById(prodId);
    return res.status(200).json({ message: 'ok', data: product });
  } catch(err) {
    if(!err.statusCode) {
      err.statusCode = 500;
      next(err);
    };
  };
};