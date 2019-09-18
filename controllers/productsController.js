const Product = require('../models/Product');
const User = require('../models/User');
const mongoose = require('mongoose');
const { successResponse, errorResponse } = require('../helpers/response');

exports.postProduct = async (req, res, next) => {
    try {
        let user = await User.findOne({ _id: req.params.userId });
        if (user.isMerchant) {
            const newProduct = new Product({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                inventory: req.body.inventory
            });
            let product = await Product.create(newProduct);
            user.products.push(product);
            let result = await user.save();
            res.status(200).json(successResponse('Add product success', result));
        } else {
            res.status(403).json(errorResponse('User is not a merchant!', user));
        }
    } catch (err) {
        res.status(422).json(errorResponse('Something is error when adding a product', err));
    }
}

exports.getProducts = async (req, res, next) => {
    try {
        let user = await User
            .findById(req.params.userId)
            .select(['_id', 'username', 'products'])
            .populate({
                path: 'products',
                select: ['_id', 'name', 'description', 'price', 'inventory']
            });
        res.status(200).json(successResponse("Show products is success", user));
    } catch (err) {
        res.status(422).json(errorResponse("Something is error when getting data", err));
    }
}

exports.getProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.productId);
        console.log(product)
        res.status(200).json(successResponse('Show 1 product is success', product));
    } catch (err) {
        res.status(422).json(errorResponse("Something is error when getting data", err));
    }
}

exports.updateProducts = async (req, res, next) => {
    try {
        const productId = req.params.productId;

        let product = await Product.findByIdAndUpdate({ _id: productId },
            {
                $set: req.body
            },
            { new: true }
        )
        if (!req.body.name || !req.body.description || !req.body.price || !req.body.inventory) {
            return res.status(422).json(errorResponse('Please input correct field!'));
        }
        res.status(200).json(successResponse("Update product is success", product));
    } catch (err) {
        res.status(422).json(errorResponse("Something is error when updating a product", err));
    }
}

exports.deleteById = async function (req, res, next) {
    try {
        let user = await User.findOne({ products: mongoose.Types.ObjectId(req.params.productId) });
        let index = await user.products.indexOf(req.params.productId);
        user.products.splice(index, 1);
        let result = await user.save();
        res.status(200).json(successResponse("Delete an item is success", result));
    } catch (err) {
        res.status(422).json(errorResponse("Something is error when deleting an item", err));
    }
}

exports.getAllProducts = async (req, res, next) => {
    try {
        let products = await Product.find({});
        res.status(200).json(successResponse("Get all products success", products));
    } catch (err) {
        res.status(422).json(errorResponse("Something is error when deleting an item", err));
    }
}