let mongoose = require('mongoose');

let dumpSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        required: true
    },
    modified: {
        type: Date,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    uid: {
        type: String,
        required: true
    }
});

let Dump = module.exports = mongoose.model('Dump', dumpSchema);