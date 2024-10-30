const User = require('../schema/user-schema');
// const generateJWT = require('../utilities/generateJWT');
const bcrypt = require('bcryptjs');
const httpStatusText = require('../utilities/httpStatusText');
const jwt = require('jsonwebtoken');
const asyncWrapper = require('../utilities/asyncWrapper');
const appError = require('../utilities/appError');
require('dotenv').config();

const getAllUsers = asyncWrapper(
    async (req, res, next) => {
        const query = req.query;
        const limit = query.limit || 2;
        const page = query.page || 1;
        const skip = (page - 1) * limit;
        const users = await User.find({}, { "__v": false, "password": false })
            .limit(limit).skip(skip);
        res.status(200).json({ status: httpStatusText.SUCCES, data: { Users: users } });
    }
);

const register = asyncWrapper(
    async (req, res, next) => {
        const { name, email, phoneNo, password, role } = req.body;
        const oldUser = await User.findOne({ email: email });
        if (oldUser) {
            const err = appError.create("Email alread exsit", 400, httpStatusText.FAIL);
            return next(err);
        };
        const hashedPassword = await bcrypt.hash(password, 10);
        let newUser = new User({
            name,
            email,
            phoneNo,
            password: hashedPassword,
            role
        });
        const token = await jwt.sign({ email: newUser.email, id: newUser._id, role: newUser.role, name:newUser.name }, process.env.JWT_SECRET_KEY, { expiresIn: "10m" });
        newUser.token = token;
        await newUser.save();
        res.status(201).json({ status: httpStatusText.SUCCES, data: { User: newUser } });
    }
);

const login = asyncWrapper(
    async (req, res, next) => {
        const { email, password } = req.body;
        if (!email && password) {
            const err = appError.create("Email and Password are required", 400, httpStatusText.FAIL);
            return next(err);
        };
        const user = await User.findOne({ email: email });
        if (!user) {
            const err = appError.create("User does not exist", 400, httpStatusText.FAIL);
            return next(err);
        };
        const matchPassword = await bcrypt.compare(password, user.password);
        if (user && matchPassword) {
            const token = await jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: "10m" });
            return res.json({ status: httpStatusText.SUCCES, data: { token } });
        } else {
            const err = appError.create("Something wrong occured", 500, httpStatusText.ERROR);
            return next(err);
        };
    }
);

module.exports = { getAllUsers, register, login };