const mongoose = require('mongoose');

/**
 * New contents schema
 */
const newContents = mongoose.Schema(
    {
        category: {type: String},
        section: {type: String},
        title: {type: String},
        date: {type: Date},             /* only movies/tv */
        language: {type: String},       /* only movies/tv */
        department: {type: String},     /* only actors */
        vote: {type: Number},           /* vote for movies/tv, popularity for actors */
        img: {data: Buffer, contentType: String},
        _userId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    }, {
        versionKey: false
    });

module.exports = mongoose.model('NewContents', newContents, 'newContents');
