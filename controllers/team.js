const teamServices = require('../services/team')
const teamRepos = require('../repositories/team')
const teamRepo = require('../repositories/team')

module.exports.createTeam = async (req, res) => {
     try {
          const payLoad = {
               name: req.body.name,
               abbreviation: req.body.abbreviation,
               captain: req.body.captain,
               description: req.body.description,
               sports: req.body.sports,
               image : req.body.image
          }

          // find captain
          const userId = req.user.id
          // const captain = await teamServices.findCaptain(id)
          // if(!captain) return res.status(400).json({ response: false, message : 'Only captain allowed to create team!' })

          // const teamExist = await teamRepos.findOneByName(payLoad.name)
          // if (teamExist) return res.status(400).json({ response: false, message: "Team already exist!" })

          const createdTeam = await teamServices.createTeam(userId,payLoad)
          res.status(200).json({ response: true, createdTeam })
     }
     catch (error) {
          console.log(error);
          res.status(400).json({ response: false, message: error.message });
     }
}

module.exports.getTeams = async (req, res) => {
     try {
          const findTeams = await teamRepos.findAll()
          if (!findTeams) return res.status(200).json({ response: true, message : 'Not found' })
          res.status(200).json({ response: true, findTeams })
     }
     catch (error) {
          console.log(error);
          res.status(400).json({ response: false, message: error.message });
     }
}

module.exports.getTeamByID = async (req, res) => {
     try {
          const findTeam = await teamRepos.findOneByID(req.params.id)
          if (!findTeam) return res.status(200).json({ response: true, message : 'Not found' })
          res.status(200).json({ response: true, findTeam })
     }
     catch (error) {
          console.log(error);
          res.status(400).json({ response: false, message: error.message });
     }
}

module.exports.updateTeamByID = async (req, res) => {
     try {
          const id = req.params.id
          const payLoad = {
               name: req.body.name,
               abbreviation: req.body.abbreviation,
               logo: req.body.logo,
               captain: req.body.captain,
               description: req.body.description,
               sports: req.body.sports
          }

          const updatedTeam = await teamServices.updateTeamByID(id, payLoad)
          if (!updatedTeam) return res.status(400).json({ response: true, message:'Updation failed'})
          res.status(200).json({ response: true, updatedTeam })
     }
     catch (error) {
          console.log(error);
          res.status(400).json({ response: false, message: error.message });
     }
}

module.exports.deleteTeamByID = async (req, res) => {
     try {
          const id = req.params.id
          const deletedTeam = await teamRepos.deleteTeamByID(id)

          if (!deletedTeam) return res.status(400).json({ response: true, message: 'Deletion failed!' })
          res.status(200).json({ response: true, message: 'Team deleted successfully!' })
     }
     catch (error) {
          console.log(error);
          res.status(400).json({ response: false, message: error.message });
     }
}

// module.exports.updateTeamScoreById = async (req, res) => {
//      try {
//           const id = req.params.id
//           const payLoad = {
//                highestTeamScore: req.body.highestTeamScore,
//                lowestTeamScore: req.body.lowestTeamScore
//           }

//           const updatedTeamScore = await teamServices.updateTeamScoreById(id, payLoad)
//           if(!updatedTeamScore) return res.status(200).json({ response: false, message : 'Update failed' })
//           res.status(200).json({ response: true, updatedTeamScore })
//      }
//      catch (error) {
//           console.log(error);
//           res.status(400).json({ response: false, message: error.message });
//      }
// }

// module.exports.updateTeamStatisticsById = async (req, res) => {
//      try {
//           const id = req.params.id
//           const payLoad = {
//                totalMatchesPlayed : req.body.totalMatchesPlayed,
//                totalWins : req.body.totalWins,
//                totalLosses : req.body.totalLosses,
//                totalDraws : req.body.totalDraws,
//                winningPercentage : req.body.winningPercentage
//           }

//           const updatedTeamStatistics = await teamServices.updateTeamStatisticsById(id, payLoad)
//           if(!updatedTeamStatistics) return res.status(200).json({ response: false, message : 'NUpdate failed' })
//           res.status(200).json({ response: true, updatedTeamStatistics })
          
//      }
//      catch (error) {
//           console.log(error);
//           res.status(400).json({ response: false, message: error.message });
//      }
// }


module.exports.updateTeamScoreAndStatsById = async(req,res) => {
     try {
          const payLoad = req.body;
          const userId = req.user.id;
          const teamId = req.params.teamId

          const keys = Object.keys(payLoad);
          let updated = {};
          console.log(payLoad)
      
          const umpire = await teamRepo.findPlayer(userId);
          if (!umpire)
            return res
              .status(401)
              .json({ response: false, message: "player does not exists" });

          if (umpire.role.toLowerCase() !== 'umpire')
            return res
              .status(401)
              .json({ response: false, message: "only umpire allowed to update stats" });

          const team = await teamRepo.findTeam(teamId)
          if(!team) return res.status(400).json({response : false , message : 'Team does not found'})
      
          if (!(Object.keys(payLoad).length > 0))
            return res
              .status(400)
              .json({ response: false, message: "sent payload was empty" });
      
          keys.forEach(async (element) => {
            switch (element) {
              case "teamScores":
                updated.teamScores = await teamServices.updateTeamScoresById(
                  teamId,
                  payLoad.teamScores
                );
                console.log(`teamScores:${updated.teamScores}`);
                break;
              case "teamStatistics":
                updated.teamStatistics = await teamServices.updateTeamStatisticsById(
                  teamId,
                  payLoad.teamStatistics
                );
                console.log(`teamStatistics:${updated.teamStatistics}`);
                break;
            }
          });
          if (!updated)
            return res
              .status(400)
              .json({ response: false, message: "unable to update" });
          console.log(`updated: ${updated}`);
          return res
            .status(200)
            .json({ response: true, message: "Player Updated Sucessfully" });
        } catch (error) {
          res.status(400).json({ response: false, message: error.message });
        }
}

