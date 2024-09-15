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
        uid: String | null,
        nickname: String
    },
    secondPlayer: {
        characters: [characterSchema],
        picked: [characterSchema],
        banned: [characterSchema],
        firstCircleCount: Number,
        secondCircleCount: Number,
        deathCount: Number,
        stage: "pick" | "ban" | null,
        uid: String | null,
        nickname: String
    },
    thirdPlayer: {
        characters: [characterSchema],
        picked: [characterSchema],
        banned: [characterSchema],
        firstCircleCount: Number,
        secondCircleCount: Number,
        deathCount: Number,
        stage: "pick" | "ban" | null,
        uid: String | null,
        nickname: String
    },
    fourthPlayer: {
        characters: [characterSchema],
        picked: [characterSchema],
        banned: [characterSchema],
        firstCircleCount: Number,
        secondCircleCount: Number,
        deathCount: Number,
        stage: "pick" | "ban" | null,
        uid: String | null,
        nickname: String
    }
});

const PickAndBanModel = mongoose.model("PickAndBanModel", pickAndBanSchema);

module.exports = PickAndBanModel;
