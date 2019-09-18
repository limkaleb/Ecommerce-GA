const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    imagePath: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    inventory: {
        type: Number,
        default: 0
    }
}, { collection: 'productCollection' });

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;