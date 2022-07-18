'use strict'

const express = require('express');
const bodyParser = require('body-Parser');
const helmet = require('helmet');
const cors = require('cors');
const userRoutes = require('../src/routes/user.routes');
const productRoutes = require('../src/routes/product.routes');
const categoryRoutes = require('../src/routes/category.routes');
const cartRoutes = require('../src/routes/ShoppingCart.routes');
const invoiceRoutes = require('../src/routes/invoice.routes');

const app = express(); // instancia

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use('/user', userRoutes);
app.use('/product', productRoutes);
app.use('/category', categoryRoutes);
app.use('/cart', cartRoutes);
app.use('/invoice', invoiceRoutes);


module.exports = app;