

const mongoose=require('mongoose')
const createField=require('../common/commonFields')

const tournamentSchema = new mongoose.Schema({
    tournamentDetails: {
         _id: createField(String, true, false,""),
         status: createField(String, true, false,""),
         name: createField(String, true, false,""),
         time: createField(String, true, false,""),
         venue: createField(String, true, false,""),
         startingDate: createField(String, true, false,""),
         prizeMoney: createField(Number, false, false,0),
         noOfPlayersRequiredInATeam: createField(Number, true, false,0),
         noOfTeams: createField(Number, true, false,0),
         recursive: createField(String, true, false,"")
    },
    matchHistory: [mongoose.Schema.Types.Mixed] //should be an array of matchIds
})

module.exports=mongoose.model('Tournament',tournamentSchema)