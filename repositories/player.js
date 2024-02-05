const playerInfoModel = require('../models/player/playerInfo')
const playerStatisticsModel = require('../models/player/playerStatistics')
const playerBattingModel = require('../models/player/playerBatting')
const playerBowlingModel = require('../models/player/playerBowling')
const playerFieldingModel = require('../models/player/playerFielding')
const playerModel = require('../models/player/playerInfo')
const TeamModel = require('../models/team/teamInformation')
const userModel = require('../models/user')
const { getPlayersOfTeam } = require('../repositories/team')
const teamInvitationModel = require('../models/team/teamInvitationToPlayers')
const teamMatchModel = require('../models/player/teamMatchInfo')
const mongoose = require('mongoose')
const teamScores = require('../models/team/teamScore')



exports.createNewPlayer = (payLoad) => {
    return playerModel.create(payLoad)
}


exports.createPlayerStatistics = async (id) => {
    return playerStatisticsModel.create({ playerId: id })
}

exports.createPlayerBatting = async (id) => {
    return playerBattingModel.create({ playerId: id })
}

exports.createPlayerBowling = async (id) => {
    return playerBowlingModel.create({ playerId: id })
}

exports.createPlayerFielding = async (id) => {
    return playerFieldingModel.create({ playerId: id })
}
exports.findById = (id) => {
    return playerModel.findOne({ _id: id })
}

exports.findPlayerById = async (id) => {
    return userModel.findOne({ _id: id })
}

exports.findPlayerBattingById = async (id) => {
    return playerBattingModel.findOne({ playerId: id })
}

exports.findPlayerBowlingById = async (id) => {
    return playerBowlingModel.findOne({ playerId: id })
}

exports.findPlayerFieldingById = async (id) => {
    return playerFieldingModel.findOne({ playerId: id })
}

exports.findPlayerStatisticsById = async (id) => {
    return playerStatisticsModel.findOne({ playerId: id })
}


exports.updatePlayerBatting = async (id, payLoad) => {
    return playerBattingModel.findOneAndUpdate({ playerId: id }, { $set: payLoad }, { new: true });

}

exports.updatePlayerBowling = async (id, payLoad) => {
    return playerBowlingModel.findOneAndUpdate({ playerId: id }, { $set: payLoad }, { new: true });

}

exports.updatePlayerFielding = async (id, payLoad) => {
    return playerFieldingModel.findOneAndUpdate({ playerId: id }, { $set: payLoad }, { new: true });

}

exports.updatePlayerStatistics = async (id, payLoad) => {
    return playerStatisticsModel.findOneAndUpdate({ playerId: id }, { $set: payLoad }, { new: true });

}


exports.getAllPlayers = async () => {
    return userModel.aggregate([
        {
            $lookup: {
                from: "playerbattings",
                localField: "_id",
                foreignField: "playerId",
                as: "batting",
            },
        },
        {
            $lookup: {
                from: "playerbowlings",
                localField: "_id",
                foreignField: "playerId",
                as: "bowling",
            },
        },
        {
            $lookup: {
                from: "playerfieldings",
                localField: "_id",
                foreignField: "playerId",
                as: "fielding",
            },
        },
        {
            $lookup: {
                from: "playerstatistics",
                localField: "_id",
                foreignField: "playerId",
                as: "statistics",
            },
        },
        {
            $lookup: {
                from: "playerinfos",
                localField: "_id",
                foreignField: "userId",
                as: "infos",
            },
        },
    ])
}


exports.getPlayer = async (id) => {
    return playerModel.aggregate([
        {
            $match: { userId: new mongoose.Types.ObjectId(id) },
        }
        , {
            $lookup: {
                from: "playerbowlings",
                localField: "_id",
                foreignField: "playerId",
                as: "bowling",
            }
        },
        {
            $lookup: {
                from: "playerbattings",
                localField: "_id",
                foreignField: "playerId",
                as: "batting",
            }
        },
        {
            $lookup: {
                from: "playerstatistics",
                localField: "_id",
                foreignField: "playerId",
                as: "statistics",
            }
        },
        {
            $lookup: {
                from: "playerfieldings",
                localField: "_id",
                foreignField: "playerId",
                as: "fielding",
            }
        },
        {
            $lookup: {
                from: "playerinfos",
                localField: "_id",
                foreignField: "userId",
                as: "infos",
            },
        },
    ])
}


exports.getPlayersForInvitation = () => {
    return userModel.aggregate([

        {
            $lookup: {
                from: "playerinfos",
                localField: "_id",
                foreignField: "userId",
                as: "UninvitedPlayers",
            }
        },
        {
            $match: {
                UninvitedPlayers: { $not: { $size: 0 } } // Filtering out documents without matching players
            }
        }
    ])
}

