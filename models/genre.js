const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GenreInstanceSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: 100,
        minLength: 3,
    },
});

GenreInstanceSchema.virtual("url").get(function() {
    return `/catalog/genre/${this.id}`;
})

module.exports = mongoose.model("GenreInstance", GenreInstanceSchema);