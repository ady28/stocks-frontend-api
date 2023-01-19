const mongoose = require('mongoose');

const ApiKeySchema = new mongoose.Schema({
    name: String,
    key: String
});

module.exports = mongoose.model('Key', ApiKeySchema);