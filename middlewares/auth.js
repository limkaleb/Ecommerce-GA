const jwt = require('jsonwebtoken');
const { errorResponse } = require('../helpers/response');

exports.isAuthenticated = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers.authorization;
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
            if (err) { // apa bila ada error
                res.status(422).json(errorResponse({ message: 'Failed to authenticate token' }));
            } else { // apa bila tidak error
                req.decoded = decoded; // menyimpan decoded ke req.decoded
                next();
            }
        });
    } else {
        return res.status(403).json(errorResponse({ message: 'No token provided.' }));
    }
}