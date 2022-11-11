const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BreakfastModelSchema = new Schema({
    eggs: {
        type: Number,
        min: [6, "Too few eggs"],
        max: 12,
        required: [true, "Why no eggs?"],
    },
    drink: {
        type: String,
        enum: ["Coffee", "Tea", "Water"],
    },
});

BreakfastModelSchema.virtual("fullbreakfast").get(function () {
    return `Full breakfast: ${this.eggs} eggs and a glass of ${this.drink}`;
});

module.exports = mongoose.model(
    "BreakfastModel",
    BreakfastModelSchema,
    "breakfaststore"
);
