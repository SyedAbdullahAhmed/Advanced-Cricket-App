const mongoose=require('mongoose')
const createField=require('../../common/commonFields')

const playerFieldingSchema=new mongoose.Schema({
playerId:createField(mongoose.Schema.ObjectId,true,false,""),
catches:createField(Number,false,false,0),
runOut:createField(Number,false,false,0),
stumping:createField(Number,false,false,0)
})

module.exports=mongoose.model('PlayerFielding',playerFieldingSchema)