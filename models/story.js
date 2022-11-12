const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StoryModelSchema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: "AuthorModel"},
    title: String,
});

module.exports = mongoose.model(
    "StoryModel",
    StoryModelSchema,
    "storystore"
);