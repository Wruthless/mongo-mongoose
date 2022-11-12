const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AuthorModelSchema = new Schema({
    name: String,
    stories: [{
        type: Schema.Types.ObjectId, ref: "StoryModel"
    }],
});

module.exports = mongoose.model(
    "AuthorModel",
    AuthorModelSchema,
    "authorstore"
);