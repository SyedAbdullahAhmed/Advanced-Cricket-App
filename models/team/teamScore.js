const mongoose = require("mongoose");
const createField = require("../../common/commonFields");

const teamScoreSchema = new mongoose.Schema({
  highestTeamScore: createField(Number, true, false, 0),
  lowestTeamScore: createField(Number, true, false, 0),
  teamId:createField(mongoose.Schema.ObjectId,true,true,"")
});

module.exports = mongoose.model("TeamScore", teamScoreSchema);
