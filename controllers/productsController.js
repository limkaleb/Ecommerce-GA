const Product = require('../models/Product');
const User = require('../models/User');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary');
const { successResponse, errorResponse } = require('../helpers/response');
const { dataUri } = require('../middlewares/multer');

const redis = require("redis");
// const client = redis.createClient();
const client = require('redis').createClient(process.env.REDIS_URL);

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
            res.status(201).json(successResponse('Add product success', result));
        } else {
            res.status(403).json(errorResponse('User is not a merchant!', user));
        }
    } catch (err) {
        res.status(422).json(errorResponse('Something is error when adding a product', err));
    }
}

exports.getProducts = (req, res) => {
    // try {
    // let user = await User
    //     .findById(req.params.userId)
    //     .select(['_id', 'username', 'products'])
    //     .populate({
    //         path: 'products',
    //         select: ['_id', 'name', 'description', 'price', 'inventory']
    //     });
    return client.get(req.params.userId, (err, result) => {
        if (result) {
            console.log('FIND CACHE!!')
            const resultJSON = JSON.parse(result);
            return res.status(200).json(successResponse("Show products is success", resultJSON));
        } else {
            User
                .findById(req.params.userId)
                .select(['_id', 'username', 'products'])
                .populate({
                    path: 'products',
                    select: ['_id', 'name', 'description', 'price', 'inventory']
                })
                .then(user => {
                    const responseJSON = user;
                    client.setex(req.params.userId, 3600, JSON.stringify(responseJSON))
                    // console.log(responseJSON)
                    return res.status(200).json(successResponse("Show products is success", responseJSON));
                })
                .catch(err => {
                    res.status(422).json(errorResponse("Something is error when getting data", err));
                })
        }
    })

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
        let product = await Product.findById(req.params.productId);
        if (product.imageId) {
            await cloudinary.uploader.destroy(product.imageId);
        }
        await Product.deleteOne({ _id: req.params.productId })
        let result = await user.save();
        res.status(200).json(successResponse("Delete an item is success", result));
    } catch (err) {
        res.status(422).json(errorResponse("Something is error when deleting an item", err));
    }
}

exports.getAllProducts = async (req, res, next) => {
    let products = await Product.find({});
    res.status(200).json(successResponse("Get all products success", products));
}

/* istanbul ignore next */
exports.uploadPhotos = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.productId);
        for (const file of req.files) {
            product.images.push({
                url: file.secure_url,
                public_id: file.public_id
            });
        }
        let results = await product.save();
        res.status(200).json(successResponse("Upload multiple photos success", results));

        // if (req.file) {
        //     const file = await dataUri(req).content;
        //     let result = await cloudinary.uploader.upload(file);
        //     product.imagePath = result.secure_url;
        //     product.imageId = result.public_id;
        //     let results = await product.save();
        //     return res.status(200).json(successResponse("Upload photos success", results));
        // } else {
        //     res.status(404).json(errorResponse("Photo not found, nothing to upload!"));
        // }
    } catch (err) {
        res.status(422).json(errorResponse("Something is error while processing your request", err));
    }
}

/* istanbul ignore next */
exports.destroyPhoto = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.productId);
        if (product.imageId) {
            await cloudinary.uploader.destroy(product.imageId);
            product.imagePath = undefined;
            product.imageId = undefined;
            let results = await product.save();
            return res.status(200).json(successResponse("Destroy photos success", results));
        } else {
            return res.status(404).json(errorResponse("Photo not found, nothing to destroy!"));
        }
    } catch (err) {
        res.status(422).json(errorResponse("Something is error while processing your request", err));
    }
}