const mongoose = require("mongoose");

const lightConeSchema = mongoose.Schema({
    id: String,
    name: String,
    rarity: Number,
    cost: Number,
    icon: String,
    rankCost: [Number],
    rank: Number
})

const LightConeModel = mongoose.model("LightConeModelModel", lightConeSchema);

module.exports = LightConeModel;