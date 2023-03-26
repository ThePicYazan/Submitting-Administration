const mongoose = require('mongoose');

const fetchSchema = new mongoose.Schema({
    ServerID: String,
    staffroom: String,
    applyroom: String,
    staffid: String,
    q1: String,
    q2: String,
    q3: String,
    q4: String,
    q5: String,
    title: String,
    donesend: String,
    yesmessage: String,
    nomessage: String
});

const Data = mongoose.model('Fetch', fetchSchema);

module.exports = { Data };