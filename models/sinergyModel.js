const mongoose = require("mongoose");

const SynergySchema = mongoose.Schema({
    url: { type: String, required: true },
    name: { type: String, required: true },
    cost: { type: Number, required: true },
});

const SynergyModel = mongoose.model("Synergy", SynergySchema);

module.exports = SynergyModel;
