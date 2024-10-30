const Post = require('../schema/post-schema');
const httpStatusText = require('../utilities/httpStatusText');
const appError = require('../utilities/appError');
const asyncWrapper = require('../utilities/asyncWrapper');
const validation = require('express-validator');
const { json } = require('express');
const { validationResult } = require('express-validator');

const getAllPosts = asyncWrapper(
    async (req, res, next) => {
        const query = req.query;
        const limit = query.limit || 5;
        const page = query.page || 1;
        const skip = (page - 1) * limit;
        const postes = await Post.find().limit(limit).skip(skip);
        res.json({ status: httpStatusText.SUCCES, data: { postes } });
    }
);

const getPost = asyncWrapper(
    async (req, res) => {
        const post = await Post.findById(req.params.ID);
        if (!post) {
            error = appError.create("Post not found", 404, httpStatusText.FAIL);
            return error;
        };
        return res.json({ status: httpStatusText.SUCCES, data: { Post: post } });
    }
);

const addPost = asyncWrapper(
    async (req, res, next) => {
        const err = validationResult(req);
        if (!err.isEmpty) {
            return appError.create("Post cannot be added", 404, httpStatusText.FAIL);
        };
        const newPost = new Post(req.body);
        await newPost.save();
        res.status(201).json({ status: httpStatusText.SUCCES, data: { Post: newPost } });
    }
);

const editPost = asyncWrapper(
    async (req, res) => {
        const post = await Post.findById(req.params.ID);
        if (!post) {
            const error = appError.create("Post not found", 404, httpStatusText.FAIL);
            return error;
        };
        const updatedPost = await Post.updateOne({ _id: req.params.ID }, { $set: { ...req.body } });
        return res.status(200).json({ status: httpStatusText.SUCCES, data: { post: updatedPost } });
    }
);

const deletePost = asyncWrapper(
    async (req, res) => {
        const post = Post.findById(req.params.ID);
        if (!post) {
            return appError.create("Post not found", 404, httpStatusText.FAIL);
        };
        await Post.deleteOne({ _id: req.params.ID });
        res.status(200).json({ status: httpStatusText.SUCCES, data: null });
    }
);

module.exports = { getAllPosts, getPost, addPost, editPost, deletePost };