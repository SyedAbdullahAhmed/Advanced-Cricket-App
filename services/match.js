const boom = require("@hapi/boom");
const matchRepo = require('../repositories/match')

module.exports.createMatch = async (userId, teamId, payLoad) => {
     const createFields = {}
     try {
          const findPlayer = await matchRepo.findPlayer(userId)
          if (!findPlayer.role === 'captain') boom.badRequest('Only captain allowed to create match!')

          const team = await matchRepo.findTeam(teamId)
          if (team.players.length <= 11) boom.badRequest('11 players required to create a match!')

          if (payLoad.hasOwnProperty('date')) createFields.date = payLoad.date
          if (payLoad.hasOwnProperty('venue')) createFields.venue = payLoad.venue.toLowerCase()
          if (payLoad.hasOwnProperty('time')) createFields.time = payLoad.time

          // find duplicates for date , time and venue
          const findDuplicate = await matchRepo.findDuplicate(createFields)
          if (findDuplicate.length) throw boom.badRequest('Duplicates date, venue and time are not required')

          let match
          if (Object.keys(createFields).length > 0) match = await matchRepo.createTeam(createFields);
          if (match) {
               // console.log(match)
               // add team in match
               match.teamId.push(teamId)
               console.log(match)
               // add match in user match creation history
               let userMatchInfo = await matchRepo.findUserMatchInfo(userId)
               if (!userMatchInfo) userMatchInfo = await matchRepo.createUserMatchInfo(userId)
               console.log(userMatchInfo)
               userMatchInfo.createdMatch.push(match._id)
               console.log(userMatchInfo);
               await userMatchInfo.save()
          }
          await match.save()
          return match;
     }
     catch (error) {
          console.log(error);
          throw boom.badRequest(error.message);
     }
}

module.exports.updateMatchInfoByID = async (id, payLoad) => {
     try {
          const updateFields = {}

          if (payLoad.hasOwnProperty('date')) updateFields.date = payLoad.date
          if (payLoad.hasOwnProperty('venue')) updateFields.venue = payLoad.venue
          if (payLoad.hasOwnProperty('time')) updateFields.time = payLoad.time
          if (payLoad.hasOwnProperty('matchStatus')) updateFields.matchStatus = payLoad.matchStatus
          if (payLoad.hasOwnProperty('scoreboardId')) updateFields.scoreboardId = payLoad.scoreboardId
          if (payLoad.hasOwnProperty('umpireId')) updateFields.umpireId = payLoad.umpireId

          const duplicates = {
               date: updateFields.date,
               venue: updateFields.venue,
               time: updateFields.time
          }

          const findDuplicate = await matchRepo.findDuplicate(duplicates)
          if (findDuplicate.length) return null

          let updateMatch
          if (Object.keys(updateFields).length > 0) updateMatch = await matchRepo.updateMatchInfoByID(id, updateFields)

          return updateMatch
     }
     catch (error) {
          console.log(error);
          throw boom.badRequest(error.message);
     }
}

module.exports.addTeamInMatchByID = async (matchId, teamId) => {
     try {

          // find teams and matches
          const findTeam = await matchRepo.findTeam(teamId)
          const findMatch = await matchRepo.findMatch(matchId)

          // check for team length
          if (findTeam.players.length >= 11) boom.badRequest('11 players required to create a match!')

          if (!findTeam && !findMatch) boom.badRequest('Team Or match not found')

          // duplicates
          const duplicateTeam = findTeam.matchHistory.find((element) => element === matchId)
          const duplicateMatch = findMatch.teamId.find((element) => element === teamId)
          if (duplicateTeam && duplicateMatch) throw boom.badRequest('Duplicates teams are not allowed')

          // check for max 2 teams in a single match
          if (findMatch.teamId.length >= 2) throw boom.badRequest('Minimum 2 teams are allowed in a match')

          // maintain team match history and match info
          findTeam.matchHistory.push(matchId)
          // await findTeam.save()
          findMatch.teamId.push(teamId)

          // change status
          findMatch.matchStatus = 'scheduled'
         const match = await findMatch.save()

          let team1 = await matchRepo.findTeam(match.teamId[0])
          let team2 = await matchRepo.findTeam(match.teamId[1])

          // Using Promise.all
          const promises1 = team1.players.map(async (playerId) => {
               let player1 = await matchRepo.findUserMatchInfo(playerId);
               if(!player1) player1 = await matchRepo.createUserMatchInfo(playerId);
               player1.matchHistory.push(match._id);
               await player1.save();
          });

          const promises2 = team2.players.map(async (playerId) => {
               let player2 = await matchRepo.findUserMatchInfo(playerId);
               if(!player2) player2 = await matchRepo.createUserMatchInfo(playerId);
               player2.matchHistory.push(match._id);
               await player2.save();
          });

          await Promise.all([...promises1, ...promises2]);
          return true
     }
     catch (error) {
          console.log(error);
          throw boom.badRequest(error.message);
     }
}

module.exports.removeTeamInMatchByID = async (matchId, teamId) => {
     try {
          const findTeam = await matchRepo.findTeam(teamId)
          const findMatch = await matchRepo.findMatch(matchId)

          if (!findTeam && !findMatch) throw boom.badRequest('Duplicates teams are not allowed')

          findTeam.matchHistory = findTeam.matchHistory.filter((element) => element !== matchId)
          await findTeam.save()
          findMatch.teamId = findMatch.teamId.find((element) => element !== teamId)
          await findMatch.save()

          return {
               team: findTeam.matchHistory,
               match: findMatch.teamId
          }
     }
     catch (error) {
          console.log(error);
          throw boom.badRequest(error.message);
     }
}

module.exports.matchTeamAndPlayersInfo = async(matchId) => {
     try{
          const data = await matchRepo.matchTeamAndPlayersInfo(matchId)
          console.log(data)
          return data
     }catch (error) {
          console.log(error);
          throw boom.badRequest(error.message);
     }
}
