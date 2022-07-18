'use strict'
const express = require('express');
const categoryController = require('../controllers/category.controller');
const api = express.Router();
const mdAuth = require('../services/authenticated');

api.get('/test', categoryController.test);
api.post('/saveCategory', categoryController.saveCategory);
api.get('/getCategories/:id', categoryController.getCategories);
api.put('/updateCategory/:id',[mdAuth.ensureAuth,mdAuth.isAdmin], categoryController.updateCategory);
api.delete('/deleteCategory/:id',[mdAuth.ensureAuth, mdAuth.isAdmin],categoryController.deleteCategory);

module.exports = api;