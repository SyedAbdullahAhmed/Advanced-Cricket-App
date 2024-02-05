const playerBatting = require('../models/player/playerBatting')
const playerBowling = require('../models/player/playerBowling')
const playerFielding = require('../models/player/playerFielding')
const playerStatistics = require('../models/player/playerStatistics')
const teamScores = require('../models/team/teamScore')
const teamStatistics = require('../models/team/teamStatistics')

module.exports.findPlayerBatting = async (id) => {
     return await playerBatting.findOne({ playerId: id })
}
module.exports.createPlayerBatting = async (id) => {
     return playerBatting.create({ playerId: id })
}
module.exports.updatePlayerBatting = async (id, payLoad) => {
     return playerBatting.findOneAndUpdate({ playerId: id }, { $set: payLoad }, { new: true })
}

module.exports.findPlayerBowling = async (id) => {
     return await playerBowling.findOne({ playerId: id })
}
module.exports.createPlayerBowling = async (id) => {
     return playerBowling.create({ playerId: id })
}
module.exports.updatePlayerBowling = async (id, payLoad) => {
     return playerBowling.findOneAndUpdate({ playerId: id }, { $set: payLoad }, { new: true })
}

module.exports.findPlayerFielding = async (id) => {
     return await playerFielding.findOne({ playerId: id })
}
module.exports.createPlayerFielding = async (id) => {
     return playerFielding.create({ playerId: id })
}
module.exports.updatePlayerFielding = async (id, payLoad) => {
     return playerFielding.findOneAndUpdate({ playerId: id }, { $set: payLoad }, { new: true })
}

module.exports.findPlayerStatistics = async (id) => {
     return await playerStatistics.findOne({ playerId: id })
}
module.exports.createPlayerStatistics = async (id) => {
     return playerStatistics.create({ playerId: id })
}
module.exports.updatePlayerStatistics = async (id, payLoad) => {
     return playerStatistics.findOneAndUpdate({ playerId: id }, { $set: payLoad }, { new: true })
}

module.exports.findTeamStatistics = async (id) => {
     return await teamStatistics.findOne({ teamId: id })
}
module.exports.createTeamStatistics = async (id) => {
     return teamStatistics.create({ teamId: id })
}
module.exports.updateTeamStatistics = async (id, payLoad) => {
     return teamStatistics.findOneAndUpdate({ teamId: id }, { $set: payLoad }, { new: true })
}

module.exports.findTeamScores = async (id) => {
     return await teamScores.findOne({ teamId: id })
}
module.exports.createTeamScores = async (id) => {
     return teamScores.create({ teamId: id })
}
module.exports.updateTeamScores = async (id, payLoad) => {
     return teamScores.findOneAndUpdate({ teamId: id }, { $set: payLoad }, { new: true })
}