const mongoose=require('mongoose')
const createField = require('../../common/commonFields')

const playerBowlingSchema=new mongoose.Schema({
    playerId:createField(mongoose.Schema.ObjectId,true,false,""),
    innings:createField(Number,false,false,0),
    overs:createField(Number,false,false,0),
    wickets:createField(Number,false,false,0),
    wides:createField(Number,false,false,0),
    noBalls:createField(Number,false,false,0),
    dotBalls:createField(Number,false,false,0),
    runs:createField(Number,false,false,0),
    maiden:createField(Number,false,false,0),
    average:createField(Number,false,false,0),
    economy:createField(Number,false,false,0),
    threeWicketsHauls:createField(Number,false,false,0),
    fiveWicketsHauls:createField(Number,false,false,0),
    bestFigures:createField(String,false,false,"0/0")
})

module.exports=mongoose.model('PlayerBowling',playerBowlingSchema)