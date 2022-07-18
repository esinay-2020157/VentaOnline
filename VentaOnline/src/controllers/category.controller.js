'use strict '

const Category = require('../models/category.model');
const {validateData,checkUpdate,checkPermission, searchCategoryId}= require('../utils/validate');
const Product = require('../models/product.model');

/* -------------------- TEST -------------------- */
exports.test = (req, res)=>{
    return res.send({message: 'La funcion de categoria está corriendo'});
}

/* -------------------- GUARDAR CATEGORIA -------------------- */
exports.saveCategory = async (req, res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name,
            description: params.description,
        };
        const msg = validateData(data);
        if(!msg){

        const category = new Category(data);
        await category.save();
        return res.send({message: 'Categoria Guardada'});
        }else return res.status(400).send(msg);
    }catch(err){
        console.log(err);
        return err;
    }
}

/* -------------------- MOSTRAR CATEGORIAS -------------------- */
exports.getCategories = async(req, res)=>{//Actualizar una categoria

    try{
        const categoryId = req.params.id;
        const category = await Category.findOne({_id: categoryId});
        const ProductsCategory = await Product.find({category: categoryId});
        return res.send({category,ProductsCategory});
    }catch(err){
        console.log(err);
        return err;
    }
}

/* -------------------- ACTUALIZAR CATEGORIAS -------------------- */
exports.updateCategory = async(req, res)=>{
    try{
        const params = req.body;
        const categoryId = req.params.id;
        const check = await checkUpdate(params);
        if(check === false) return res.status(400).send({message: 'Data not received'});
        const updateCategory = await Category.findOneAndUpdate({_id: categoryId}, params, {new: true});
        return res.send({message: 'Updated Category', updateCategory});
    }catch(err){
        console.log(err);
        return err;
    }
}

/* -------------------- CATEGORIA POR DEFECTO -------------------- */
exports.defaultCategory = async (req, res)=>{
    try{
        const data = {
            name: 'default',
            description: 'default',
        };
    
        const category = new Category(data);
        await category.save();
        return res.send({message: 'producto guardado'});
    }catch(err){
        console.log(err);
        return err;
    }
}

/* -------------------- ELIMINAR CATEGORIA -------------------- */
exports.deleteCategory = async(req, res)=>
{
    try
    {
        const categoryId = req.params.id;
        const categoryExist = await searchCategoryId(categoryId)
        if(!categoryExist)
            return res.status(500).send({message: 'Category not found or already delete.'});
        if(categoryExist.name === 'DEFAULT')
            return res.send({message: 'Default category cannot be deleted.'});
        const newCategory = await Category.findOne({name:'DEFAULT'}).lean();
        const products = await Product.find({category:categoryId});
        if(products ==null)
        {

        }
        for(let arreglo of products)
        {
            const updateCategory = await Product.findOneAndUpdate({_id:arreglo._id},{category:newCategory._id});
        }
        const categoryDeleted = await Category.findOneAndDelete({_id: categoryId});
        return res.send({message: 'Delete Category.', categoryDeleted});
    }
    catch(err)
    {
        console.log(err);
        return err;
    }
}
