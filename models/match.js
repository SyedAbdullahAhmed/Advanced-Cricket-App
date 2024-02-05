const mongoose = require("mongoose");
const createField = require("../common/commonFields");

const matchSchema = new mongoose.Schema({
  date: createField(String, true, false, ""),
  venue: createField(String, true, false, ""),
  time: createField(String, true, false, ""),
  matchStatus: createField(String, false, false, "pending"),
  matchResult : createField(String, false, false, ""),
  scoreboardId: createField(String, false, false, ""),
  umpireId: [mongoose.Schema.Types.Mixed],
  teamId: [mongoose.Schema.Types.Mixed]
});

module.exports = mongoose.model("Matches", matchSchema);
