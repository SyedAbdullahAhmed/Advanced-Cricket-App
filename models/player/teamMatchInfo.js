const mongoose = require('mongoose')
const createField=require('../../common/commonFields')

const teamMatchSchema = new mongoose.Schema({
     userId : createField(mongoose.Schema.ObjectId,false,true,null),
     createdTeam : [String],
     createdMatch : [String],
     matchHistory: {
          type: [mongoose.Schema.Types.Mixed],
          default: [],
        },
     
})
module.exports=mongoose.model('teamMatchInfo',teamMatchSchema)

