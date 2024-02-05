const mongoose = require('mongoose')
const createField=require('../../common/commonFields')

const teamInformationSchema = new mongoose.Schema({
    name: createField(String, true, true,""),
    abbreviation: createField(String, false, false,""),
    image: createField(String, false, false,""),
    captain: createField(String, false, false,""),
    description: createField(String, false, false,""),
    achievements: [String],
    sports : createField(String, true, false,""),
    players: [mongoose.Schema.Types.Mixed],
    matchHistory: [mongoose.Schema.Types.Mixed]
})

module.exports=mongoose.model('TeamInformation',teamInformationSchema)