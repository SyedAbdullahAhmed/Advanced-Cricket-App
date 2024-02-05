const matchModel = require('../models/match')
const teamModel = require('../models/team/teamInformation')
const userModel = require('../models/user')
const teamMatchInfo = require('../models/player/teamMatchInfo')
const mongoose = require('mongoose')


module.exports.createTeam = async (payLoad) => {
     return matchModel.create(payLoad)
}

module.exports.getAllMatches = async () => {
     return await matchModel.find()
}

module.exports.getMatchByID = async (id) => {
     return await matchModel.findOne({ _id: id })
}

module.exports.updateMatchInfoByID = async (id, payLoad) => {
     return await matchModel.findOneAndUpdate({ _id: id }, { $set: payLoad }, { new: true })
}
module.exports.findDuplicate = async (payLoad) => {
     return await matchModel.find(payLoad)
}

module.exports.findTeam = async (id) => {
     return teamModel.findOne({ _id: id })
}

module.exports.findMatch = async (id) => {
     return matchModel.findOne({ _id: id })
}

module.exports.findPlayer = async (id) => {
     return userModel.findOne({ _id: id })
}
module.exports.findUserMatchInfo = async (userId) => {
     return teamMatchInfo.findOne({ userId: userId })
}
module.exports.teamMatchInfoTeamA = async (userId) => {
     return teamMatchInfo.create({ userId: userId })
}
module.exports.createUserMatchInfo = async (id) => {
     return teamMatchInfo.create({ userId: id })
}

module.exports.matchTeamAndPlayersInfo = async (matchId) => {
     return matchModel.aggregate([
          {
            $match: { _id: new mongoose.Types.ObjectId(matchId) }
          },
          {
            $unwind: '$teamId'
          },
          {
            $project: {
              teamId: 1,
              date: 1,
              time: 1,
              venue: 1,
              matchStatus: 1,
              matchResult: 1
            }
          },
          {
            $lookup: {
              from: 'teaminformations',
              let: { teamId: '$teamId' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ['$_id', { $toObjectId: '$$teamId' }]
                    }
                  }
                },
              ],
              as: 'teams'
            }
          },
          {
            $project: {
              "teams._id": 1,
              "teams.name": 1,
              "teams.players": 1,
              date: 1,
              time: 1,
              venue: 1,
              matchStatus: 1,
              matchResult: 1
            }
          },
          {
            $unwind: '$teams'
          },
          {
            $unwind: '$teams.players'
          },
          {
            $lookup: {
              from: 'users',
              let: { playerinfo: '$teams.players' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ['$_id', { $toObjectId: '$$playerinfo' }]
                    }
                  }
                },
              ],
              as: 'playersinfo'
            }
          },
          {
            $unwind: '$playersinfo'
          },
          {
            $group: {
              _id: '$teams._id',
              teamName: { $first: '$teams.name' },
              playersInfo: {
                $push: {
                  playerId: '$playersinfo._id',
                  playerName: '$playersinfo.fullName'
                }
              },
              date: { $first: '$date' },
              time: { $first: '$time' },
              venue: { $first: '$venue' },
              matchStatus: { $first: '$matchStatus' },
              matchResult: { $first: '$matchResult' }
            }
          },
          {
            $project: {
              _id: 0,
              teamName: 1,
              playersInfo: 1,
              date: 1,
              time: 1,
              venue: 1,
              matchStatus: 1,
              matchResult: 1
            }
          }
        ])
        
}