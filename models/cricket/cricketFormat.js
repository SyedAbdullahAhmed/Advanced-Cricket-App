const mongoose=require('mongoose')
const createField=require('../../common/commonFields')

const cricketFormatSchema = new mongoose.Schema({
    totalNoOfOvers: createField(Number, false, false,0),
    maxNoOfOversBowlerBowled: createField(Number, false, false,0),
    knockout: {
    },
    league: {
         stages: [mongoose.Schema.Types.Mixed]
    },
    tournamendId:createField(String,true,false,"")
})


module.exports=mongoose.model('CricketFormat',cricketFormatSchema)