// exports.getTeam = async (id) => {
//     return await playerModel.findOne({ userId: id }).select('teamId')
// }

// exports.getPlayerTeamData = async (array) => {
//     return TeamModel.find({ _id: { $in: array } }).select(' _id name');

// }

module.exports.getPlayerTeamData = async (id) => {
    return playerModel.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(id) }
      },
      {
        $unwind: "$teamId"
      },
      {
        $lookup: {
          from: "teaminformations",
          let: { teamId: "$teamId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$teamId" }]
                }
              }
            }
          ],
          as: "teamScore",
        },
      },
      {
        $unwind: "$teamScore"
      },
      {
        $project: {
          _id: "$teamScore._id",
          name: "$teamScore.name"
        }
      }
    ]);
  };
  
  

module.exports.getInvitationsIds = async (userId) => {
    return await teamInvitationModel.aggregate([
      {
        $match : { invitedPlayers: userId}
      },
      {
        $project : {
          teamId : 1,
        }
      },
      {
        $lookup : {
          from : 'teaminformations',
          let : {teamIds : '$teamId'},
          pipeline : [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$teamIds" }]
                }
              }
            }
          ],
          as : 'teams'
        }
      },
      {
        $unwind : '$teams'
      },
      {
        $project : {
          teamId : 1,
          'teams.name' : 1
        }
      },
      {
        $addFields: {
          teamName: "$teams.name",
        },
      },
      {
        $project: {
          teams: 0,
        },
      }
    ])
}
module.exports.getAllInvitations = async (teamIdArray) => {
    return await TeamModel.find({ _id:{ $in: teamIdArray }}).select('_id name')
}

exports.getPlayersCount=()=>{
    return playerModel.countDocuments({})
}

module.exports.declineInvitation = async(teamId) => {
    return await teamInvitationModel.findOne({teamId:teamId})
}

module.exports.findTeamMatchInfo = async(userId) => {
    return await teamMatchModel.findOne({userId:userId})
}
module.exports.getTeamInfo = async(array) => {
    return await TeamModel.find({ _id:{ $in: array }}).select('_id name')
}

module.exports.getAllPlayersInfos = async() =>{
    return playerInfoModel.aggregate([
        {
            $lookup: {
                from: "playerbattings",
                localField: "userId",
                foreignField: "playerId",
                as: "batting",
            },
        },
        {
            $lookup: {
                from: "playerbowlings",
                localField: "userId",
                foreignField: "playerId",
                as: "bowling",
            },
        },
        {
            $lookup: {
                from: "playerfieldings",
                localField: "userId",
                foreignField: "playerId",
                as: "fielding",
            },
        },
        {
            $lookup: {
                from: "playerstatistics",
                localField: "userId",
                foreignField: "playerId",
                as: "statistics",
            },
        }
    ])}
exports.getPlayersOfTeam=(teamId)=>{
    return getPlayersOfTeam(teamId)
}

exports.getPlayers=()=>{
    return playerModel.find({})
}

module.exports.getPlayerMatchHistory = async(id) => {
    // return await teamMatchModel.find({userId:id}).select("matchHistory")
    return await teamMatchModel.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(id) }
      },
      {
        $project: {
          matchHistory: 1
        }
      },
      {
        $unwind: "$matchHistory"
      },
      {
        $lookup: {
          from: "matches",
          let: { matchHistoryId: "$matchHistory" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$matchHistoryId" }]
                }
              }
            }
          ],
          as: "match"
        }
      },
      {
        $unwind: "$match" 
      },
      {
        $unwind: "$match.teamId" 
      },
      {
        $lookup: {
          from: "teaminformations",
          let: { teaminformationsInfo: "$match.teamId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$teaminformationsInfo" }]
                }
              }
            }
          ],
          as: "teaminfo"
        }
      },
      {
        $project: {
          "match.date": 1,
          "match.venue": 1,
          "match.time": 1,
          "teaminfo.name": 1,
        }
      },
      {
        $group: {
          _id: {
            date: "$match.date",
            venue: "$match.venue",
            time: "$match.time",
        },
        teaminfo: { $addToSet: "$teaminfo" }
        }
      },
    ])
}

module.exports.getAllUmpires = async() => {
    return await userModel.aggregate([
        {
          $project: {
              _id: 1,
              fullName: 1,
              emailAddress: 1,
              dateOfBirth: 1,
              profilePicture: 1,
              bio: 1,
              address: 1,
              gender: 1,
              town: 1,
              country: 1,
              password: 1,
            lowercaseRole: { $toLower: '$role' },
          }
        },
        {
            $match: { lowercaseRole: 'umpire' }
        }
    ])
}