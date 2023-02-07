const express = require('express');

const { getKeys,
        updateKey
    } = require('../controllers/keys');

const Key = require('../models/ApiKey');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

const advancedResults = require('../middleware/advancedResults');

router.route('/').get(protect, authorize('admin'), advancedResults(Key), getKeys);
router.route('/:name').put(protect, authorize('admin'), updateKey);

module.exports  = router;