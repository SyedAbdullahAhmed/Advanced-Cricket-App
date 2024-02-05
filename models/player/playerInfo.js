const mongoose = require('mongoose');
const createField=require('../../common/commonFields')


const playerInfoSchema=new mongoose.Schema({
userId:createField(mongoose.Schema.Types.ObjectId,false,false,null),
teamId:[mongoose.Schema.Types.Mixed],
rating:createField(Number,false,false,0),
playingRole:createField(String,true,false,"")
})

module.exports=mongoose.model('PlayerInfo',playerInfoSchema)
