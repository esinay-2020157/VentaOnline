' use strict '

const { validateData, checkUpdate, findShoppingCart } = require('../utils/validate');
const Invoice = require('../models/invoice.model');
const Cart = require('../models/ShoppingCart.model');
const Product = require('../models/product.model');

/* -------------------- TEST -------------------- */
exports.testInvoice = (req, res) => {
    return res.send({ message: 'La funcion testInvoice esta corriendo' });
}

/* -------------------- ACTUALIZAR FACTURA -------------------- */
exports.showInvoice = async (req, res) => {
    try {
        const userId = req.user.sub;
        const findShoppingCart = await Cart.findOne({ user: userId }).populate('product').lean();
        if (findShoppingCart === null) {
            return res.send({ message: 'There are no items in the cart' })
        } else {
            for (let index = 0; index < findShoppingCart.product.length; index++) {
                const shoppingCartProduct = await findShoppingCart.product[index];
                const indexProduct = await findShoppingCart.product[index].product.valueOf();
                const productId = await Product.findOne({ _id: indexProduct }).lean();
                let quantity = shoppingCartProduct.quantity;
                const data = {
                    stock: productId.stock,
                    sales: productId.sales
                }
                data.stock = (productId.stock - quantity);
                data.sales = (productId.sales + quantity)
                await Product.findOneAndUpdate({ _id: indexProduct }, data, { new: true }).lean()
            }
            const invoice = new Invoice(findShoppingCart);
            await invoice.save();
            await Cart.findOneAndRemove({ user: userId });
            return res.send({ message: 'Generated invoice', invoice });
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

/* -------------------- ACTUALIZAR FACTURA -------------------- */
exports.updateInvoice = async (req, res) => {
    try {
        const params = req.body;
        const invoiceId = req.params.id;
        const check = await checkUpdate(params);
        if (check === false) return res.status(400).send({ message: 'Data not received' });
        const updateInvoice = await Category.findOneAndUpdate({ _id: invoiceId }, params, { new: true });
        return res.send({ message: 'Updated Invoice', updateInvoice });
    } catch (err) {
        console.log(err);
        return err;
    }
}
