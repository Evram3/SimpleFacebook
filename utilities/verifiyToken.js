const jwt = require('jsonwebtoken');
const appError = require("./appError");
const httpStatusText = require('./httpStatusText');

const verifiyToken = (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    if (!authHeader) {
        const err = appError.create("Token is required", 401, httpStatusText.FAIL);
        return next(err);
    };
    const token = authHeader.split(' ')[1];
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.currentUser = decodedToken;
        next();
    } catch (err) {
        const error = appError.create("Invalid Token", 401, httpStatusText.ERROR);
        return next(error);
    }
};
module.exports = verifiyToken;