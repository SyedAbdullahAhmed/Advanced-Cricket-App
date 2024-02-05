const express = require('express')
const router = express.Router()

const teamController = require('../controllers/team')
const {imageUpload} = require('../middleware/imageUpload')
const {verifyToken} = require('../middleware/authentication')

// get all teams
router.get('/team',teamController.getTeams)

//get team by id
router.get('/teamByID/:id',teamController.getTeamByID)

// create team
router.post('/team',imageUpload,verifyToken,teamController.createTeam)

// update team information
router.put('/team/:id',imageUpload,verifyToken,teamController.updateTeamByID)

// delete team
router.delete('/team/:id',verifyToken,teamController.deleteTeamByID)

// update statistics and scores
router.put('/updateTeamScoresAndStats/:teamId',verifyToken,teamController.updateTeamScoreAndStatsById)

// add player in a team after invitation
router.post('/team/:teamId/player/:playerId',teamController.addPlayerInTeam)

// add umpire in a match after invitation
router.post('/team/:teamId/umpire/:umpireId/match/:matchId',teamController.addUmpireInMatch)

// remove player in a team 
router.delete('/team/:teamId/player/:playerId',teamController.removePlayerInTeam)

// get data of players present in the team
router.get('/getTeamPlayerData/:id',verifyToken,teamController.getTeamPlayerData)

// team invites player to play in their team
router.post('/teamInvitation/:teamId',verifyToken,teamController.teamInvitationToPlayers)

// team invites umpire to umpiring in their match 
router.post('/teamInvitation/:teamId/umpire/:umpireId',verifyToken,teamController.teamInvitationToUmpires)

// team invites teams to play against their team
router.post('/matchInvitation/:homeTeamId/opponentTeam/:opponentTeamId/match/:matchId',verifyToken,teamController.teamInvitationsToTeamsForMatch)

// list of invitations received for match
router.get('/getAllMatchInvitations/:teamId',verifyToken,teamController.getAllMatchInvitations)

// decline invitation received for match
router.delete('/declineMatchInvitations/:id/invitedTeam/:teamId',verifyToken,teamController.declineMatchInvitations)

// get team match hsitory
router.get('/teamMatchHistory/:teamId',teamController.getTeamMatchHistory)


module.exports = router
