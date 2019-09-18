const User = require('../models/User');
const { successResponse, errorResponse } = require('../helpers/response');
const jwt = require('jsonwebtoken');

exports.postRegister = async (req, res, next) => {
    try {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email
        });
        let user = await User.register(newUser, req.body.password);
        res.status(201).json(successResponse('Add user success', user));
    } catch (err) {
        res.status(422).json(errorResponse('Something is error when adding a user', err));
    }
}

exports.postLogin = async (req, res, next) => {
    try {
        if (!req.body.username || !req.body.password) {
            return res.status(422).json(errorResponse('Please input correct username and password'));
        }
        const user = await User.authenticate()(req.body.username, req.body.password);

        if (user.error) {
            return res.status(401).json(errorResponse("Password or username is incorrect"));
        }
        const token = jwt.sign({ id: user.user.id }, process.env.SECRET_KEY, { expiresIn: '24h' });
        return res.status(200).json(successResponse("Authentication is success!", token));
    }
    catch (err) {
        res.status(422).json(errorResponse('Something is error when login', err));
    }
};

exports.updateToMerchant = async function (req, res, next) {
    try {
        const id = req.params.userId;
        let user = await User.findByIdAndUpdate({ _id: id },
            {
                $set: { isMerchant: req.body.isMerchant }
            },
            { new: true }
        )
        if (!req.body.isMerchant) {
            res.status(422).json(errorResponse('Please input isMerchant field!'));
        } else {
            res.status(200).json(successResponse("Update user become merchant success!", user));
        }
    } catch (err) {
        res.status(422).json(errorResponse("Something is error when updating user", err));
    }
}

exports.deleteById = async function (req, res, next) {
    try {
        let user = await User.findByIdAndRemove({ _id: req.params.userId })
        res.status(200).json(successResponse("Delete user is success", user));
    } catch (err) {
        res.status(422).json(errorResponse("Something is error when deleting user", err));
    }
}

exports.deleteAll = async function (req, res, next) {
    let users = await User.deleteMany({});
    res.status(200).json(successResponse("Delete all users is success", users));
}

exports.getUsers = async function (req, res, next) {
    let users = await User.find();
    res.status(200).json(successResponse('Show all users is success', users));
}

exports.getUser = async function (req, res, next) {
    try {
        let users = await User.findById({ _id: req.params.userId });
        res.status(200).json(successResponse('Show 1 user is success', users));
    } catch (err) {
        res.status(422).json(errorResponse('Something is error when getting user data', err));
    }
}