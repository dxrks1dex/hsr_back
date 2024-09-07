const mongoose = require("mongoose");

const characterSchema = mongoose.Schema({
    id: String,
    rarity: Number,
    rank: Number,
    icon: String,
    cost: Number,
    element: String,
    rankCost: [Number],
});


const CharactersModel = mongoose.model("CharactersModel", characterSchema);

module.exports = CharactersModel;