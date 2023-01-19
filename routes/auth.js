const express = require('express');

const { login, getMe, logOut
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/login',login);
router.get('/me', protect, getMe);
router.get('/logout', protect, logOut)

module.exports  = router;