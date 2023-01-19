const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
    name: String,
    ticker: String,
    industry: String,
    sector: String,
    cashflowhq: [{
        enddatey: String
    }],
    cashflowh: [{
        enddatey: String
    }],
    incomeh: [{
        enddatey: String
    }],
    incomehq: [{
        enddatey: String
    }],
    balanceh: [{
        enddatey: String
    }],
    balancehq: [{
        enddatey: String
    }]
});

module.exports = mongoose.model('Stock', StockSchema);