const mongoose=require('mongoose')
const createField=require('../../common/commonFields')

const teamInvitations = new mongoose.Schema({
    teamId : createField(mongoose.Schema.ObjectId, true, false,null),
    invitedPlayers: [mongoose.Schema.Types.Mixed],
    invitedTeams: [{
        matchId: createField(mongoose.Schema.ObjectId, true, false,null),
        opponentTeamId: createField(mongoose.Schema.ObjectId, true, false,null)
    }],
    invitedUmpires: [mongoose.Schema.Types.Mixed],
})

module.exports=mongoose.model('TeamInvitations',teamInvitations)
