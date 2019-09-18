const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const mongoose = require('mongoose');
const { successResponse, errorResponse } = require('../helpers/response');

exports.postOrder = async (req, res, next) => {
    try {
        const {
            productId,
            qty
        } = req.body;
        console.log(typeof (qty));

        let user = await User.findById(req.params.userId);
        let order = await Order.findById(user.orders[user.orders.length - 1]);
        // console.log(user.orders.length);
        // console.log(user.orders[user.orders.length - 1]);
        // console.log(order.isComplete);
        if (order && !order.isComplete) {
            console.log('found active order');
            let cart = await order.carts.find(product => ({ 'product.product': productId }));
            // console.log(cart)
            if (cart) {
                let qtyInt = parseInt(qty)
                cart.qty += qtyInt
            } else {
                await order.carts.push({
                    product: productId, qty: qty
                });
            }
            let product = await Product.findById(productId);
            order.orderPrice += (product.price * qty);
            stock = product.inventory - qty;
            if (stock < 0) {
                return res.status(422).json(errorResponse(`Product stock is only ${product.inventory}`));
            }
            product.inventory = stock;
            await product.save();
            await order.save();
            // console.log(order);
            res.status(200).json(successResponse('Order product success', order));
        } else {
            console.log('not found active order');
            let newOrder = new Order;
            newOrder.carts.push({
                product: productId, qty: qty
            });
            let product = await Product.findById(productId);
            newOrder.orderPrice = (product.price * qty);
            stock = product.inventory - qty;
            console.log(stock);
            if (stock < 0) {
                return res.status(422).json(errorResponse(`Product stock is only ${product.inventory}`));
            }
            product.inventory = stock;
            await product.save();
            await newOrder.save();
            console.log(newOrder);
            user.orders.push(newOrder);
            await user.save();
            res.status(200).json(successResponse('Order product success', newOrder));
        }
    } catch (err) {
        res.status(422).json(errorResponse('Something is error when order a product', err));
    }
}

// Find one using isComplete false
exports.getOrderActive = async (req, res, next) => {
    try {
        let user = await User.findById(req.params.userId);
        let order = await Order
            .findOne({ _id: user.orders, isComplete: 'false' })
            .select(['_id', 'carts', 'orderPrice', 'isComplete', 'timestamp'])
            .populate({
                path: 'carts.product',
                select: ['_id', 'name', 'price']
            });
        console.log(order);
        res.status(200).json(successResponse('Get an order is success', order));
    } catch (err) {
        res.status(422).json(errorResponse('Something is error when getting data', err));
    }
}

// getOrderHistory, get all isComplete is true, using isComplete true
exports.getOrderHistory = async (req, res, next) => {
    try {
        let user = await User.findById(req.params.userId);
        let order = await Order
            .find({ _id: user.orders, isComplete: 'true' })
            .select(['_id', 'carts', 'orderPrice', 'isComplete', 'timestamp'])
            .populate({
                path: 'carts.product',
                select: ['_id', 'name', 'price']
            });

        res.status(200).json(successResponse('Get an order is success', order));
    } catch {
        res.status(422).json(errorResponse('Something is error when getting data', err));
    }
}

// Update order qty then update orderPrice and product inventory
exports.updateOrderQty = async (req, res, next) => {
    try {
        let id = req.params.cartId;
        let newQty = req.body.qty;
        let order = await Order.findById(req.params.orderId)
        let cart = await order.carts.id(id);
        let product = await Product.findById(cart.product);
        let newPrice = product.price * newQty;
        order.orderPrice = newPrice;
        product.inventory += cart.qty;
        cart.qty = newQty;
        let stock = product.inventory - newQty;
        if (stock < 0) {
            return res.status(422).json(errorResponse(`Product stock is only ${product.inventory}`));
        }
        product.inventory = stock;
        console.log(product);
        await product.save();
        await order.save();

        res.status(200).json(successResponse('Update qty is success', order));
    } catch (err) {
        res.status(422).json(errorResponse('Something is error when updating order', err));
    }
}

exports.updateOrderStatus = async (req, res, next) => {
    try {
        let order = await Order.findByIdAndUpdate({ _id: req.params.orderId },
            {
                $set: { isComplete: req.body.isComplete }
            },
            { new: true }
        )
        res.status(200).json(successResponse('Update order status is success', order));
    } catch {
        res.status(422).json(errorResponse('Something is error when updating order status', err));
    }
}

exports.deleteById = async function (req, res, next) {
    try {
        let user = await User.findOne({ orders: mongoose.Types.ObjectId(req.params.orderId) });
        let index = await user.products.indexOf(req.params.prodId);
        user.orders.splice(index, 1);
        await Order.deleteOne({ _id: req.params.orderId });
        let result = await user.save();

        res.status(200).json(successResponse("Delete an item is success", result));
    } catch (err) {
        res.status(422).json(errorResponse("Something is error when deleting an item", err));
    }
}

exports.deleteAllOrder = async function (req, res, next) {
    try {
        let order = await Order.deleteMany({});

        res.status(200).json(successResponse("Delete all orders is success", order));
    } catch {
        res.status(422).json(errorResponse("Something is error when deleting all orders", err));
    }
}