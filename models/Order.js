const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    carts: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        qty: {
            type: Number,
            min: 1
        }
    }],
    orderPrice: {
        type: Number
    },
    isComplete: {
        type: Boolean,
        default: false
    },
    timestamp: { type: Date, default: Date.now },
    orderExpires: Date

}, { collection: 'orderCollection' });

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;