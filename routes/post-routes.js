const express = require('express');
const { body } = require('express-validator');
const verifiyToken = require('../utilities/verifiyToken');
const postController = require('../controllers/post-controller');
const router = express.Router();
router.use(express.json());
// const userRoles = require('../utilities/user-roles');

router.route('/').get(postController.getAllPosts);

router.route('/:ID')
    .get(postController.getPost)
    .patch(postController.editPost)
    .delete(postController.deletePost);

// const {...decodedToken}=require('../utilities/verifiyToken')

router.route('/addPost').post((verifiyToken),
    [body('title')
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 2 })
        .withMessage("At least 2 digits")
    ], [body('content')
        .notEmpty()
    ],
    [body('author')
        .notEmpty()
        // .name(decodedToken.name)
    ],
    postController.addPost);

module.exports = router;