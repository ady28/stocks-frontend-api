const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Stock = require('../models/Stock');
const axios = require('axios');

// @desc      Get stocks
// @route     GET /api/v1/stocks
// @access    Public
exports.getStocks = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc      Get stock
// @route     GET /api/v1/stocks/:ticker
// @access    Public
exports.getStock = asyncHandler(async (req, res, next) => {
    const stock = await Stock.findOne({"ticker" : req.params.ticker});

    if (!stock) {
        return next(new ErrorResponse('Stock not found', 404));
    }

    res.status(200).json({
        success: true,
        data: stock
    });
});

// @desc      Get a distinct field
// @route     GET /api/v1/stocks/:field/distinct
// @access    Public
exports.getDistinct = asyncHandler(async (req, res, next) => {
    const stock = await Stock.distinct(req.params.field);

    if (!stock) {
        return next(new ErrorResponse('Could not get distinct data', 404));
    }

    res.status(200).json({
        success: true,
        data: stock
    });
});

// @desc      Get stock data
// @route     GET /api/v1/stocks/:ticker/getdata
// @access    Public
exports.getStockData = asyncHandler(async (req, res, next) => {

    const url = `http://${process.env.STOCKSAPISERVER}:${process.env.STOCKSAPISERVERPORT}/v1/import/${req.params.ticker}`

    const resp = await axios.get(url)

    if (!resp.data) {
        return next(new ErrorResponse('Stock add/update API not working', 404));
    }

    res.status(200).json({
        success: resp.data.status,
        data: resp.data.message
    });
});

// @desc      Delete stock
// @route     DELETE /api/v1/stocks/:ticker
// @access    Private
exports.deleteStock = asyncHandler(async (req, res, next) => {
    const stock = await Stock.findOne({"ticker":req.params.ticker});
  
    if (!stock) {
      return next(
        new ErrorResponse("Stock not found", 404)
      );
    }
  
    await stock.remove();
  
    res.status(200).json({
      success: true,
      data: {}
    });
  });

// @desc      Update stock ticker
// @route     PUT /api/v1/stocks/:ticker/rename/:newticker
// @access    Private
exports.updateStockTicker = asyncHandler(async (req, res, next) => {
    let stock = await Stock.findOne({"ticker":req.params.ticker});
  
    if (!stock) {
      return next(
        new ErrorResponse("Stock not found", 404)
      );
    }

    stock = await Stock.findByIdAndUpdate(stock._id, {"ticker":req.params.newticker}, {
      new: true,
      runValidators: true
    });
  
    stock.save();
  
    res.status(200).json({
      success: true,
      data: "Stock updated"
    });
  });

// @desc      Remove financial data
// @route     PUT /api/v1/stocks/:ticker/removefindata/:type/:enddatey
// @access    Private
exports.removeStockFinData = asyncHandler(async (req, res, next) => {
  let stock = await Stock.findOne({"ticker":req.params.ticker});

  if (!stock) {
    return next(
      new ErrorResponse("Stock not found", 404)
    );
  }

  await Stock.updateOne({"ticker" : req.params.ticker}, {$pull: {[req.params.type] :{"enddatey" : req.params.enddatey}}},
  {'new': true});

  res.status(200).json({
    success: true,
    data: "Stock updated"
  });
});

// @desc      Get health
// @route     GET /api/v1/stocks/health
// @access    Public
exports.getHealth = asyncHandler(async (req, res, next) => {
  res.status(200).json({
      success: true,
      data: "OK"
  });
});