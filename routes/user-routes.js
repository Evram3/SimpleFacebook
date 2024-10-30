const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
// const verifiyToken = require('../utilities/verifiyToken');
router.use(express.json());

router.route('/')
    .get( userController.getAllUsers)
    
router.route('/register')
    .post(userController.register)

router.route('/login')
    .post(userController.login);

module.exports = router;