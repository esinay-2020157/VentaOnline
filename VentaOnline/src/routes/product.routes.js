'use strict'


const producController = require('../controllers/product.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');

api.get('/prueba', producController.prueba);
api.post('/saveProduct',[mdAuth.ensureAuth, mdAuth.isAdmin], producController.saveProduct);
api.get('/getProducts', producController.getProducts);
api.get('/getProduct/:id', producController.getProduct);
api.post('/searchProduct', producController.searchProduct);
api.put('/updateProduct/:id',[mdAuth.ensureAuth,mdAuth.isAdmin], producController.updateProduct);
api.get('/productsExhausted',[mdAuth.ensureAuth,mdAuth.isAdmin],producController.productsExhausted);
api.get('/popularProducts',[mdAuth.ensureAuth,mdAuth.isAdmin], producController.popularProducts);
api.delete('/deleteProduct/:id',[mdAuth.ensureAuth,mdAuth.isAdmin],producController.deleteProduct);
api.get('/getStock', mdAuth.ensureAuth, producController.getstock);

module.exports = api;