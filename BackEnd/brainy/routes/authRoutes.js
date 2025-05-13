const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const protectRoute = require('../middleware/authMiddleware')
const {
    registerUser,
    loginUser, 
    getUserById, 
} = require('../controllers/userController');

router.post('/reg', asyncHandler(registerUser)); //done
router.post('/login', asyncHandler(loginUser)); //done
router.get('/:userId', protectRoute, asyncHandler(getUserById)); //done

module.exports = router
