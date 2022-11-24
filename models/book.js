const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    // Related document
    author:{
        type: Schema.Types.ObjectId,
        ref: "Author"
    },
    summary:{
        type: String,
        required: true
    },
    isbn:{
        type: String,
        required: true
    },
    // Related document
    genre:[{
        type: Schema.Types.ObjectId,
        ref: "Genre"
    }],
});

BookSchema.virtual("url").get(function() {
    return `/catalog/books/${this._id}`;
});

module.exports = mongoose.model("Book", BookSchema);