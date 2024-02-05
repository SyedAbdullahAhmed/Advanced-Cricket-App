const mongoose = require("mongoose");
const createField = require("../../common/commonFields");

const playerBattingSchema = new mongoose.Schema({
  
  totalRuns: createField(Number, false, false, 0),
  thirties: createField(Number, false, false, 0),
  fifties: createField(Number, false, false, 0),
  centuries: createField(Number, false, false, 0),
  fours: createField(Number, false, false, 0),
  sixes: createField(Number, false, false, 0),
  strikeRate: createField(Number, false, false, 0),
  average: createField(Number, false, false, 0),
  ducks: createField(Number, false, false, 0),
  highestScore: createField(Number, false, false, 0),
  playerId: createField(mongoose.Schema.ObjectId, true, false, ""),
  innings: createField(Number, false, false, 0),
  noOfMatches: createField(Number, false, false, 0),
  noOfDismissals : createField(Number, false, false, 0)
});

module.exports = mongoose.model("PlayerBatting", playerBattingSchema);
