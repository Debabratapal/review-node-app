const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let commentSchema = Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    author: {
        type: String,
    },
    review: {
        type: Number,
        default: 0,
        require: true
    },
    comment: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('Comment', commentSchema)