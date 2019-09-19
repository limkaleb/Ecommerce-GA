const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    profilePicturePath: {
        type: String
    },
    profilePictureId: {
        type: String
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String, lowercase: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'], index: true, required: true
    },
    password: {
        type: String
    },
    isMerchant: {
        type: Boolean,
        default: false
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    orders: [{
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }]
}, { collection: 'userCollection' });

UserSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", UserSchema);

module.exports = User;