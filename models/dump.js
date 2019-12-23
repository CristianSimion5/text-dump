let mongoose = require('mongoose');

let dumpSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: false
    },
    path: {
        type: String,
        required: true
    }
});

let Dump = module.exports = mongoose.model('Dump', dumpSchema);