' use strict '

const { validateData, checkUpdate, findShoppCart, findShopping } = require('../utils/validate');
const ShoppingCart = require('../models/ShoppingCart.model');
const Product = require('../models/product.model');

/* --------------------TEST-------------------- */
exports.testCart = (req, res) => {
    return res.send({ message: 'La funcion de testShoppingCart esta corriendo' });
}

/* -------------------- AGREGAR CARRITO -------------------- */
exports.addShopping = async (req, res) => {
    try {
        const params = req.body;
        const userId = req.user.sub;
        const data = {
            product: params.product,
            quantity: params.quantity
        };
        const msg = validateData(data);
        if (!msg) {
            const findProduct = await Product.findOne({ _id: data.product })
            if (data.quantity >= findProduct.stock) {
                return res.send({ message: 'this quantity is not in stock' });
            } else {
                const checkShoppCart = await findShopping(userId);
                if (!checkShoppCart) {
                    data.user = userId;
                    data.subtotal = (findProduct.price * data.quantity);
                    data.total = (data.subtotal);
                    const shoppCart = new ShoppingCart(data);
                    await shoppCart.save();
                    console.log(shoppCart)
                    const shoppCartId = await ShoppingCart.findOne({ user: userId })
                    const pushShoppCart = await ShoppingCart.findOneAndUpdate({ _id: shoppCartId._id },
                        { $push: { products: data } }, { new: true })
                        .populate('product').lean();
                    return res.send({ message: 'added to shopping cart', pushShoppCart });
                } else {
                    const shoppCartId = ShoppingCart.findOne({ user: userId });
                    const pushShoppCart = await ShoppingCart.findOneAndUpdate({ _id: shoppCartId._id },
                        { $push: { products: data } }, { new: true })
                        .populate('product').lean();
                    return res.send({ message: 'added to shopping cart', pushShoppCart });
                }
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

