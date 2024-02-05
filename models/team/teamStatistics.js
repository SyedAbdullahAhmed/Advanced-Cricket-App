const mongoose=require('mongoose')
const createField=require('../../common/commonFields')

const teamStatisticsSchema = new mongoose.Schema({
    totalMatchesPlayed: createField(Number, false, false,0),
    totalWins: createField(Number, false, false,0),
    totalLosses: createField(Number, false, false,0),
    totalDraws: createField(Number, false, false,0),
    winningPercentage: createField(Number, false, false,0),
    teamId:createField(mongoose.Schema.ObjectId,true,true,"")
})

module.exports=mongoose.model('TeamStatistics',teamStatisticsSchema)