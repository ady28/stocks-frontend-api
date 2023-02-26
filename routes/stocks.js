const express = require('express');

const { getStocks,
        getStock,
        getStockData,
        getDistinct,
        deleteStock,
        updateStockTicker,
        removeStockFinData,
        getHealth,
        getStockExists
    } = require('../controllers/stocks');

const Stock = require('../models/Stock');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

const advancedResults = require('../middleware/advancedResults');

router.route('/').get(advancedResults(Stock), getStocks);
router.route('/health').get(getHealth)
router.route('/:ticker').get(getStock).delete(protect, authorize('admin'), deleteStock)
router.route('/:ticker/getdata').get(protect, getStockData)
router.route('/:field/distinct').get(getDistinct)
router.route('/:ticker/rename/:newticker').put(protect, authorize('admin'), updateStockTicker)
router.route('/:ticker/removefindata/:type/:enddatey').put(protect, authorize('admin'), removeStockFinData)
router.route('/:ticker/exists').get(getStockExists)

module.exports  = router;