'use strict'
const express = require('express');
const cartContoller = require('../controllers/Shoppingcart.controller');
const api = express.Router();
const mdAuth = require('../services/authenticated');

api.get('/testShoppingCart', cartContoller.testCart);
api.post('/addShopping',mdAuth.ensureAuth, cartContoller.addShopping);

module.exports = api;

