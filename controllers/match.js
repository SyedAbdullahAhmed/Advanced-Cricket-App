const matchServices = require('../services/match')
const matchRepos = require('../repositories/match')

module.exports.createMatch = async (req, res) => {
     try {
          const payLoad = {
               date: req.body.date,
               venue: req.body.venue,
               time: req.body.time
          }

          // find captain
          const userId = req.user.id
          const teamId = req.params.id
          // const captain = await matchServices.findCaptain(id)
          // if(!captain) return res.status(400).json({ response: false, message : 'Only captain allowed to create match!' })

          const createdMatch = await matchServices.createMatch(userId,teamId,payLoad)

          if(!createdMatch) return res.status(400).json({ response: false, message : 'Match creation failed!' })
          res.status(200).json({ response: true, createdMatch })
     }
     catch (error) {
          console.log(error);
          res.status(400).json({ response: false, message: error.message });
     }
}
module.exports.getAllMatches = async (req, res) => {
     try {
          const findAllMatches = await matchRepos.getAllMatches()
          if(findAllMatches) return res.status(200).json({ response: true, findAllMatches })
     }
     catch (error) {
          console.log(error);
          res.status(400).json({ response: false, message: error.message });
     }
}
module.exports.getMatchByID = async (req, res) => {
     try {
          const id = req.params.id
          const findMatch = await matchRepos.getMatchByID(id)

          if(!findMatch) return res.status(200).json({ response: false, message : 'Match not found' })
          res.status(200).json({ response: true, findMatch })
     }
     catch (error) {
          console.log(error);
          res.status(400).json({ response: false, message: error.message });
     }
}
module.exports.updateMatchInfoByID = async (req, res) => {
     try {
          const id = req.params.id
          const payLoad  = {
               date: req.body.date ,
               venue: req.body.venue ,
               time: req.body.time ,
               matchStatus: req.body.matchStatus ,
               scoreboardId: req.body.scoreboardId ,
               umpireId: req.body.umpireId 
          }

          const updatedMatch = await matchServices.updateMatchInfoByID(id,payLoad)

          if(!updatedMatch) return res.status(200).json({ response: false, message : 'Updation failed' })
          res.status(200).json({ response: true, updatedMatch })
     }
     catch (error) {
          console.log(error);
          res.status(400).json({ response: false, message: error.message });
     }
}

module.exports.addTeamInMatchByID = async(req,res) =>{
     try{
          const {matchId,teamId} = req.params
          const addedTeam  = await matchServices.addTeamInMatchByID(matchId,teamId)

          if(!addedTeam) return res.status(200).json({ response: false, message: "Team added failed in match data" })
          res.status(200).json({ response: true, addedTeam })
     }
     catch(error) {
          console.log(error);
          res.status(400).json({ response: false, message: error.message });
     }
}
module.exports.removeTeamInMatchByID = async(req,res) =>{
     try{
          const {matchId,teamId} = req.params
          const removeTeam  = await matchServices.removeTeamInMatchByID(matchId,teamId)
          
          if(!removeTeam) return res.status(200).json({ response: false, message: "Team remove failed in match data" })
          res.status(200).json({ response: true, message : 'Team removed sucessfully' })
     }
     catch(error) {
          console.log(error);
          res.status(400).json({ response: false, message: error.message });
     }
}
module.exports.matchTeamAndPlayersInfo = async(req,res) =>{
     try{
          const matchId = req.params.matchId
          const data  = await matchServices.matchTeamAndPlayersInfo(matchId)
          
          if(!data) return res.status(400).json({ response: false, message: "Not found" })
          res.status(200).json({ response: true, data })
     }
     catch(error) {
          console.log(error);
          res.status(400).json({ response: false, message: error.message });
     }
}