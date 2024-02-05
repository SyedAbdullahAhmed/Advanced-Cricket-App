const mongoose = require("mongoose");
const createField=require('../../common/commonFields')

const playerStatisticsSchema = new mongoose.Schema({
  totalInnings: createField(Number, false, false, 0),
  totalMatches: createField(Number, false, false, 0),
  won: createField(Number, false, false, 0),
  loose: createField(Number, false, false, 0),
  draws: createField(Number, false, false, 0),
  playerId:createField(mongoose.Schema.ObjectId,true,false,""),
});

module.exports = mongoose.model("PlayerStatistics", playerStatisticsSchema);
