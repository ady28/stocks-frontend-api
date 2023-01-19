const express = require('express');

const { getStocks,
        getStock,
        getStockData,
        getDistinct,
        deleteStock,
        updateStockTicker,
        removeStockFinData
    } = require('../controllers/stocks');

const Stock = require('../models/Stock');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

const advancedResults = require('../middleware/advancedResults');

router.route('/').get(advancedResults(Stock), getStocks);
router.route('/:ticker').get(getStock).delete(protect, authorize('user','admin'), deleteStock)
router.route('/:ticker/getdata').get(getStockData)
router.route('/:field/distinct').get(getDistinct)
router.route('/:ticker/rename/:newticker').put(updateStockTicker)
router.route('/:ticker/removefindata/:type/:enddatey').put(removeStockFinData)

module.exports  = router;