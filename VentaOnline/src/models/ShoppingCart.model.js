'use strict'

const mongoose = require('mongoose');

const shoppCartSchema = mongoose.Schema({
    user: {type: mongoose.Schema.ObjectId, ref: 'User'},
    quantity: Number,
    product: {type: mongoose.Schema.ObjectId, ref: 'Product'},
    total: Number
});

module.exports = mongoose.model('ShoppCart', shoppCartSchema);