const express = require('express');
const router = express.Router();
const productRoutes = require('../controllers/products');

router.post('/dummyproducts', productRoutes.postDummyProducts);
router.get('/getAllProducts', productRoutes.getAllProducts);
router.get('/getProductById', productRoutes.getProductById);

module.exports = router;