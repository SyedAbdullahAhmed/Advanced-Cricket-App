const mongoose = require("mongoose");
const createField = require("../../common/commonFields");

const footballInformationSchema = new mongoose.Schema({
  goals: createField(Number, true, false, 0),
  mostGoals: createField(Number, true, false, 0),
  teamId:createField(String,true,true,"")
});

module.exports = mongoose.model('FootballInformation',footballInformationSchema);
