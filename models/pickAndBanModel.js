const mongoose = require("mongoose");

const lightConeSchema = mongoose.Schema({
    id: String,
    name: String,
    secondName: String,
    rarity: Number,
    cost: Number,
    icon: String,
    rank: Number,
    rankCost: [Number]
}, { _id: false })

const characterSchema = mongoose.Schema({
    id: String,
    level: Number,
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

const SynergySchema = mongoose.Schema({
    url: { type: String, required: true },
    name: { type: String, required: true },
    cost: { type: Number, required: true },
});

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
        nickname: String,
        synergy: {
            required: false,
            type: [SynergySchema]
        }
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
        nickname: String,
        synergy: {
            required: false,
            type: [SynergySchema]
        }
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
