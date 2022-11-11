const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SomeModelSchema = new Schema({
    a_name: String,
    a_value: Number,
});

module.exports = mongoose.model("SomeModel", SomeModelSchema, 'modelstore');
