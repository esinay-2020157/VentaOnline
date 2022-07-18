'use strict'

const invoiceController = require('../controllers/invoice.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');

api.get('/testInvoice', invoiceController.testInvoice);
api.post('/checkInvoice/:id',mdAuth.ensureAuth,invoiceController.showInvoice);
api.put('/updateInvoice/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], invoiceController.updateInvoice)

module.exports = api;