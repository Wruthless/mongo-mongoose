const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AwesomeModelSchema = new Schema({
    name: String,
});

module.exports = mongoose.model(
    "AwesomeModel",
    AwesomeModelSchema,
    "awesomestore"
);
