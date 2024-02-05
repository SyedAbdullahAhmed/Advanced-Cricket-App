const teamRepo = require('../repositories/team')
const boom = require("@hapi/boom");
const mongoose = require('mongoose')

module.exports.createTeam = async (userId, payLoad) => {
     // check for all fields
     const createFields = {}

     try {

          // find that he is not already owned a team
          const player = await teamRepo.findPlayer(userId)
          console.log(player)
          // if(player.role.toLowerCase() === 'captain') throw boom.badRequest('One player allowed to create one team!')


          if (payLoad.hasOwnProperty('name') && payLoad.name) createFields.name = payLoad.name
          if (payLoad.hasOwnProperty('image') && payLoad.image) createFields.image = payLoad.image
          if (payLoad.hasOwnProperty('captain') && payLoad.captain) createFields.captain = payLoad.captain
          if (payLoad.hasOwnProperty('description') && payLoad.description) createFields.description = payLoad.description
          if (payLoad.hasOwnProperty('sports') && payLoad.sports) createFields.sports = payLoad.sports
          if (payLoad.hasOwnProperty('abbreviation') && payLoad.abbreviation) createFields.abbreviation = payLoad.abbreviation
          // call repos
          // console.log(createFields)
          let createdTeam
          if (Object.keys(createFields).length > 0) createdTeam = await teamRepo.createTeam(createFields);


          const captain = {
               role: 'captain'
          }
          if (createdTeam) {
               // set player role to captain
               await teamRepo.updatePlayerToCaptain(userId, captain)
               const teamId = createdTeam._id

               // assign player as current team captain
               await teamRepo.assignTeamCaptain(userId, teamId)

               // add current player to created team
               createdTeam.players.push(userId)
               await createdTeam.save()

               // add in team match info of current user
               // add to current user teams list
               let teamMatchInfo = await teamRepo.findTeamMatchInfo(userId)
               console.log(teamMatchInfo)

               if (!teamMatchInfo) teamMatchInfo = await teamRepo.createTeamMatchInfo(userId)
               console.log(teamId)

               teamMatchInfo.createdTeam.push(teamId)
               console.log(teamMatchInfo.createdTeam)
               await teamMatchInfo.save()

          }

          return createdTeam;
     }
     catch (error) {
          console.log(error);
          throw boom.badRequest(error.message);
     }
}

module.exports.updateTeamByID = async (id, payLoad) => {
     // check for all fields
     const updateFields = {}
     try {
          if (payLoad.hasOwnProperty('name')) updateFields.name = payLoad.name
          if (payLoad.hasOwnProperty('captain')) updateFields.captain = payLoad.captain
          if (payLoad.hasOwnProperty('image')) updateFields.image = payLoad.image
          if (payLoad.hasOwnProperty('description')) updateFields.description = payLoad.description
          if (payLoad.hasOwnProperty('sports')) updateFields.sports = payLoad.sports
          if (payLoad.hasOwnProperty('abbreviation')) updateFields.abbreviation = payLoad.abbreviation

          // call repos
          let updatedTeam
          if (Object.keys(updateFields).length > 0) updatedTeam = await teamRepo.updateTeamByID(id, updateFields);
          return updatedTeam;
     }
     catch (error) {
          console.log(error);
          throw boom.badRequest(error.message);
     }
}

module.exports.updateTeamScoresById = async (id, payLoad) => {
     const updateFields = {}
     try {
          let teamScore = await teamRepo.findTeamScoreById(id) || false;
          if (!teamScore) teamScore = await teamRepo.createTeamScoreById(id);

          if (payLoad.hasOwnProperty('highestTeamScore')) updateFields.highestTeamScore = payLoad.highestTeamScore
          if (payLoad.hasOwnProperty('lowestTeamScore')) updateFields.lowestTeamScore = payLoad.lowestTeamScore

          // call repos
          let updatedTeam
          if (Object.keys(updateFields).length > 0) updatedTeam = await teamRepo.updateTeamScoreById(id, updateFields);

          return updatedTeam;
     }
     catch (error) {
          console.log(error);
          throw boom.badRequest(error.message)
     }
}

module.exports.updateTeamStatisticsById = async (id, payLoad) => {
     const updateFields = {}
     try {
          let teamStatistics = await teamRepo.findTeamStatisticsById(id) || false;
          if (!teamStatistics) teamStatistics = await teamRepo.createTeamStatisticsById(id);

          if (payLoad.hasOwnProperty('totalMatchesPlayed')) updateFields.totalMatchesPlayed = payLoad.totalMatchesPlayed
          if (payLoad.hasOwnProperty('totalWins')) updateFields.totalWins = payLoad.totalWins
          if (payLoad.hasOwnProperty('totalLosses')) updateFields.totalLosses = payLoad.totalLosses
          if (payLoad.hasOwnProperty('totalDraws')) updateFields.totalDraws = payLoad.totalDraws
          if (payLoad.hasOwnProperty('winningPercentage')) updateFields.winningPercentage = payLoad.winningPercentage

          // call repos
          let updatedTeam
          if (Object.keys(updateFields).length > 0) updatedTeam = await teamRepo.updateTeamStatisticsById(id, updateFields);

          return updatedTeam;
     }
     catch (error) {
          console.log(error);
          throw boom.badRequest(error.message)
     }
}

