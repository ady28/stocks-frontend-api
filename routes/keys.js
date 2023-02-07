const express = require('express');

const { getKeys,
        updateKey
    } = require('../controllers/keys');

const Key = require('../models/ApiKey');

const router = express.Router();

const { protect } = require('../middleware/auth');

const advancedResults = require('../middleware/advancedResults');

router.route('/').get(protect, advancedResults(Key), getKeys);
router.route('/:name').put(protect, updateKey);

module.exports  = router;