const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    status: {
        type: String,
        required: true,
        enum: ['active', 'inactive'],
        default: active
    },
    qty: {
        type: Number,
        default: 1
    },
    totalPrice: {
        type: Number,
        default: 0
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, { collection: 'cartCollection' });


const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;