module.exports.addPlayerInTeam = async(req,res) => {
     try{
          const playerId = req.params.playerId
          const teamId = req.params.teamId

          const addPlayer = await teamServices.addPlayerInTeam(playerId,teamId)
          if(!addPlayer) return res.status(200).json({ response: false, message: "Player added failed" })
          res.status(200).json({ response: true, addPlayer })
     }
     catch(error) {
          console.log(error);
          res.status(400).json({ response: false, message: error.message });
     }
}

module.exports.removePlayerInTeam = async(req,res) => {
     try{
          const playerId = req.params.playerId
          const teamId = req.params.teamId

          const removePlayer = await teamServices.removePlayerInTeam(playerId,teamId)
          if(!removePlayer) return res.status(200).json({ response: false, message: "Player removed failed" })
          return res.status(200).json({ response: true,  message: "Player remove from team sucessfully" })
     }
     catch(error) {
          console.log(error);
          res.status(400).json({ response: false, message: error.message });
     }
}

module.exports.getTeamPlayerData = async(req,res) => {
     try{
          const teamId = req.params.id
          const teamPlayersData = await teamServices.getTeamPlayerData(teamId)
          if(!teamPlayersData) return res.status(400).json({response : false,message : "Data not found"})
          res.status(200).json({response : true,teamPlayersData})
     }
     catch(error){
          console.log(error)
          res.status(400).json({response : false , message : error.message})
     }
}

module.exports.teamInvitationToPlayers = async(req,res) => {
     try{
          const teamId = req.params.teamId
          const userId = req.user.id
          const payLoad = req.body
          console.log(payLoad)

          const teamInvitationToPlayers = await teamServices.teamInvitationToPlayers(teamId,payLoad,userId)
          if(!teamInvitationToPlayers) return res.status(400).json({response : false , message : 'Invitation failed'})
          res.status(200).json({response : true , message : 'Send invitation Successful'})
     }
     catch(error) {
          console.log(error)
          res.status(400).json({message : true,message : error.message})
     }
}

module.exports.teamInvitationsToTeamsForMatch = async(req,res) => {
     try{
          const userId = req.user.id
          const homeTeamId = req.params.homeTeamId
          const opponentTeamId = req.params.opponentTeamId
          const matchId = req.params.matchId

          const teamInvitationToTeams = await teamServices.teamInvitationToTeamsForMatch(userId,homeTeamId,opponentTeamId,matchId)
          if(!teamInvitationToTeams) return res.status(400).json({response : false , message : 'Invitation Declined'})
          res.status(200).json({response : true , message : 'Send Invitation Successful'})
          
     }
     catch(error) {
          console.log(error)
          res.status(400).json({message : true,message : error.message})
     }
}

module.exports.getAllMatchInvitations = async(req,res) => {
     try{
          const teamId = req.params.teamId
          const invitations = await teamServices.getAllMatchInvitations(teamId)
          if(!invitations) return res.status(400).json({response : false , message : 'No Invitations found'})
          res.status(200).json({response : true , invitations})
     }
     catch(error) {
          console.log(error)
          res.status(400).json({message : true,message : error.message})
     }
}

module.exports.declineMatchInvitations = async(req,res) => {
     try{
          const teamId = req.params.id
          const invitedTeam = req.params.teamId
          
          const declineInvitation = await teamServices.declineInvitation(teamId,invitedTeam)
          if(!declineInvitation) return res.status(400).json({response : false , message : 'Invitation declined failed'})
          res.status(200).json({response : true , message : 'Invitation declined sucessful'})
     }
     catch(error) {

     }
}

module.exports.teamInvitationToUmpires = async(req,res) => {
     try{
          const teamId = req.params.teamId
          const umpireId = req.params.umpireId
          const userId = req.user.id

          const teamInvitationToUmpires = await teamServices.teamInvitationToUmpires(teamId,umpireId,userId)
          if(!teamInvitationToUmpires) return res.status(400).json({response : false , message : 'Invitation failed'})
          res.status(200).json({response : true , message : 'Send invitation Successful'})
     }
     catch(error) {
          console.log(error)
          res.status(400).json({message : true,message : error.message})
     }
}

module.exports.addUmpireInMatch = async(req,res) => {
     try{
          const umpireId = req.params.umpireId
          const teamId = req.params.teamId
          const matchId = req.params.matchId

          const addUmpire = await teamServices.addUmpireInMatch(umpireId,teamId,matchId)
          if(!addUmpire) return res.status(200).json({ response: false, message: "umpire added failed" })
          res.status(200).json({ response: true, message : 'umpire added sucessfully' })
     }
     catch(error) {
          console.log(error);
          res.status(400).json({ response: false, message: error.message });
     }
}

module.exports.getTeamMatchHistory = async(req,res) => {
     try{
          const teamId = req.params.teamId
          const history = await teamServices.getTeamMatchHistory(teamId)
          if(!history) return res.status(200).json({ response: false, message : 'not found' })
          res.status(200).json({ response: true, history})
     }
     catch(error) {
          console.log(error);
          res.status(400).json({ response: false, message: error.message });
     }
}