module.exports.addPlayerInTeam = async (playerId, teamId) => {
     try {

          const payLoad = {
               userId: playerId,
               playingRole: "Cricket"
          }
          // find team
          const findTeam = await teamRepo.findTeam(teamId)
          if (!findTeam) boom.badRequest('Team not found')

          // find player info
          let playerInfo = await teamRepo.findPlayerInfo(playerId)

          //else create it
          if (!playerInfo) playerInfo = await teamRepo.createPlayerInfo(payLoad)
          // console.log(playerId)
          // console.log(playerInfo)
          // check for duplicates players and teams


          const duplicatesInWholeModel = await teamRepo.findDuplicate(playerId)
          const duplicatePlayers = findTeam.players.find((element) => element === playerId);
          const duplicateTeams = playerInfo.teamId.find((element) => element === teamId);

          if (duplicatesInWholeModel.length !== 0 || duplicatePlayers || duplicateTeams) throw boom.badRequest('Duplicates players are not allowed')

          // check for team length
          if (findTeam.players.length >= 11) throw boom.badRequest('Minimum 11 players required in a team')

          // save data in database
          findTeam.players.push(playerId)
          playerInfo.teamId.push(teamId)
          await playerInfo.save()
          await findTeam.save()

          let findInvitedPlayers = await teamRepo.declineInvitation(teamId)
          findInvitedPlayers.invitedPlayers = findInvitedPlayers.invitedPlayers.filter((element) => element !== playerId);
          await findInvitedPlayers.save()

          return {
               players: findTeam.players,
               teamId: playerInfo.teamId
          };

     }
     catch (error) {
          console.log(error);
          throw boom.badRequest(error.message)
     }
}

module.exports.removePlayerInTeam = async (playerId, teamId) => {
     try {

          const payLoad = {
               userId: playerId,
               playingRole: "Cricket"
          }
          // find team
          const findTeam = await teamRepo.findTeam(teamId)
          if (!findTeam) return boom.badRequest('Team not found')

          // find player info
          let playerInfo = await teamRepo.findPlayerInfo(playerId)
          if (!playerInfo) playerInfo = await teamRepo.createPlayerInfo(payLoad)

          // filter player and save 
          playerInfo.teamId = playerInfo.teamId.filter((element) => element !== teamId);
          findTeam.players = findTeam.players.filter((element) => element !== playerId);
          console.log(playerInfo)
          await playerInfo.save()
          await findTeam.save()

          //  // filter team and save 

          return {
               findTeam: findTeam.players,
               playerInfo: playerInfo.teamId
          }
     }
     catch (error) {
          console.log(error);
          throw boom.badRequest(error.message)
     }
}

module.exports.findCaptain = async (id) => {
     try {
          const findPlayer = await teamRepo.findPlayer(id)
          return findPlayer.role === 'captain';
     }
     catch (error) {
          console.log(error);
          throw boom.badRequest(error.message);
     }
}

module.exports.getTeamPlayerData = async (teamId) => {
     try {
          const findPlayersData = await teamRepo.findPlayers(teamId)
          if (!findPlayersData) throw boom.badRequest('Team players not found')
          const findTeamPlayers = await teamRepo.getTeamPlayerData(findPlayersData.players)
          return findTeamPlayers
     }
     catch (error) {
          console.log(error)
          throw boom.badRequest(error.message)
     }
}

module.exports.teamInvitationToPlayers = async (teamId, payLoad, userId) => {
     try {

          // check captain
          const user = await teamRepo.findPlayer(userId)
          if (user.role.toLowerCase() !== 'captain') throw boom.badRequest('Only captain allow to send invitation')

          // find invitation model if not found create
          let playerInvitation = await teamRepo.findInvitationModel(teamId)
          if (!playerInvitation)
               playerInvitation = await teamRepo.createInvitationModel(teamId)

          // check for duplicates
          const invitedPlayers = playerInvitation.invitedPlayers;

          for (let i = 0; i < payLoad.length; i++) {
               const playerId = payLoad[i];

               // Check for duplicates
               const duplicates = invitedPlayers.find((element) => element === playerId);
               if (duplicates)  throw boom.badRequest('Duplicates Invitation are not allowed');
               invitedPlayers.push(playerId);
               console.log(invitedPlayers);
          }
          await playerInvitation.save();
          return invitedPlayers;
     }
     catch (error) {
          console.log(error)
          throw boom.badRequest(error.message)
     }
}

