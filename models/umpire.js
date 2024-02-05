const mongoose = require("mongoose");
const createField = require("../common/commonFields");

const umpireSchema = new mongoose.Schema({
  category: createField(String, true, false, ""),
  rating: createField(String, true, false, ""),
  matchHistory: createField(String, true, false, ""),
  userId: createField(String, true, true, ""),
});

module.exports = mongoose.model("Umpire", umpireSchema);
