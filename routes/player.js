const express=require('express')
const router=express.Router()
const {verifyToken}=require('../middleware/authentication')
const { getAllUmpires,getPlayerMatchHistory, getAllPlayersInfos,createdByPlayer,declineInvitation,allInvitations,createNewPlayer, updatePerformance,getAllPlayers,getPlayer,getPlayersForInvitation,getPlayerTeamData } = require('../controllers/player')

// create player
router.post('/createPlayer',verifyToken,createNewPlayer)

// update player stats
router.post('/updatePerformance',verifyToken,updatePerformance)

//  get all players
router.get('/getAllPlayers',getAllPlayers)

// get all players info
router.get('/getAllPlayersInfo',verifyToken,getAllPlayersInfos)

// get player
router.get('/getPlayer',verifyToken,getPlayer)

// get players for available for invitation
router.post('/getPlayersForInvitation/:teamId',verifyToken,getPlayersForInvitation)

// get player team data
router.get('/getPlayerTeamData',verifyToken,getPlayerTeamData)

// get all invitations for player
router.get('/allInvitations',verifyToken,allInvitations)

// decline invitation
router.delete('/declineInvitation/:teamId',verifyToken,declineInvitation)

// get team,match,and history created by player
router.get('/createdByPlayer',verifyToken,createdByPlayer)

// get player and umpire match history
router.get('/playerMatchHistory',verifyToken,getPlayerMatchHistory)

// get all umpires
router.get('/getAllUmpires',getAllUmpires)


module.exports=router
