const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        default: 1
    },
    orderPrice: {
        type: Number,
        default: 0
    }
}, { collection: 'orderCollection' });


const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;