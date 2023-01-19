const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Key = require('../models/ApiKey');

//Accepted key names
const keyNames = ['alpha','yahoo'];

// @desc      Get keys
// @route     GET /api/v1/keys
// @access    Public
exports.getKeys = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

exports.updateKey = asyncHandler(async (req, res, next) => {
  if(keyNames.includes(req.params.name)){
    let key = await Key.findOne({name: req.params.name});
    if (!key) {
      key = await Key.create({name: req.params.name,key: req.body.key});
      res.status(200).json({ success: true, data: 'Key created' });
    } else {
      key = await Key.findOneAndUpdate({name: req.params.name}, {key: req.body.key});
      res.status(200).json({ success: true, data: 'Key updated' });
    }
  } else {
    return next(
      new ErrorResponse(`Key named ${req.params.name} not found in approved key list`, 404)
    );
  }
  
});