module.exports.teamInvitationToTeamsForMatch = async (userId, homeTeamId, opponentTeamId, matchId) => {
     try {
          // check captain
          const user = await teamRepo.findPlayer(userId)
          if (user.role.toLowerCase() !== 'captain') throw boom.badRequest('Only captain allow to send invitation')

          // find invitation model if not found create
          let teamInvitation = await teamRepo.findInvitationModel(homeTeamId)
          if (!teamInvitation)
               teamInvitation = await teamRepo.createInvitationModel(homeTeamId)

          // check for duplicates
          const invitedTeams = teamInvitation.invitedTeams
          const duplicates = invitedTeams.find((element) => element.matchId.equals(matchId) && element.opponentTeamId.equals(opponentTeamId))

          if (duplicates) throw boom.badRequest('Duplicates Invitation are not allowed')

          // push and save
          const object = {
               matchId: matchId,
               opponentTeamId: opponentTeamId
          }
          invitedTeams.push(object)
          await teamInvitation.save()
          return invitedTeams
     }
     catch (error) {
          console.log(error)
          throw boom.badRequest(error.message)
     }
}

module.exports.getAllMatchInvitations = async (teamId) => {
     try {
          const team = await teamRepo.findTeam(teamId)
          if (!team) throw boom.badRequest('Team not found')

          const invitationIds = await teamRepo.getInvitationsIds(teamId)
          console.log(invitationIds)

          const teamIdArray = invitationIds.map(invitation => invitation.teamId);
          const invitationInfo = await teamRepo.getAllInvitations(teamIdArray)
          console.log(invitationInfo)
          return invitationInfo
     }
     catch (error) {
          console.log(error);
          throw boom.badRequest(error.message);
     }
}

module.exports.declineInvitation = async (teamId, invitedTeam) => {
     try {
          const findTeamInvitations = await teamRepo.findInvitationModel(invitedTeam)
          console.log(findTeamInvitations.invitedTeams)

          findTeamInvitations.invitedTeams = findTeamInvitations.invitedTeams.filter((element) => !element.opponentTeamId.equals(teamId))
          console.log(findTeamInvitations.invitedTeams)
          await findTeamInvitations.save()
          return findTeamInvitations
     }
     catch (error) {
          console.log(error);
          throw boom.badRequest(error.message);
     }
}

module.exports.teamInvitationToUmpires = async (teamId, umpireId, userId) => {
     try {
          // check captain
          const user = await teamRepo.findPlayer(userId)
          if (user.role.toLowerCase() !== 'captain') throw boom.badRequest('Only captain allow to send invitation')

          // find invitation model if not found create
          let umpireInvitation = await teamRepo.findInvitationModel(teamId)
          if (!umpireInvitation)
               umpireInvitation = await teamRepo.createInvitationModel(teamId)
          console.log(umpireInvitation)
          // check for duplicates
          const invitedUmpire = umpireInvitation.invitedUmpires
          const duplicates = invitedUmpire.find((element) => element === umpireId)
          if (duplicates) throw boom.badRequest('Duplicates Invitation are not allowed')

          invitedUmpire.push(umpireId)
          console.log(umpireInvitation)

          await umpireInvitation.save()
          return invitedUmpire
     }
     catch (error) {
          console.log(error)
          throw boom.badRequest(error.message)
     }
}

module.exports.addUmpireInMatch = async (umpireId, teamId, matchId) => {
     try {

          const findTeam = await teamRepo.findTeam(teamId)
          if (!findTeam) boom.badRequest('Team not found')

          const user = await teamRepo.findPlayer(umpireId)
          if (user.role.toLowerCase() !== 'umpire') throw boom.badRequest('user is not umpire')

          const match = await teamRepo.findMatch(matchId)
          if (!match) throw boom.badRequest('Match does not found')

          const duplicates = match.umpireId.find((element) => element === umpireId)
          if (duplicates) throw boom.badRequest('Duplicates umpires are not allowed')

          if (match.umpireId.length >= 3) throw boom.badRequest('Only 3 umpires are allowed')

          match.umpireId.push(umpireId)
          await match.save()

          let findInvitedUmpires = await teamRepo.declineInvitation(teamId)
          console.log(findInvitedUmpires)
          findInvitedUmpires.invitedUmpires = findInvitedUmpires.invitedUmpires.filter((element) => element !== umpireId);
          await findInvitedUmpires.save()

          let teamMatchInfo = await teamRepo.findTeamMatchInfo(umpireId)
          if(!teamMatchInfo) teamMatchInfo = await teamRepo.createTeamMatchInfo(umpireId)
          teamMatchInfo.matchHistory.push(matchId)
          await teamMatchInfo.save()
         
          return true
     }
     catch (error) {
          console.log(error);
          throw boom.badRequest(error.message)
     }
}
module.exports.getTeamMatchHistory = async(teamId) => {
     try{
          const team = await teamRepo.findTeam(teamId)
          if(!team) throw boom.badRequest('Team not found')

          const history = await teamRepo.getTeamMatchHistory(teamId)
          console.log(history)
          return history
     }catch(error) {
          console.log(error);
          throw boom.badRequest(error.message)
     }
}