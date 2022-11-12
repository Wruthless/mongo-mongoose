const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AtheleteModelSchema = new Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    sport: { type: String, required: true },
    team: { type: String, required: true },
});

module.exports = mongoose.model(
    "AthleteModel",
    AtheleteModelSchema,
    "atheletestore"
);
