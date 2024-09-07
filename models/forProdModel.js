const mongoose = require("mongoose");

const forProdSchema = mongoose.Schema({
    firstPlayerNickname: {type: String, require: false},
    secondPlayerNickname: {type: String, require: false},

    firstPlayerPenaltyCircles: {type: Number, require: false},
    secondPlayerPenaltyCircles: {type: Number, require: false},

    firstPicture: {type: String, require: false},
    secondPicture: {type: String, require: false},
    thirdPicture: {type: String, require: false},

    firstCommentator: {type: String, require: false},
    secondCommentator: {type: String, require: false},

    messageTitle: {type: String, require: false},
    messageText: {type: String, require: false},
    isMessageVisible: {type: Boolean, require: false}
})

const ForProdModel = mongoose.model("forProd", forProdSchema);

module.exports = ForProdModel;