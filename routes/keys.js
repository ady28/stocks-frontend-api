const express = require('express');

const { getKeys,
        updateKey
    } = require('../controllers/keys');

const Key = require('../models/ApiKey');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');

router.route('/').get(advancedResults(Key), getKeys);
router.route('/:name').put(updateKey);

module.exports  = router;