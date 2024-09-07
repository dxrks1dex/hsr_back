const mongoose = require("mongoose");

const lightConeSchema = mongoose.Schema({
    id: String,
    name: String,
    rarity: Number,
    cost: Number,
    icon: String,
    rank: Number,
    rankCost: [Number]
})

const characterSchema = mongoose.Schema({
    id: String,
    rarity: Number,
    rank: Number,
    element: String,
    icon: String,
    cost: Number,
    rankCost: [Number],
});

const playerSchema = mongoose.Schema({
    uid: String,
    nickname: String,
    avatar: {
        id: String,
        name: String,
        icon: String,
    },
    characters: [characterSchema],
    lightCones: [lightConeSchema]
});

const UserModel = mongoose.model("UserModel", playerSchema);

module.exports = UserModel;
