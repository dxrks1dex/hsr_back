const mongoose = require("mongoose");

const lightConeSchema = mongoose.Schema({
    id: String,
    name: String,
    rarity: Number,
    cost: Number,
    icon: String,
    rank: Number,
    rankCost: [Number]
}, { _id: false })

const characterSchema = mongoose.Schema({
    id: String,
    rarity: Number,
    rank: Number,
    element: String,
    icon: String,
    cost: Number,
    rankCost: [Number],
    lightCone: {
        type: lightConeSchema,
        required: false
    }
}, { _id: false });

const pickAndBanSchema = mongoose.Schema({
    firstPlayer: {
        characters: [characterSchema],
        picked: [characterSchema],
        banned: [characterSchema],
        firstCircleCount: Number,
        secondCircleCount: Number,
        deathCount: Number,
        stage: "pick" | "ban" | null,
        uid: String | null
    },
    secondPlayer: {
        characters: [characterSchema],
        picked: [characterSchema],
        banned: [characterSchema],
        firstCircleCount: Number,
        secondCircleCount: Number,
        deathCount: Number,
        stage: "pick" | "ban" | null,
        uid: String | null
    },
    thirdPlayer: {
        characters: [characterSchema],
        picked: [characterSchema],
        banned: [characterSchema],
        firstCircleCount: Number,
        secondCircleCount: Number,
        deathCount: Number,
        stage: "pick" | "ban" | null,
        uid: String | null
    },
    fourthPlayer: {
        characters: [characterSchema],
        picked: [characterSchema],
        banned: [characterSchema],
        firstCircleCount: Number,
        secondCircleCount: Number,
        deathCount: Number,
        stage: "pick" | "ban" | null,
        uid: String | null
    }
});

const PickAndBanModel = mongoose.model("PickAndBanModel", pickAndBanSchema);

module.exports = PickAndBanModel;
