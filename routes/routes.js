const router = require('express').Router();
const userController = require('./../controller/user');
const productController = require('./../controller/product');

router.post('/sign-up', userController.signUp);

router.post('/login', userController.checkUser);

router.post('/forgot-password', userController.sendMailPasswordReset);

router.post('/password-reset', userController.forgetPassword);

router.post('/product-list', productController.productList);

router.post('/order', productController.submitOrder);

module.exports = router;
